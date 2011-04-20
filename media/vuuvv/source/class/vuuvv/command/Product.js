qx.Class.define("vuuvv.command.Product", {
	extend: vuuvv.command.Command,

	construct: function(options)
	{
		this.base(arguments, options);
	},

	members:
	{
		handle: function() {
			var app = qx.core.Init.getApplication();
			var tabs = app.getTabView();
			tabs.add(this.getLabel(), this.getIcon(), "vuuvv.ui.page.Product");
		}
	}
});
