qx.Class.define("vuuvv.model.Menu", {
	extend: vuuvv.model.Tree,

	construct: function() {
		this.base(arguments);
	},

	properties: {
		id: {
			check: "Integer",
			event: "changeId",
			nullable: true
		},

		label: {
			check: "String",
			event: "changeLabel",
			init: ""
		},

		tooltip: {
			check: "String",
			event: "changeTooltip",
			init: ""
		},

		icon : {
			check: "String",
			event: "changeIcon",
			init: ""
		},

		command: {
			check: "String",
			event: "changeCommand",
			init: ""
		}
	}
});
