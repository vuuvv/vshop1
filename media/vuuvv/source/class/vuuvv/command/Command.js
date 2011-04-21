/*****************************************************
#require(vuuvv.ui.page.User)
#require(vuuvv.ui.page.Group)
#require(vuuvv.ui.page.Permission)
#require(vuuvv.ui.page.Menu)
#require(vuuvv.ui.page.Page)
#require(vuuvv.ui.page.About)
#require(vuuvv.ui.page.Article)
#require(vuuvv.ui.page.Product)
*****************************************************/
qx.Class.define("vuuvv.command.Command", {
	extend: qx.ui.core.Command,

	construct: function(options)
	{
		this.base(arguments);
		this.setLabel(options.getLabel());
		this.setToolTipText(options.getTooltip());
		this.setIcon(options.getIcon());
		this.addListener("execute", this.handle, this);
	},

	members:
	{
		handle: function() {
			this.debug("error");
		}
	}
});
