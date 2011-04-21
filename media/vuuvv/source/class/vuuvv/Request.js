qx.Class.define("vuuvv.Request", {
	extend: qx.core.Object,

	construct: function(url, method) {
		this.base(arguments);
		this.__request = new qx.io.remote.Request(url, method, "application/json");
		this.__request.setTimeout(180000);
		this.__request.setProhibitCaching(false);
		this.__request.addListener("completed", this._onCompleted, this);
		this.__request.addListener("failed", this._onFailed, this);
		this.__request.addListener("timeout", this._onTimeout, this);
	},

	events: {
		completed: "qx.event.type.Data",
		failed: "qx.event.type.Event",
		timeout: "qx.event.type.Event"
	},

	members: {
		__request: null,

		send: function() {
			this.__request.setParameter("csrfmiddlewaretoken", vuuvv.Global.csrf_token, true);
			this.__request.send();
		},

		setParameter: function(id, value, asData) {
			asData = asData || false;
			this.__request.setParameter(id, value, asData);
		},

		_onCompleted: function(e) {
			var data = e.getContent();
			vuuvv.Global.csrf_token = data.csrf;
			this.fireDataEvent("completed", e.getContent());
		},

		_onFailed: function(e) {
			this.fireEvent("failed");
		},

		_onTimeout: function(e) {
			this.fireEvent("timeout");
		}
	},

	destruct: function() {
		this._disposeObjects("__request");
		this.__request = null;
	}
});
