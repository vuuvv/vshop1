qx.Class.define("vuuvv.ui.page.Permission", {
	extend: qx.ui.tabview.Page,

	construct: function(label, icon)
	{
		this.base(arguments, label, icon);
		this.setShowCloseButton(true);

		this.debug("construct the page");
	}
});