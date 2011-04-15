dojo.provide("davinci.ui.widgets.DocileDialog");

dojo.require("dijit.Dialog");

davinci.ui.widgets.DocileDialog.instance = 0;

dojo.declare("davinci.ui.widgets.DocileDialog", null, {
	
	constructor : function(args){
		
		var topDiv =  dojo.doc.createElement("div");
		var contentDiv =  dojo.doc.createElement("div");
		contentDiv.innerHTML = args.content || this.content;
		contentDiv.innerHTML+="<br><br>";
		var buttonDiv =  dojo.create("div", {style:"text-align:center"});
		var buttons = ["ok", "cancel"];
		this.callBack = args.callBack;
		
		function makeOnChange(target){
			return function(){
				
				return this._onChange({target:target});
			};
		}
		function makeOnChangeAlways(box){
			return function(){
				return this._onChangeAlways({target:box});
			};
		}
		
		for(var i=0;i<buttons.length;i++){
			var button = dojo.create("button", {innerHTML:buttons[i]});
			dojo.connect(button, "onclick", this, makeOnChange(buttons[i]));	
			buttonDiv.appendChild(button);
		}
		var shouldShowAgain = dojo.create("div", {style:"vertical-align:middle"});
		var text = dojo.create("span");
		var check = dojo.create("input", {style:"vertical-align:middle"});
		check.type="checkbox";
		dojo.connect(check, "onchange", this, makeOnChangeAlways(check));	
		
		text.innerHTML = "&nbsp;&nbsp;&nbsp;" + (args.disableText || "Don't show again") + "<br><br>";
		shouldShowAgain.appendChild(check);
		shouldShowAgain.appendChild(text);
		topDiv.appendChild(contentDiv);
		topDiv.appendChild(shouldShowAgain);
		topDiv.appendChild(buttonDiv);
		this.dialog = new dijit.Dialog({
			title: args.title || "",
			content: topDiv,
			style: "width: 250px"
			
		});
		this.dialog.show();
	},
	_onChange : function(value){
		this.value=value.target;
		this.dialog.hide();
		this.callBack({value:this.value, alwaysShow:this.shouldShow});
	},
	_onChangeAlways : function(target){
		this.shouldShow = !dojo.attr(target.target, "checked");
	},
	
	shouldShow : function(){
		this.shouldShow;
		
	}
	
});