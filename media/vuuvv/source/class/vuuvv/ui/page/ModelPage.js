qx.Class.define("vuuvv.ui.page.ModelPage", {
	extend: qx.ui.container.Composite,

	construct: function(name, columns, viewCls)
	{
		this.base(arguments, new qx.ui.layout.VBox);
		this.setBackgroundColor("background-splitpane");

		var view = new viewCls(name, this._getProto(), columns, this._getRelated(), this._getAttach());
		this.add(view, {flex: 1});
		this._view = view;

		view.addListener("formDataLoaded", this._onFormDataLoaded, this);
	},

	members:
	{
		// override
		_onFormDataLoaded: function(e) {
		},

		// override
		_getProto: function() {
		},

		_getRelated: function() {
			return null;
		},

		_getAttach: function() {
			return null;
		}
	}
});
