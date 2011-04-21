
qx.Class.define("vuuvv.ui.FormWindow", {
	extend: qx.ui.window.Window,

	construct: function(name, proto) {
		this.base(arguments);
		this.setLayout(new qx.ui.layout.VBox);
		this._createWidgetContent(name, proto);
		this.center();
	},

	events: {
		beforsave: "qx.event.type.Data",
		aftersave: "qx.event.type.Data"
	},

	members: {
		_form: null,

		_createWidgetContent: function(name, proto) {
			var form = new vuuvv.ui.Form(name, proto);
			this.add(form);
			this._form = form;
			this._form.addListener("beforesave", this._onBeforeSave, this);
			this._form.addListener("aftersave", this._onAfterSave, this);
		},

		reset: function() {
			this._form.reset();
		},

		_onBeforeSave: function(e) {
			this.fireDataEvent("beforesave", e.getData());
		},

		_onAfterSave: function(e) {
			this.fireDataEvent("aftersave", e.getData());
		},

		getForm: function() {
			return this._form;
		}
	},

	destruct: function() {
		this._disposeObjects("_form");
		this._form= null;
	}
});
