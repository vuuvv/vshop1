qx.Class.define('vuuvv.model.RemoteTree', {
	extend: vuuvv.model.Remote,

	construct: function(modelName, columns, related) {
		this.base(arguments, modelName, columns, related);
	},

	properties: {
		parent: {
			init: null,
			apply: "_applyParent",
			nullable: true
		}
	},

	members: {
		_applyParent: function(value, old) {
			this.reloadData();
		},

		// overloaded - called whenever the table request the row count
		_loadRowCount: function() {
			var q = this._getCountQuery();
			q.data(this.getModelName(), "conditions", {"parent__exact": this.getParent()});
			q.send();
		},

		// overloaded - called whenever the table requests new data
		_loadRowData: function(firstRow, lastRow) {
			var q = this._getQuery(firstRow, lastRow);
			q.data(this.getModelName(), "conditions", {"parent__exact": this.getParent()});
			q.send();
		},

		enter: function(id) {
			this.setParent(id);
		}
	}
});
