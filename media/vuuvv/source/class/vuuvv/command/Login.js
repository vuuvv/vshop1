qx.Class.define("vuuvv.command.Login", {
	extend: vuuvv.command.Command,

	construct: function(options)
	{
		this.base(arguments, options);
	},

	members:
	{
		handle: function() {
			var f = new vuuvv.ui.LoginDialog();
			f.show();
		}
	}
});
