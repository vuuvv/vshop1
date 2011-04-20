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
			q.addCondition("parent", "exact", this.getParent());
			q.query();
		},

		// overloaded - called whenever the table requests new data
		_loadRowData: function(firstRow, lastRow) {
			var q = this._getQuery(firstRow, lastRow);
			q.addCondition("parent", "exact", this.getParent());
			q.query();
		},

		enter: function(id) {
			this.setParent(id);
		}
	}
});
