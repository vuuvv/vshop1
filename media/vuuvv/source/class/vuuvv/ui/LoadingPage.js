qx.Class.define("vuuvv.ui.LoadingPage", {
	extend: qx.ui.container.Composite,

	construct: function(url) {
		this.base(arguments, new qx.ui.layout.Canvas());
		this.initState();

		this.addListener("changeState", function() {
			this.debug(this.getState());
		}, this);

		if (url)
			this.setUrl(url)
	},

	properties: {
		state: {
			check: ["initialized", "loading", "completed", "failed"],
			init: "initialized",
			apply: "_applyState",
			event: "changeState"
		},

		url: {
			check: "String",
			apply: "_applyUrl",
			event: "changeUrl",
			init: ""
		}
	},

	members: {
		__loading: null,
		__content: null,
		__failed: null,

		_applyState: function(value, old) {
			this.debug(value);
			switch (value) {
				case "initialized":
				case "loading":
					this.getContent().exclude();
					this.getFailedPage().exclude();
					this.getLoadingPage().show();
					break;
				case "completed":
					this.getLoadingPage().exclude();
					this.getFailedPage().exclude();
					this.getContent().show();
					break;
				case "failed":
					this.getContent().exclude();
					this.getLoadingPage().exclude();
					this.getFailedPage().show();
					break;
			}
		},

		_applyUrl: function(value, old) {
			this.load(value);
		},

		getFailedPage: function() {
			if (this.__failed)
				return this.__failed;
			this.__failed = new vuuvv.ui.Image(vuuvv.Global.getIcon("LoadingFailed"));
			this.add(this.__failed, {width: "100%", height: "100%"});
			return this.__failed;
		},

		getLoadingPage: function() {
			if (this.__loading)
				return this.__loading;
			this.__loading = new vuuvv.ui.Image(vuuvv.Global.getIcon("Loading"));
			this.add(this.__loading, {width: "100%", height: "100%"});
			return this.__loading;
		},

		getContent: function() {
			if (this.__content)
				return this.__content;
			this.__content = this.createContentPage();
			this.add(this.__content, {width: "100%", height: "100%"});
			return this.__content;
		},

		createContentPage: function() {
			return new qx.ui.form.Button("Hello World");
		},

		load: function(url) {
			var state = this.getState();
			if (state == "loading") 
				return;
			this.setState("loading");

			var req = new qx.io.remote.Request(url, "GET", "application/json");
			req.setTimeout(180000);
			req.setProhibitCaching(false);

			req.addListener("completed", this._onCompleted, this);
			req.addListener("failed", this._onFailed, this);
			req.send();
		},

		_onCompleted: function(e) {
			var data = e.getContent();
			vuuvv.Global.csrf_token = data.csrf;
			this.setupPage(data);
			this.setState("completed");
		},

		_onFailed: function(e) {
			this.setState("failed");
		}
	},

	destruct: function() {
		this._disposeObjects("__loading", "__content", "__failed");
		this.__loading = null;
		this.__content = null;
		this.__failed = null;
	}
});
