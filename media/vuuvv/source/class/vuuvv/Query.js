qx.Class.define("vuuvv.Query", {
	extend: qx.core.Object,

	construct: function() {
		this.base(arguments);
		this.setData({});
	},

	properties: {
		data: {
			init: {}
		},

		type: {
			check: ["query", "count", "save", "delete"],
			init: "query"
		}
	},

	events: {
		completed: "qx.event.type.Data",
		failed: "qx.event.type.Event",
		timeout: "qx.event.type.Event"
	},

	members: {
		send: function() {
			var req = new vuuvv.Request(this.getUrl(), "POST");
			req.setParameter("data", qx.util.Json.stringify(this.getData()), true);
			req.addListener("completed", this._onCompleted, this);
			req.addListener("failed", this._onFailed, this);
			req.addListener("timeout", this._onTimeout, this);
			req.send();
		},

		/**
		 * data should be an array
		 */
		query: function(data) {
			this.setType("query");
			if (data)
				this.setData(data);
			return this;
		},

		count: function(data) {
			this.setType("count");
			if (data)
				this.setData(data);
			return this;
		},

		save: function(data) {
			this.setType("save");
			if (data)
				this.setData(data);
			return this;
		},

		"delete": function(data) {
			this.setType("delete");
			if (data)
				this.setData(data);
			return this;
		},

		getUrl: function() {
			return vuuvv.Global.getUrl(this.getType());
		},

		data: function(model, name, value) {
			var data = this.getData();
			if (!data[model])
				data[model] = {}

			if (qx.lang.Type.isString(name)) {
				data[model][name] = value;
			} else {
				data[model] = name;
			}
		},

		add: function(value) {
			var data = this.getData();
			for (var k in value) {
				data[k] = value[k];
			}
		},

		_onCompleted: function(e) {
			this.fireDataEvent("completed", e.getData());
		},

		_onFailed: function(e) {
			this.fireEvent("failed");
		},

		_onTimeout: function(e) {
			this.fireEvent("timeout");
		}
	}
});
