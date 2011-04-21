qx.Class.define("vuuvv.ui.page.Menu", {
	extend: vuuvv.ui.page.ModelPage,

	construct: function() {
		this.base(arguments, "Menu", null, vuuvv.ui.TreeModelView);
	},

	members: {
		_onFormDataLoaded: function(e) {
			var data = e.getData().data.value;
			var form = e.getData().form;
			qx.lang.Array.insertAt(data.Parent, {id: null, label: "---"}, 0);
			form.setModel(data.Parent, "parent");
			var pid;
			if (data.Menu.length > 0) {
				form.setModel(data.Menu[0]);
				pid = data.Menu[0].parent;
			} else {
				var acenstor = this._view.getAcenstors();
				pid = acenstor[acenstor.length - 1];
			}
			var sel = new qx.data.Array();
			sel.push(pid);
			form.getController("parent").setSelection(sel);
		},

		_getRelated: function() {
			return {
				"parent": "label"
			};
		},

		_getAttach: function() {
			return {
				"Parent": {
					name: "Menu",
					fields: ["id", "label"]
				}
			};
		},

		_getProto: function() {
			return {
				label: {
					init: "",
					type: "TextField"
				},	
				tooltip: {
					init: "",
					type: "TextField"
				},
				icon: {
					init: "",
					type: "TextField"
				},
				command: {
					init: "",
					type: "TextField"
				},
				parent: {
					init: [],
					type: "SelectBox",
					delegate: {
						bindItem: function(ctrl, widget, index) {
							ctrl.bindProperty("label", "label", null, widget, index);
							ctrl.bindProperty("id", "model", null, widget, index);
						}
					}
				}
			};
		}
	}
});
