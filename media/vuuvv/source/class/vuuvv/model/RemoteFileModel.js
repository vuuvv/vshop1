qx.Class.define('vuuvv.model.RemoteFileModel', {
	extend: qx.ui.table.model.Remote,

	construct: function() {
		this.base(arguments);
		this.setColumns(["dir", "File Name", "Size", "Last Modified"]);
		var top = "/media/upload";
		var url = "/admin/file"
		this.setUrl(url);
		this.setTop(top);
		this.setPath(top);
		this.setMaxCachedBlockCount(50);
	},

	properties: {
		data: {
			check: "Object",
			event: "changeData",
			init: {}
		},

		/**
		 * url is the request url.
		 */
		url: {
			check: "String",
			event: "changeUrl",
			init: ""
		},

		/**
		 * path is the server path of the file.
		 */
		path: {
			check: "String",
			event: "changePath",
			init: "",
			apply: "_applyPath"
		},

		/**
		 * top is the top path of the server.
		 */
		top: {
			check: "String",
			event: "changeTop",
			init: ""
		}
	},

	members: {
		// overloaded - called whenever the table request the row count
		_loadRowCount: function() {
			var url = this.requestUrl();
			var req = new qx.io.remote.Request(url, "GET", "application/json");

			req.addListener("completed", this._onRowCountCompleted, this);
			req.send();
		},

		_onRowCountCompleted: function(e) {
			var data = e.getContent();
			if (data != null) {
				this.setData(data);
				this._onRowCountLoaded(data.length);
			}
		},

		// overloaded - called whenever the table requests new data
		_loadRowData: function(first, last) {
			this.debug(first + "," + last);
			var items = this.getData();
			this._onRowDataLoaded(items);
		},

		_applyPath: function(value, old) {
			this.reloadData();
		},

		_normpath: function(url) {
			var parts = url.split("/");
			var new_parts = [];
			for (var i = 0; i < parts.length; i++) {
				var comp = parts[i];
				if (comp === "" || comp ===".")
					continue;
				if (comp === "..") { 
					if (new_parts.length > 0)
						new_parts.pop();
					continue;
				}
				new_parts.push(comp);
			}
			var path = new_parts.join("/");
			if (qx.lang.String.startsWith(url, "/"))
				path = "/" + path;
			return path;
		},

		up: function() {
			this.cd("..");
		},

		cd: function(url) {
			this.setPath(this._genPath(url));
		},

		cdRow: function(row) {
			var data = this.getRowData(row);
			if (data.dir) {
				this.cd(this.getRowData(row)["File Name"]);
				return true;
			}
			return false;
		},

		_genPath: function(url) {
			var path = [this.getPath(), url].join("/");
			path = this._normpath(path);
			this.debug(path);
			if (!qx.lang.String.startsWith(path, this.getTop()))
				path = this.getTop();
			this.debug(path);
			return path;
		},

		requestUrl: function() {
			return this.getUrl() + this.getPath();
		},

		rowPath: function(row) {
			var url = this._genPath(this.getRowData(row)["File Name"]);
			return url;
		}
	}
});
