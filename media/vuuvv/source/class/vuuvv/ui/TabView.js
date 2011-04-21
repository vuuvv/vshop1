qx.Class.define("vuuvv.ui.TabView", {
	extend: qx.ui.tabview.TabView,

	construct: function() 
	{
		this.base(arguments);
	},

	members: 
	{
		add: function(label, icon) 
		{
			var page = this.getPage(label);
			if (!page) {
				var pageClassName = "vuuvv.ui.page." + label;
				this.debug(pageClassName);
				var pageClass = qx.Class.getByName(pageClassName);
				page = new qx.ui.tabview.Page(label, icon);
				page.setShowCloseButton(true);

				page.setLayout(new qx.ui.layout.VBox());
				var content = new pageClass();
				page.add(content, {flex: 1});

				this.base(arguments, page);
				page.getButton().setContextMenu(this.getContextMenu(page));
			}
			this.setSelection([page]);
		},

		getContextMenu: function(page)
		{
			var menu = new qx.ui.menu.Menu;

			var closeButton = new qx.ui.menu.Button(this.tr("Close"));
			var closeAllButton = new qx.ui.menu.Button(this.tr("Close All"));
			var closeOtherButton = new qx.ui.menu.Button(this.tr("Close Other"));

			menu.add(closeButton);
			menu.add(closeAllButton);
			menu.add(closeOtherButton);

			closeButton.addListener("execute", function(e){
				this._closePage(page);
			}, this);
			closeAllButton.addListener("execute", function(e){
				this._closePage(this.getChildren());
			}, this);
			closeOtherButton.addListener("execute", function(e){
				this._closePage(this._otherpages(page));
			}, this);

			return menu;
		},

		getPage: function(label)
		{
			var pages = this.getChildren();
			for(var i = 0; i < pages.length; i++) {
				if(pages[i].getLabel() == label)
					return pages[i];
			}
			return null;
		},

		_otherpages: function(page)
		{
			var all = this.getChildren();
			var other = [];
			for(var i = 0; i < all.length; i++) {
				if(all[i] != page)
					other.push(all[i]);
			}
			return other;
		},

		_closePage: function(pages)
		{
			if (!(pages instanceof Array)) 
				pages = [pages];
			else
				pages = Array.prototype.slice.call(pages);
			for(var i = 0; i < pages.length; i++) {
				var page = pages[i];
				var closeButton = page.getButton().getChildControl("close-button");
				closeButton.reset();
				this.remove(page);
			}
		}
	}
});
