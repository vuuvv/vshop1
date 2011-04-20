qx.Class.define("vuuvv.ui.UploadView", {
	extend: qx.ui.core.Widget,
	include: [qx.ui.form.MModelProperty],

	construct: function() {
		this.base(arguments);

		var layout = new qx.ui.layout.HBox(3);
		this._setLayout(layout);

		this._createChildControl("name");
		this._createChildControl("progress");
		this._createChildControl("uploaded");
		this._createChildControl("size");
	},

	properties: {
		appearance: {
			refine: true,
			init: "listitem"
		},

		name: {
			check: "String",
			apply: "_applyName",
			nullable: true
		},

		size: {
			check: "Integer",
			apply: "_applySize",
			nullable: true
		},

		uploaded: {
			check: "Integer",
			apply: "_applyUploaded",
			nullable: true
		}
	},

	members: {
		_createChildControlImpl: function(id) {
			var control;

			switch(id) {
				case "name":
					control = new qx.ui.basic.Label(this.getName());
					control.setAnonymous(true);
					this._add(control, {width: "30%"});
					break;
				case "progress":
					control = new qx.ui.basic.Label(this.getUploaded());
					control.setAnonymous(true);
					this._add(control, {width: "50%"});
					break;
				case "uploaded":
					control = new qx.ui.basic.Label(this.getUploaded());
					control.setAnonymous(true);
					this._add(control, {width: "10%"});
					break;
				case "size":
					control = new qx.ui.basic.Label(this.getSize());
					control.setAnonymous(true);
					this._add(control, {width: "10%"});
					break;
			}

			return control || this.base(arguments, id);
		},

		_applyName: function(value, old) {
			var name = this.getChildControl("name");
			name.setValue(value);
		},

		_applySize: function(value, old) {
			var size = this.getChildControl("size");
			size.setValue(value+"");
		},

		_applyUploaded: function(value, old) {
			var uploaded = this.getChildControl("uploaded");
			uploaded.setValue(value+"");
		}
	}
});
