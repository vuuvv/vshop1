qx.Class.define("vuuvv.command.Login", {
	extend: vuuvv.command.Command,

	construct: function(options)
	{
		this.base(arguments, options);
	},

	members:
	{
		handle: function() {
			qx.Class.define("vuuvv.command.T", {
				extend: vuuvv.command.Command
			});
			vuuvv.command.T();
			var f = new vuuvv.ui.LoginDialog();
			f.show();
		}
	}
});
