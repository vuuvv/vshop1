qx.Class.define("vuuvv.command.Menu", {
	extend: vuuvv.command.Command,

	construct: function(options)
	{
		this.base(arguments, options);
	},

	members:
	{
		handle: function() {
			var tabs = vuuvv.Global.tab_view;
			tabs.add(this.getLabel(), this.getIcon(), "vuuvv.ui.page.Menu");
		}
	}
});
