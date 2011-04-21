qx.Class.define('vuuvv.model.Remote', {
	extend: qx.ui.table.model.Remote,

	construct: function(modelName, columns, relations) {
		this.base(arguments);
		this.setModelName(modelName);
		if (columns)
			this.setColumns(columns);
		this.setFields(columns);
		this.setRelations(relations);
	},

	properties: {
		modelName: {
			init: ""
		},

		fields: {
			init: []
		},

		relations: {
			init: null,
			nullable: true
		}
	},

	members: {
		// overloaded - called whenever the table request the row count
		_loadRowCount: function() {
			var q = this._getCountQuery();
			q.send();
		},

		_onRowCountCompleted: function(e) {
			var data = e.getData();
			if (data != null) {
				this._onRowCountLoaded(data.value[this.getModelName()]);
			}
		},

		_getCountQuery: function() {
			var q = new vuuvv.Query;
			q.addListener("completed", this._onRowCountCompleted, this);
			q.data(this.getModelName(), {});
			q.count();
			return q;
		},

		_getQuery: function(firstRow, lastRow) {
			var q = new vuuvv.Query;
			var sortIndex = this.getSortColumnIndex();
			var sortName = null;
			var relations = this.getRelations();
			if (sortIndex != -1) {
				sortName = this.getColumnName(sortIndex);
				// sort for the relations field
				if (sortName) {
					var name = relations[sortName];
					if (name !== undefined) {
						sortName = sortName + "__" + name;
					}
					if (!this.isSortAscending()) {
						sortName = "-" + sortName;
					}
				}
			}
			q.addListener("completed", this._onLoadDataCompleted, this);
			q.data(this.getModelName(), {
				limit: [firstRow, lastRow],
				fields: this.getFields(),
				relations: this.getRelations(),
				orderby: sortName ? [sortName] : []
			});
			q.query();
			return q;
		},

		// overloaded - called whenever the table requests new data
		_loadRowData: function(firstRow, lastRow) {
			var q = this._getQuery(firstRow, lastRow);
			q.send();
		},

		_onLoadDataCompleted: function(e) {
			var data = e.getData();
			this._onRowDataLoaded(data.value[this.getModelName()]);
		}
	}
});
