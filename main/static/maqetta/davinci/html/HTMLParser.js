dojo.provide("davinci.html.HTMLParser");

dojo.require("davinci.html.HTMLModel");
dojo.require("davinci.model.parser.Tokenizer");


/* This file defines an XML parser, with a few kludges to make it
 * useable for HTML. autoSelfClosers defines a set of tag names that
 * are expected to not have a closing tag, and doNotIndent specifies
 * the tags inside of which no indentation should happen (see Config
 * object). These can be disabled by passing the editor an object like
 * {useHTMLKludges: false} as parserConfig option.
 */

davinci.html.XMLParser  = (function() {
  var Kludges = {
    autoSelfClosers: {"br": true, "img": true, "hr": true, "link": true, "input": true,
                      "meta": true, "col": true, "frame": true, "base": true, "area": true},
    doNotIndent: {"pre": true, "!cdata": true}
  };
  var NoKludges = {autoSelfClosers: {}, doNotIndent: {"!cdata": true}};
  var UseKludges = Kludges;
  var alignCDATA = false;

  // Simple stateful tokenizer for XML documents. Returns a
  // MochiKit-style iterator, with a state property that contains a
  // function encapsulating the current state. See tokenize.js.
  var tokenizeXML = (function() {
    function inText(source, setState) {
      var ch = source.next();
      if (ch == "<") {
        if (source.equals("!")) {
          source.next();
          if (source.equals("[")) {
            if (source.lookAhead("[CDATA[", true)) {
              setState(inBlock("xml-cdata", "]]>"));
              return null;
            }
            else {
              return "xml-text";
            }
          }
          else if (source.lookAhead("--", true)) {
            setState(inBlock("xml-comment", "-->"));
            return null;
          }
          else if (source.lookAhead("DOCTYPE", true)) {
            source.nextWhileMatches(/[\w\._\-]/);
            setState(inBlock("xml-doctype", ">"));
            return "xml-doctype";
          }
          else {
            return "xml-text";
          }
        }
        else if (source.equals("?")) {
          source.next();
          source.nextWhileMatches(/[\w\._\-]/);
          setState(inBlock("xml-processing", "?>"));
          return "xml-processing";
        }
        else {
          if (source.equals("/")) source.next();
          setState(inTag);
          return "xml-punctuation";
        }
      }
      else if (ch == "&") {
        while (!source.endOfLine()) {
          if (source.next() == ";")
            break;
        }
        return "xml-entity";
      }
      else {
        source.nextWhileMatches(/[^&<\n]/);
        return "xml-text";
      }
    }

    function inTag(source, setState) {
      var ch = source.next();
      if (ch == ">") {
        setState(inText);
        return "xml-punctuation";
      }
      else if (/[?\/]/.test(ch) && source.equals(">")) {
        source.next();
        setState(inText);
        return "xml-punctuation";
      }
      else if (ch == "=") {
        return "xml-punctuation";
      }
      else if (/[\'\"]/.test(ch)) {
        setState(inAttribute(ch));
        return null;
      }
      else {
        source.nextWhileMatches(/[^\s\u00a0=<>\"\'\/?]/);
        return "xml-name";
      }
    }

    function inAttribute(quote) {
      return function(source, setState) {
        while (!source.endOfLine()) {
          if (source.next() == quote) {
            setState(inTag);
            break;
          }
        }
        return "xml-attribute";
      };
    }

    function inBlock(style, terminator) {
      return function(source, setState) {
        while (!source.endOfLine()) {
          if (source.lookAhead(terminator, true)) {
            setState(inText);
            break;
          }
          source.next();
        }
        return style;
      };
    }

    return function(source, startState) {
      return davinci.model.parser.tokenizer(source, startState || inText);
    };
  })();

  // The parser. The structure of this function largely follows that of
  // parseJavaScript in parsejavascript.js (there is actually a bit more
  // shared code than I'd like), but it is quite a bit simpler.
  function parseXML(source) {
    var tokens = tokenizeXML(source), token;
    var cc = [base];
    var tokenNr = 0, indented = 0;
    var currentTag = null, context = null;
    var consume;
    
    function push(fs) {
      for (var i = fs.length - 1; i >= 0; i--)
        cc.push(fs[i]);
    }
    function cont() {
      push(arguments);
      consume = true;
    }
    function pass() {
      push(arguments);
      consume = false;
    }

    function markErr() {
      token.style += " xml-error";
    }
    function expect(text) {
      return function(style, content) {
        if (content == text) cont();
        else {markErr(); cont(arguments.callee);}
      };
    }

    function pushContext(tagname, startOfLine) {
      var noIndent = UseKludges.doNotIndent.hasOwnProperty(tagname) || (context && context.noIndent);
      context = {prev: context, name: tagname, indent: indented, startOfLine: startOfLine, noIndent: noIndent};
    }
    function popContext() {
      context = context.prev;
    }
    function computeIndentation(baseContext) {
      return function(nextChars, current) {
        var context = baseContext;
        if (context && context.noIndent)
          return current;
        if (alignCDATA && /<!\[CDATA\[/.test(nextChars))
          return 0;
        if (context && /^<\//.test(nextChars))
          context = context.prev;
        while (context && !context.startOfLine)
          context = context.prev;
        if (context)
          return context.indent + indentUnit;
        else
          return 0;
      };
    }

    function base() {
      return pass(element, base);
    }
    var harmlessTokens = {"xml-text": true, "xml-entity": true, "xml-comment": true, "xml-processing": true, "xml-doctype": true};
    function element(style, content) {
      if (content == "<") cont(tagname, attributes, endtag(tokenNr == 1));
      else if (content == "</") cont(closetagname, expect(">"));
      else if (style == "xml-cdata") {
        if (!context || context.name != "!cdata") pushContext("!cdata");
        if (/\]\]>$/.test(content)) popContext();
        cont();
      }
      else if (harmlessTokens.hasOwnProperty(style)) cont();
      else {markErr(); cont();}
    }
    function tagname(style, content) {
      if (style == "xml-name") {
        currentTag = content.toLowerCase();
        token.style = "xml-tagname";
        cont();
      }
      else {
        currentTag = null;
        pass();
      }
    }
    function closetagname(style, content) {
      if (style == "xml-name") {
        token.style = "xml-tagname";
        if (context && content.toLowerCase() == context.name) popContext();
        else markErr();
      }
      cont();
    }
    function endtag(startOfLine) {
      return function(style, content) {
        if (content == "/>" || (content == ">" && UseKludges.autoSelfClosers.hasOwnProperty(currentTag))) cont();
        else if (content == ">") {pushContext(currentTag, startOfLine); cont();}
        else {markErr(); cont(arguments.callee);}
      };
    }
    function attributes(style) {
      if (style == "xml-name") {token.style = "xml-attname"; cont(attribute, attributes);}
      else pass();
    }
    function attribute(style, content) {
      if (content == "=") cont(value);
      else if (content == ">" || content == "/>") pass(endtag);
      else pass();
    }
    function value(style) {
      if (style == "xml-attribute") cont(value);
      else pass();
    }

    return {
      indentation: function() {return indented;},

      next: function(){
        token = tokens.next();
        if (token.style == "whitespace" && tokenNr == 0)
          indented = token.value.length;
        else
          tokenNr++;
        if (token.content == "\n") {
          indented = tokenNr = 0;
          token.indentation = computeIndentation(context);
        }

        if (token.style == "whitespace" || token.type == "xml-comment")
          return token;

        while(true){
          consume = false;
          cc.pop()(token.style, token.content);
          if (consume) return token;
        }
      },

      copy: function(){
        var _cc = cc.concat([]), _tokenState = tokens.state, _context = context;
        var parser = this;
        
        return function(input){
          cc = _cc.concat([]);
          tokenNr = indented = 0;
          context = _context;
          tokens = tokenizeXML(input, _tokenState);
          return parser;
        };
      }
    };
  }

  return {
    make: parseXML,
    electricChars: "/",
    configure: function(config) {
      if (config.useHTMLKludges != null)
        UseKludges = config.useHTMLKludges ? Kludges : NoKludges;
      if (config.alignCDATA)
        alignCDATA = config.alignCDATA;
    }
  };
})();


davinci.html.HTMLParser.parse=function(text,parentElement)
{
//	  debugger;
	  var txtStream = { next : function () {if (++this.count==1)  return text; else {throw StopIteration;}} , count:0, text:text};
	  var stream=davinci.model.parser.stringStream(txtStream);
	  var parser = davinci.html.XMLParser.make(stream);
	  var token;
	  var errors=[];
	  function error(text){console.log("ERROR: "+text); errors.push(text)}
	  
	  var stack=[];
	  stack.push(parentElement);
	  var htmlText;
	  var inComment;
	  
	  function addText(text,offset)
	  {
       htmlText=new davinci.html.HTMLText();
       htmlText.wasParsed=true;
       htmlText.startOffset=offset;
        stack[stack.length-1].addChild(htmlText,undefined,true);
	      htmlText.value=text;

	  }
	  
	  function addTrailingWS(token)
	  {
		  if (token.content!=token.value)
		  {
			  addText(token.value.substring(token.content.length),token.offset+token.value.length);
		  }
	  }

	  function updateFMInfo(str,element)
	  {
			 var lines=str.split("\n");
			 var indent=lines[lines.length-1].length;
			 if (element.children.length)
			 {
				 lastElement=element.children[element.children.length-1];
			   lastElement._fmLine=lines.length-1;
			   lastElement._fmIndent=indent;
			 }
			 else
			 {
				 element._fmChildLine=lines.length-1;
				 element._fmChildIndent=indent;
			 }

	  }
	  function updateText()
	  {
		   if (htmlText!=null && !htmlText.value.match(/\S/))
		   {
			 
			   var lastElement=stack[stack.length-1];
			   lastElement.children.pop();	// remove the htmlText
			   updateFMInfo(htmlText.value,lastElement);
		   }
		   htmlText=null;

	  }
	  
	  function parseStyle()
	  {
		  var lastElement=stack[stack.length-1];
		  stream.nextWhileMatches(/[\s\u00a0]/);
		  var str=stream.get();
		  if (htmlText!=null)
		  {
			 htmlText.value+=str;
			 updateText();
		  }
		  else
		     updateFMInfo(str,lastElement);
		  davinci.html.CSSParser.parse(stream,lastElement);
	  }
	  
	  function nextToken(ignoreWS)
	  {
          token=parser.next();
          while (ignoreWS &&  token.style=="whitespace")
	  	{
            token = parser.next();
	  	}
          return token;
	  }

	  
	  try {
		  
	  do {
		  token=parser.next();
//		  console.log("style="+token.style + "  type="+token.type + "  ==> "+token.value);
		  switch (token.style)
		  {
		  case "xml-punctuation" :
		   {
			   updateText();
			    if (token.content=="<")
			    {
			          var model=new davinci.html.HTMLElement();
			          model.wasParsed=true;
			          model.startOffset=token.offset;
			          stack[stack.length-1].addChild(model,undefined,true);
					  nextToken(true);
					  if (token.style=="xml-tagname")
						  model.tag=token.content;
					  else
						  error("expecting tag name")
						  
					  while ((token=nextToken(true)).style=="xml-attname")
					  {
		                     var attribute=new davinci.html.HTMLAttribute();
		                     attribute.wasParsed=true;
		                     model.attributes.push(attribute);
		                     attribute.name=token.content;
		                     attribute.startOffset=token.offset;
				             nextToken(true);
		                     if (token.content=="=")
		                     {
			                     token=parser.next();
			                     if (token.style=="xml-attribute")
			                     {
			                    	 var s=token.content;
			                    	 attribute.setValue(s.substring(1,s.length-1));
			                    	 
			                     }
			                     else
			                    	 error ("expecting attribute value");
		                    	 
		                     }
		                     else
		                     {
	                        	 attribute.noValue=true;
	                        	 attribute.setValue(true);
		                     }
		                     attribute.endOffset=token.offset-1;
		                     if (attribute.noValue && token.style!="xml-attname")
		                    	 break;
		                     
					  }
					  if (token.style!="xml-punctuation")
						  error("expecting >")
					  else
					  {
						model.startTagOffset=token.offset;
						if (token.content==">")
							stack.push(model);
						else
						{
							model.noEndTag=true;
							model=stack[stack.length-1]
						}
						addTrailingWS(token);
					  }
					  if (model.tag=="style")
					  {
						  parseStyle();
					  }
					  
			    }
			    else if (token.value=="</")
			    {
			    	var prevModel=model;
			    	token=parser.next();
//			    	if (model.tag!=token.content)
//			    		debugger;
//			    		throw StopIteration ; // give up
			    	if (model.tag=="script")
			    	  model.script=model.getElementText();
			    	stack.pop();
			    	model=stack[stack.length-1];
			    	token=parser.next();
			    	prevModel.endOffset=token.offset;
					addTrailingWS(token);
			    }
		   }
		   break;
		  case "xml-text" :
		  case "whitespace" :
		  case "xml-entity" :
		   {
			   if (inComment)
			   {
				   inComment.value+=token.value;
			   }
			   else
			   if (!htmlText)
			   {
				   addText(token.value,token.offset);
			   }
			   else
				   htmlText.value+=token.value;

		   }
		   break;
		  case "xml-comment" :
		   {
			   updateText();
             var comment=new davinci.html.HTMLComment();
             comment.wasParsed=true;
             comment.startOffset=token.offset;
             comment.value=token.content.substring(4,token.content.length-3);
             comment.endOffset=token.offset+token.content.length;
             stack[stack.length-1].addChild(comment,undefined,true);

		   }
		   break;
		  case "xml-doctype" :
		   {
		 if (!inComment)
			 {
			 
			   updateText();
			   var comment=new davinci.html.HTMLComment();
			   comment.wasParsed=true;
			   comment.startOffset=token.offset;
			   	comment.value=token.value.substring(2);
			   	stack[stack.length-1].addChild(comment,undefined,true);
			   	comment.isProcessingInstruction=true;
			   	token=parser.next();
			 }
            var lastChar=token.content.length-1;
            if (token.content.charAt(token.content.length-1)==">")
            {
                comment.endOffset=token.offset+token.content.length;
                comment.value+=token.content.substring(0,lastChar)
 			   addTrailingWS(token);
                inComment=undefined;
            }
            else
            {
            	inComment=comment;
                comment.value+=token.content;
            	
            }
            

		   }
		   break;		  }
	  } while (true);
	  } catch (e) {}
	  
	  return { errors:errors, endOffset:(token?token.offset:0)};
}