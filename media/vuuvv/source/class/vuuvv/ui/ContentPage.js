qx.Class.define("vuuvv.ui.ContentPage", {
	extend: vuuvv.ui.LoadingPage,

	construct: function() {
		this.base(arguments, vuuvv.Global.getUrl("appdata"));
	},

	members: {
		setupPage: function(data) {
			console.log(data);
			if (data.user.id === null) {
				var login = new vuuvv.ui.LoginDialog();
				login.addListener("success", function() {
					this.reload();
				}, this);
				login.show();
				return;
			} else if (data.type == "error") {
				alert(data.message);
				return;
			} else {
				//var appdata = data.appdata;
				var container = this.getContent();
				this.__menubar = new vuuvv.ui.Menubar(data.value.Menu);
				//appdata.menus = this.__menubar.getModel();
				container.add(this.__menubar, {flex: 0});
				var tabView = new vuuvv.ui.TabView();
				container.add(tabView, {flex: 1});
				vuuvv.Global.tab_view = tabView;
				//qx.core.Init.getApplication().setAppData(appdata);
				return container;
			}

			//var mainsplit = new qx.ui.splitpane.Pane("horizontal");
			//container.add(mainsplit, {flex: 1});

			////left side
			//var leftside = new qx.ui.container.Composite(new qx.ui.layout.VBox(3));
			//leftside.setBackgroundColor("background-splitpane");
			//mainsplit.add(leftside, 0);

			//var searchComposlite = new qx.ui.container.Composite();
			//searchComposlite.setLayout(new qx.ui.layout.HBox(3));
			//searchComposlite.setAppearance("textfield");
			//leftside.add(searchComposlite);

			//var searchIcon = new qx.ui.basic.Image("icon/16/actions/edit-find.png");
			//searchComposlite.add(searchIcon);

			//this._searchTextField = new qx.ui.form.TextField();
			//this._searchTextField.setLiveUpdate(true);
			//this._searchTextField.setAppearance("widget");
			//this._searchTextField.setPlaceholder("Filter...");

			//searchComposlite.add(this._searchTextField, {flex: 1});

			//var list = new qx.ui.form.List();
			//leftside.add(list, {flex: 1});

			//// create the status of the tree
			//this._status = new qx.ui.basic.Label("0/0");
			//this._status.setAppearance("widget");
			//this._status.setWidth(80);
			//this._status.setTextAlign("right");
			//searchComposlite.add(this._status);

		},

		createContentPage: function() {
			return new qx.ui.container.Composite(new qx.ui.layout.VBox);
		}
	}
});
