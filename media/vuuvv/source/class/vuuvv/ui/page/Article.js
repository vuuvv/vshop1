qx.Class.define("vuuvv.ui.page.Article", {
	extend: vuuvv.ui.page.ModelPage,

	construct: function()
	{
		this.base(arguments, "Article", ["category", "creation_date", "title"], vuuvv.ui.ModelView);
	},

	members:
	{
		_onFormDataLoaded: function(e) {
			var data = e.getData().data;
			var form = e.getData().form;
			form.setModel(data.Category, "category");
			if (data.value.length > 0) {
				form.setModel(data.value[0]);
				var sel = new qx.data.Array();
				sel.push(data.value[0].category);
				form.getController("category").setSelection(sel);
			}
		},

		_getRelated: function() {
			return {
				category: "name"
			};
		},

		_getProto: function() {
			return {
				title: {
					init: "",
					type: "TextField"
				},
				thumbnail: {
					init: "",
					type: "TextField"
				},
				content: {
					init: "",
					type: "HtmlArea"
				},
				category: {
					init: [],
					type: "SelectBox",
					delegate: {
						bindItem: function(ctrl, widget, index) {
							ctrl.bindProperty("name", "label", null, widget, index);
							ctrl.bindProperty("id", "model", null, widget, index);
						}
					}
				},
				creation_date: {
					init: vuuvv.utils.mydateFormat().format(new Date()),
					type: "DateField"
				}
			};
		}
	}
});
