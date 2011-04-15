dojo.provide("demos.doh.DemoWidget");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("demos.doh.DemoWidget", [dijit._Widget, dijit._Templated], {
	//The template used to define the widget default HTML structure.
	templateString: '<div dojoAttachPoint="textNode" style="width: 150px; ' +
		' margin: auto; background-color: #98AFC7; font-weight: bold; color: ' + 
		'white; text-align: center;"></div>',

	textNode: null,		//Attach point to assign the content to.

	value: 'Not Set',	//Current text content.

	startup: function() {
		//	summary:
		//		Overridden startup function to set the default value.
		//	description:
		//		Overridden startup function to set the default value.
		this.setValue(this.value);
	},

	getValue: function() {
		//	summary:
		//		Simple function to get the text content under the textNode
		//	description:
		//		Simple function to get the text content under the textNode
		return this.textNode.innerHTML;
	},

	setValue: function(value) {
		//	summary:
		//		Simple function to set the text content under the textNode
		//	description:
		//		Simple function to set the text content under the textNode
		this.textNode.innerHTML = value;
		this.value = value;
	}
});

