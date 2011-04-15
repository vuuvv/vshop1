dojo.provide("davinci.ve.widgets.CommonProperties");


dojo.require("davinci.ve.commands.EventCommand");
dojo.require("davinci.ve.States");

dojo.require("dijit.form.ComboBox");
dojo.require("dijit._Widget");
dojo.require("davinci.ve.commands.EventCommand");
dojo.require("davinci.ve.widget");
dojo.require("davinci.workbench.ViewLite");

dojo.declare("davinci.ve.widgets.CommonProperties", [davinci.workbench.ViewLite], {
	
	buildRendering : function(){
		var props = ["id", "title"];
		var template = "<table width='100%' class='property_table_stretchable' border='0' cellspacing='0' cellpadding='0'>";
		template += "<colgroup>"; 
		template += "<col style='width:15px;' />"
		template +="<col class='gap02' />";
		
		template +="<col class='gap03' />";
		template +="<col style='width:15px;' />";
		template +="</colgroup>";
		
		var id = 0;
		this._boxes = {};
		
		for(var i = 0;i<props.length;i++){
			this._boxes[props[i]] = {value:""};
			
			this._boxes[props[i]]['id'] = ("davinci_properties_event_"+ id++ +"_combo");
			template+="<tr>";
			template+="<td/>";
			template+="<td class='propertyDisplayName'>";
			template+=props[i] + ":";
			template+="</td>";
			template+="<td>";
			template+="<input type='text' id='" + this._boxes[props[i]]['id'] + "'></input>";
			template+="</td>";
			template+="<td/>";
			template+="</tr>";
		}
		
		template+="</table>";
		this.domNode =  dojo.doc.createElement("div");
		this.domNode.innerHTML = template;
		dojo.subscribe("/davinci/ui/widgetValuesChanged", dojo.hitch(this, this.onWidgetSelectionChange));
		dojo.subscribe("/davinci/ui/widget/replaced", dojo.hitch(this, this._widgetReplaced));
		this.inherited(arguments);
	},
	
	onEditorSelected : function(editorChange){
		
		if(this._editor && this._editor.getContext){
			
			this.context = this._editor.getContext();
			this._setValues();
		}else{
			this._widget = this._subwidget = null;
			this.context = null;
			this._clearValues();
			}
		this._clearValues();
	},	
	
	startup : function(){
		this.inherited(arguments);
		function makeOnChange(target){
			return function(){
				return this._onChange({target:target});
			};
		}
		for(var name in this._boxes){
			this._boxes[name]['domNode'] = dojo.byId(this._boxes[name]['id']);
			dojo.connect(this._boxes[name]['domNode'], "onchange", this, makeOnChange(name));
			dojo.connect(this._boxes[name]['domNode'], "onfocus", this, "_onFocus");
			dojo.connect(this._boxes[name]['domNode'], "onblur", this, "_onBlur");
			
		}
	},
	
	_onFocus : function(){
		
		if(this.context)
			this.context.blockChange(true);
		
		
	},
	_onBlur : function(){
		
		if(this.context)
			this.context.blockChange(false);
		
		
	},
	
	_onChange : function(a){
		
		var targetProperty = a.target;
		
		var	value = dojo.attr(this._boxes[targetProperty]['domNode'], 'value');
		if(this.context)
			this.context.blockChange(false);
		
		if(this._boxes[targetProperty]['value'] != value ){
			this._boxes[targetProperty]['value'] = value;
			var valuesObject = {};
			valuesObject[targetProperty] = value;
			var command = new davinci.ve.commands.ModifyCommand(this._widget, valuesObject, null);
			dojo.publish("/davinci/ui/widgetPropertiesChanges",[{source:this._editor.editor_id, command:command}]);
		}	
	},
	
	_widgetReplaced : function(newWidget){
		this._widget = newWidget;
		this.onWidgetSelectionChange();
		
		
	},
	
	onWidgetSelectionChange : function(){
		if(!this._widget){
			this.attr("readOnly", true);
			this._clearValues();
			return;
		}else{
			this._setValues();
			this.attr("readOnly", false);
		}
	},
	
	_clearValues : function(){
		for(name in this._boxes){
			dojo.attr(this._boxes[name]['domNode'],'value',"")
			this._boxes[name]['value'] = null;
		}
	},
	_setValues: function(){
		if(!this._widget) return;
		
		for(var name in this._boxes){
			var widget = this._widget,
				box = this._boxes[name];
			if(name=='id'){
				var id = widget.getId() || "";
				if(box.value != id){
					box.value = id;
					dojo.attr(box.domNode, "value", box.value);
				}
			}else if(widget.getPropertyValue){
				var value = widget.getPropertyValue(name);
				if(box.value != value){
					box.value = value;
					dojo.attr(box.domNode, "value", box.value);
				}
			}else{
				box.value = "";
				dojo.attr(box.domNode, "value", "");
			}
		}
	}
});