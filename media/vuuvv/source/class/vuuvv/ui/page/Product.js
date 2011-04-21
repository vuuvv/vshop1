qx.Class.define("vuuvv.ui.page.Product", {
	extend: vuuvv.ui.page.ModelPage,

	construct: function()
	{
		this.base(arguments, "Product", null, vuuvv.ui.TreeModelView);
	},

	members:
	{
		_onFormDataLoaded: function(e) {
			var data = e.getData().data;
			var form = e.getData().form;
			qx.lang.Array.insertAt(data.Product, {id: null, name: "---"}, 0);
			form.setModel(data.Product, "parent");
			var pid;
			if (data.value.length > 0) {
				form.setModel(data.value[0]);
				pid = data.value[0].parent;
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
				"parent": "name"
			};
		},

		_getProto: function() {
			return {
				name: {
					init: "",
					type: "TextField"
				},
				decorator: {
					init: "",
					type: "TextField"
				},
				thumbnail: {
					init: "",
					type: "TextField"
				},
				image: {
					init: "",
					type: "TextField"
				},
				order: {
					init: 0,
					type: "TextField"
				},
				level: {
					init: 0,
					type: "TextField"
				},
				parent: {
					init: [],
					type: "SelectBox",
					delegate: {
						bindItem: function(ctrl, widget, index) {
							ctrl.bindProperty("name", "label", null, widget, index);
							ctrl.bindProperty("id", "model", null, widget, index);
						}
					}
				}
			};
		}
	}
});
