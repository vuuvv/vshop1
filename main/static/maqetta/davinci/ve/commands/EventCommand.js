dojo.provide("davinci.ve.commands.EventCommand");


dojo.require("davinci.ve.widget");

dojo.declare("davinci.ve.commands.EventCommand", null, {

	name: "EventCommand",

	constructor: function(widget, properties){
		this._oldId = (widget ? widget.id : undefined);
		this._properties = (properties || {});
	},

	setContext : function(context){
		this._context = context;
	},
	

	execute: function(){
	
		if(!this._oldId || !this._properties){
			return;
		}
		var widget = davinci.ve.widget.byId(this._oldId);
		this._oldProps = widget.properties || {};
		
		widget.setProperties(this._properties, /*modelOnly*/ true);
		
		// WEV: this breaks encapsulation. HTMLWidget.setProperties() should implement
		//      the correct behavior.
		if(widget.isHtmlWidget){
			
			var node = widget.domNode;
			
			for(var name in this._properties){
				if(!this._properties[name]) {
					node.removeAttribute(name) ;
				}// else {
					//node.setAttribute(name, this._properties[name]);
				//}
				
			}
		}
		
		
		this._newId = this._oldId;
	},

	undo: function(){
		if(!this._newId ){
			return;
		}
		var widget = davinci.ve.widget.byId(this._newId);
	
		this._widget.setProperties(_oldProps);
		
	}

});