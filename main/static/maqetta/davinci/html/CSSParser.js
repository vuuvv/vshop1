dojo.provide("davinci.html.CSSParser");

dojo.require("davinci.html.CSSModel");
dojo.require("davinci.model.parser.Tokenizer");

davinci.html.CSSParser  = (function() {
  var tokenizeCSS = (function() {
    function normal(source, setState) {
      var ch = source.next();
      if (ch == "@") {
        source.nextWhileMatches(/\w/);
        return "css-at";
      }
      else if (ch == "/" && source.equals("*")) {
        setState(inCComment);
        return null;
      }
      else if (ch == "<" && source.equals("!")) {
        setState(inSGMLComment);
        return null;
      }
      else if (ch == "=") {
        return "css-compare";
      }
      else if (source.equals("=") && (ch == "~" || ch == "|")) {
        source.next();
        return "css-compare";
      }
      else if (ch == "\"" || ch == "'") {
        setState(inString(ch));
        return null;
      }
      else if (ch == "#") {
        source.nextWhileMatches(/\w/);
        return "css-hash";
      }
      else if (ch == "!") {
        source.nextWhileMatches(/[ \t]/);
        source.nextWhileMatches(/\w/);
        return "css-important";
      }
      else if (/\d/.test(ch)) {
        source.nextWhileMatches(/[\w.%]/);
        return "css-unit";
      }
      else if (/[,.+>*\/]/.test(ch)) {
        return "css-select-op";
      }
      else if (/[;{}:\[\]]/.test(ch)) {
        return "css-punctuation";
      }
      else {
        source.nextWhileMatches(/[\w\\\-_]/);
        return "css-identifier";
      }
    }

    function inCComment(source, setState) {
      var maybeEnd = false;
      while (!source.endOfLine()) {
        var ch = source.next();
        if (maybeEnd && ch == "/") {
          setState(normal);
          break;
        }
        maybeEnd = (ch == "*");
      }
      return "css-comment";
    }

    function inSGMLComment(source, setState) {
      var dashes = 0;
      while (!source.endOfLine()) {
        var ch = source.next();
        if (dashes >= 2 && ch == ">") {
          setState(normal);
          break;
        }
        dashes = (ch == "-") ? dashes + 1 : 0;
      }
      return "css-comment";
    }

    function inString(quote) {
      return function(source, setState) {
        var escaped = false;
        while (!source.endOfLine()) {
          var ch = source.next();
          if (ch == quote && !escaped)
            break;
          escaped = !escaped && ch == "\\";
        }
        if (!escaped)
          setState(normal);
        return "css-string";
      };
    }

    return function(source, startState) {
      return davinci.model.parser.tokenizer(source, startState || normal);
    };
  })();

  function indentCSS(inBraces, inRule, base) {
    return function(nextChars) {
      if (!inBraces || /^\}/.test(nextChars)) return base;
      else if (inRule) return base + indentUnit * 2;
      else return base + indentUnit;
    };
  }

  // This is a very simplistic parser -- since CSS does not really
  // nest, it works acceptably well, but some nicer colouroing could
  // be provided with a more complicated parser.
  function parseCSS(source, basecolumn) {
    basecolumn = basecolumn || 0;
    var tokens = tokenizeCSS(source);
    var inBraces = false, inRule = false, inDecl = false;;

    var iter = {
      next: function() {
        var token = tokens.next(), style = token.style, content = token.content;

        if (style == "css-hash")
          style = token.style =  inRule ? "css-colorcode" : "css-identifier";
        if (style == "css-identifier") {
          if (inRule) token.style = "css-value";
          else if (!inBraces && !inDecl) token.style = "css-selector";
        }

        if (content == "\n")
          token.indentation = indentCSS(inBraces, inRule, basecolumn);

        if (content == "{" && inDecl == "@media")
          inDecl = false;
        else if (content == "{")
          inBraces = true;
        else if (content == "}")
          inBraces = inRule = inDecl = false;
        else if (content == ";")
          inRule = inDecl = false;
        else if (inBraces && style != "css-comment" && style != "whitespace")
          inRule = true;
        else if (!inBraces && style == "css-at")
          inDecl = content;
        
//        console.log("style="+token.style + "  type="+token.type + "  ==> "+token.value);
        return token;
      },

      copy: function() {
        var _inBraces = inBraces, _inRule = inRule, _tokenState = tokens.state;
        return function(source) {
          tokens = tokenizeCSS(source, _tokenState);
          inBraces = _inBraces;
          inRule = _inRule;
          return iter;
        };
      }
    };
    return iter;
  }

  return {make: parseCSS, electricChars: "}"};
})();

 davinci.html.CSSParser.parse = function (text, parentElement)
 {
	 var stream, inHtml;
	 if (typeof text =="string" )
	 {
		  var txtStream = { next : function () {if (++this.count==1)  return text; else {throw StopIteration;}} , count:0, text:text};
		 stream=davinci.model.parser.stringStream(txtStream);
	 }
	 else
	 {
		 stream=text;
		 inHtml=true;
	 }
	  var parser = davinci.html.CSSParser.make(stream);
	  var token;
	  var selector;
	  var combined;
	  var combiner = ' ';
	  var errors=[];
	  var model,wsAfterSel;
	  function error(text){console.log("ERROR: "+text); errors.push(text)}
	  
	  function nextToken()
	  {
          token=parser.next();
          while (token.style=="css-comment" || token.style=="whitespace" || (token.content=='/' && stream.peek()=='/')) 
	  	{
        	  if (token.style=="css-comment")
        	  {
                  if(pushComment==null){
                  	pushComment = new davinci.model.Comment();
                  }
                 var start,stop;
                 var commentStart=false;
                 var s=token.content;
                 if (token.content.indexOf("/*")==0)
                 {
                	 s=s.substring(2);
                	 commentStart=true;
                 }
                 if (s.lastIndexOf("*/")==s.length-2)
                	 s=s.substring(0,s.length-2);
                 if (commentStart)
                	 pushComment.addComment('block',start,stop, s);
                 else
           		  pushComment.appendComment(s);
        		  
        	  }
        	  else if (token.content=='/')
        	  {
        		  var start=token.offset;
        		  parser.next();// second slash
                  if(pushComment==null){
                    	pushComment = new davinci.model.Comment();
                   }
                  while (!stream.endOfLine())
                	  stream.next();
                  var s=stream.get();
                  pushComment.addComment('line',start,start+s.length,s)
        	  }
        	  else
        	  {
        		  if (pushComment)
        			  pushComment.appendComment(token.value);
        	  }
            token = parser.next();
	  	}
          return token;
	  }
      function createSelector()
      {
     	 selector=new davinci.html.CSSSelector();
     	 selector.startOffset=token.offset;
     	 selector.parent=model;
//     	 selector.setStart(nexttoken.line,nexttoken.from);
     	 if (combined)
     	{
     		 combined.selectors.push(selector);
     		 selector.parent=combined;		
     	}
     	 else
          	model.selectors.push(selector);
      }
      function startNew()
      {
     	 var prev=selector;
     	 prev.endOffset=token.offset-1;
     	 if (!combined)
          {
     		 combined=new davinci.html.CSSCombinedSelector();
     		 combined.parent=model;
     		 combined.selectors.push(prev);
         	 selector.startOffset=prev.startOffset;
         	 model.selectors[model.selectors.length-1]=combined;
          }
     	 createSelector();
 		 combined.combiners.push(combiner);
     	 combiner= ' ';
     	 
      }
      
	  try {
//		  debugger;
		  do {
			  nextToken();
			  switch (token.style)
			  {
			  case "css-selector":
			  case "css-select-op":
			  {
				  if (inHtml && token.content=="<")
				  {
					  stream.push("<");
					  throw StopIteration;
				  }
	        	  model=new davinci.html.CSSRule();
	        	  model.startOffset=token.offset;
	        	  parentElement.addChild(model,undefined,true);

				  wsAfterSel=false;
				  combined=undefined;
				  combiner=' ';
				  createSelector();
		         selectorLoop: for (;;) {
				  
					  switch (token.style)
					  {
					  	case "css-select-op":
					  	{
					  		switch( token.content)
						  	{
					  			case ",": 
					  				combined=undefined;
					  				wasSelector=false;
					  				createSelector();
					  			break;
					  			case ".": 
				                     if (wsAfterSel)
				                    	 startNew();
				                     nextToken();
				                     if (selector.cls)
				                         selector.cls=selector.cls+"."+token.content;
				                     else
				                       selector.cls=token.content;
								  		wsAfterSel=token.value.length>token.content.length;

					  			break;
					  			case "*": 
				                     if (selector.element || selector.cls)
				                    	 startNew();
				                     selector.element="*";

					  			break;
					  			case "+": 
					  			case ">": 
				                     combiner=token.content;
				                     startNew();

					  			break;
						  	}
				  			break;
					  		
					  	}
					  	case "css-selector":
					  		if (token.type=="css-identifier")
					  		{
				                 if (selector.element || selector.cls)
				                	 startNew();
				                 selector.element=token.content;
					  			
					  		}
					  		else if (token.type=="css-hash")
					  		{
			                     if (selector.id || wsAfterSel)
			                    	 startNew();
			                     selector.id=token.content.substring(1);
					  		}
					  		wsAfterSel=token.value.length>token.content.length;
					  	break;
					  	case "css-punctuation":
					  	{
					  		if (token.content=="{")
					  			break selectorLoop;
					  		else if (token.content==":")
					  		{
					  			nextToken();
					  			if (token.content==":")
					  			{
					  				nextToken();
			                		 selector.pseudoElement=token.content;
					  			}
					  			else
					  			{
			                		 selector.pseudoRule=token.content;

					  			}
					  		}
					  		else if (token.content=="[")
					  		{
					  			nextToken();
			                     selector.attribute={name: token.content};
					  			nextToken();
			                     if (token.content === '=' || token.content === '~=' ||
			                    		 token.content === '|=') {
			                    	 selector.attribute.type=token.content;
			                         nextToken();
			                    	 selector.attribute.value=token.content.substring(1,token.content.length-1);
							  			nextToken(); // ]
			                     }

					  		}
					  	}
					  	break;

					  }

	                  wasSelector=true;
		              nextToken();
				  }
				  selector.endOffset=token.offset-1;
				  while (nextToken().content!="}")
				  {
					  var nameOffset=token.offset;
					  var propertyName = token.content;
					  var skipNext=false;
					  if (token.type=="css-hash")
					  {
						  nextToken();
						  if (token.type=="css-identifier")
							  propertyName+=token.content;
						  else 
							  skipNext=true;
					  }
					  else if (token.type!="css-identifier")
					  {
						  if (token.content!="*")		// is probably bad syntax, but dojo.css has  " *font-size "
						         error("expecting identifier");
						  else
						  {
							  nextToken();
							  propertyName+=token.content;
							  
						  }
					  }

					  
			             var property = new davinci.html.CSSProperty();
			             property.startOffset=nameOffset;
			             property.parent=model;
//			             property.setStart(nexttoken.line,nexttoken.from);
			             model.properties.push(property);
			             model.addChild(property,undefined,true);

			             property.name=propertyName;
			             
			             if (!skipNext)
			            	 if (nextToken().content!=":")
			            		 error ("expecting ':'");
			             
			             nextToken();
			             property.value=token.value;
			             while ((nextToken()).content!=";" && token.content!="}")
			            	 property.value+=token.value;
			           	if(pushComment!=null){	
			        		property.postComment = pushComment;
			        		pushComment = null;
			        	}

						  property.endOffset=token.offset-1;
			             if (token.content=="}")
			            	 break;
				  }
		           	if(pushComment!=null){	
		        		property.postComment = pushComment;
		        		pushComment = null;
		        	}
		           	model.endOffset=token.offset;
				  
			  }
			  break;
			  case "css-at":
				  {
					  var ruleName=token.content.substring(1);
					  var atRule = (ruleName=="import") ?new davinci.html.CSSImport() : new davinci.html.CSSAtRule();;
					  atRule.startOffset=token.offset;
	            	 parentElement.addChild(atRule,undefined,true);
					  if (ruleName=="import")
					  {
			            	 var cssImport=atRule;
				              nextToken();
				              if (token.content=="url")
				             {
				            	  cssImport.isURL=true;
					              nextToken();	// '
					              nextToken();  // value
				             }
				              cssImport.url=token.content.substring(1,token.content.length-1);
				              if (cssImport.isURL)
				            	  nextToken();
				              
				              nextToken();  // ;
						  
					  }
					  else
					  {
						  atRule.name=ruleName;
						  atRule.value="";
						  while ((nextToken()).content!=";")
							  atRule.value+=token.content;
					  }
					  atRule.endOffset=token.offset;

				  }
				  break;
	             
			  }
		  } while (true);
	  } catch (e) {}
	  
	  return {errors:errors}
}