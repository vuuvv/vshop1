qx.Class.define("vuuvv.Query", {
	extend: qx.core.Object,

	construct: function() {
		this.base(arguments);
		this.setConditions([]);
		this.setFields([]);
	},

	properties: {
		name: {
			init: "",
			nullable: true
		},

		type: {
			check: ["save", "delete", "query", "count", "related_query"],
			init: "query"
		},

		conditions: {
			init: []
		},

		orderby: {
			init: null,
			nullable: true
		},

		limit: {
			init: null,
			nullable: true
		},

		value: {
			init: null,
			nullable: true
		},

		fields: {
			init: []
		},

		related: {
			init: null,
			nullable: true
		}
	},

	events: {
		completed: "qx.event.type.Data",
		failed: "qx.event.type.Event",
		timeout: "qx.event.type.Event"
	},

	members: {
		query: function() {
			var req = new qx.io.remote.Request(this.getUrl(), "POST", "application/json");
			var data;
			switch (this.getType()) {
				case "count":
					data = this.parseData() || "1=1";
					break;
				case "query":
					data = this.parseData() || "1=1";
					break;
				case "related_query":
					data = this.parseData() || "1=1";
					break;
				case "save":
					data = this.getValue();
					break;
				case "delete":
					data = this.parseData() || "1=1";
					break;
			}
			if (data)
				req.setData(data);

			req.addListener("completed", this._onCompleted, this);
			req.addListener("failed", this._onFailed, this);
			req.addListener("timeout", this._onTimeout, this);
			req.send();
		},

		getUrl: function() {
			return [vuuvv.Global.query_prefix, this.getType(), this.getName()].join("/");
		},

		parseData: function() {
			var p = ["conditions", "orderby", "limit", "value", "fields", "related"];
			var result = "";
			for(var i = 0; i < p.length; i++) {
				var name = p[i];
				var value = this.get(name);
				if (vuuvv.Utils.isFalse(value))
					result += encodeURIComponent(name) + "=" + encodeURIComponent(qx.util.Json.stringify(value)) + "&";
			}
			return result.substring(0, result.length - 1);
		},

		/**
		 * Like Django's filter syntax, eg. addCondition("id", "exact", 5), to Django's id__exact=5
		 */
		addCondition: function(filter, value) {
			this.getConditions().push([filter, value]);
		},

		_onCompleted: function(e) {
			this.fireDataEvent("completed", e.getContent());
		},

		_onFailed: function(e) {
			this.fireEvent("failed");
		},

		_onTimeout: function(e) {
			this.fireEvent("timeout");
		}
	}
});
