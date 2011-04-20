/*
#require(vuuvv.command.Login)
#require(vuuvv.command.User)
#require(vuuvv.command.Group)
#require(vuuvv.command.Permission)
#require(vuuvv.command.Menu)
#require(vuuvv.command.About)
*/
qx.Class.define("vuuvv.ui.Menubar", {
	extend: qx.ui.menubar.MenuBar,

	construct: function(menuData) {
		this.base(arguments);
		this.createMenus(menuData);
	},

	properties: 
	{
		model: {
			check: "Object",
			event: "changeModel",
			init: null
		}
	},

	members: {
		createMenus: function(data) {
			var menus = vuuvv.model.Tree.create(data, vuuvv.model.Menu, "parent_id");
			this.setModel(menus);
			var roots = menus[null].getChildren();
			for (var i = 0; i < roots.getLength(); i++) {
				var item = roots.getItem(i);
				var children = item.getChildren();
				var menu = new qx.ui.menubar.Button(
					this.tr(item.getLabel())
				);
				this.add(menu);
				if (children.getLength() > 0) {
					var sub = new qx.ui.menu.Menu();
					this.createSubMenu(sub, children);
					menu.setMenu(sub);
				}
			}
		},

		createSubMenu: function(widget, model) {
			model.forEach(function(item) {
				var menu = new qx.ui.menu.Button(
					this.tr(item.getLabel())
				);
				widget.add(menu);
				var commandCls = qx.Class.getByName("vuuvv.command." + item.getCommand());
				var emptyComm = new qx.ui.core.Command();
				var comm = commandCls ? new commandCls(item) : emptyComm;
				menu.setCommand(comm);
				var children = item.getChildren();
				if (children.getLength()) {
					var sub = new qx.ui.menu.Menu();
					this.createSubMenu(sub, children);
					menu.setMenu(sub);
				}
			}, this);
		}
	}
});
