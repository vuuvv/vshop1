/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

/* ************************************************************************

#asset(vuuvv/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "vuuvv"
*/
qx.Class.define("vuuvv.Application", {
	extend : qx.application.Standalone,

/*
*****************************************************************************
MEMBERS
*****************************************************************************
*/
	members : {
		/**
		 * This method contains the initial application code and gets called 
		 * during startup of the application
		 * 
		 * @lint ignoreDeprecated(alert)
		 */
		main : function() {
			// Call super class
			this.base(arguments);

			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug")) {
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle visibility
				qx.log.appender.Console;
			}

			var doc = this.getRoot();
			var dockLayout = new qx.ui.layout.Dock();
			var dockContainer = new qx.ui.container.Composite(dockLayout);
			doc.add(dockContainer, {edge: 0});

			dockContainer.add(new vuuvv.ui.Header(), {edge: "north"});

			var scroll = new qx.ui.container.Scroll();
			dockContainer.add(scroll);
			var content = new vuuvv.ui.ContentPage().set({
				minWidth: 960,
				minHeight: 600,
				padding: 15
			});
			scroll.add(content);
		}
	}
});
