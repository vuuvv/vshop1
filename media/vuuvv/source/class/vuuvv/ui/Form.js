/**
#require(qx.ui.form.DateField)
*/
qx.Class.define("vuuvv.ui.Form", {
	extend: qx.ui.container.Composite,

	construct: function(name, proto) {
		this.base(arguments, new qx.ui.layout.VBox());
		this.setBackgroundColor("background-splitpane");
		this.setName(name);
		this.setProto(proto);

		var groupBox = new qx.ui.groupbox.GroupBox(name + " Details");
		groupBox.setLayout(new qx.ui.layout.Canvas());
		this._form = this.setupForm();
		groupBox.add(new qx.ui.form.renderer.Single(this._form));

		this.add(groupBox);
	},

	events: {
		beforesave: "qx.event.type.Data",
		aftersave: "qx.event.type.Data",
		cancel: "qx.event.type.Event"
	},

	statics: {
		converter: {
			int2str: {
				converter: function(data) {
					return data + "";
				}
			},
			str2int: {
				converter: function(data) {
					return parseInt(data);
				}
			}
		}
	},

	properties: {
		/**
		 * proto is a array contain the all field of the form 
		 * every proto items have 5 fields: name, init, type, controller, options
		 */
		proto: {
			nullable: true
		},

		name: {
			nullable: true
		}
	},

	members: {
		_form: null,
		_protoModel: null,
		_controller: null,
		_widgets: {},

		setupForm: function() {
			var form = new qx.ui.form.Form();
			var proto = this.getProto();
			var cls, widget, ctrl, item;
			this._controller = new qx.data.controller.Form(null, form);
			for (var name in proto) {
				item = proto[name];
				if (item.type == "HtmlArea")
					cls = vuuvv.ui.HtmlArea;
				else
					cls = qx.Class.getByName("qx.ui.form." + item.type);
				widget = new cls;
				if (item.options)
					widget.set(item.options);
				form.add(widget, name);
				this._widgets[name] = widget;

				if (item.type == "DateField") {
					widget.setDateFormat(vuuvv.utils.mydateFormat());
					this._controller.addBindingOptions(name, {
						converter : function(data) {
							// model --> target
							return vuuvv.utils.mydateFormat().parse(data);
						}}, {converter : function(data) {
							// target --> model
							return vuuvv.utils.mydateFormat().format(data);
					}});
				}

				if (qx.lang.Type.isNumber(item.init)) {
					this._controller.addBindingOptions(name, {
						converter : function(data) {
							// model --> target
							return data + "";
						}}, {converter : function(data) {
							// target --> model
							return parseInt(data);
					}});
				}

				if (item.type == "SelectBox") {
					ctrl = new qx.data.controller.List(null, widget);
					if (item.delegate)
						ctrl.setDelegate(item.delegate);
					item["controller"] = ctrl;
				}
			}

			this.reset();

			var saveBtn = new qx.ui.form.Button("Save");
			form.addButton(saveBtn);
			var cancelBtn = new qx.ui.form.Button("Cancel");
			form.addButton(cancelBtn);

			saveBtn.addListener("execute", this._onSave, this);
			cancelBtn.addListener("execute", this._onCancel, this);

			return form;
		},

		getProtoModel: function() {
			if (this._protoModel)
				return this._protoModel;
			var proto = this.getProto();
			var model = {id: -1};
			for (var name in proto) {
				model[name] = proto[name].init;
			}
			return qx.data.marshal.Json.createModel(model);
		},

		reset: function() {
			this._controller.setModel(this.getProtoModel());
		},

		setModel: function(data, name) {
			var ctrl = name ? this.getController(name) : this.getController();
			var model = qx.data.marshal.Json.createModel(data);
			ctrl.setModel(model);
		},

		/**
		 * Get the controller of the specified name, like selectbox widget
		 * If name is not specified, return the form controller.
		 */ 
		getController: function(name) {
			if (name)
				return this.getProto()[name].controller;
			return this._controller;
		},

		getWidget: function(name) {
			return this._widgets[name];
		},

		_onSave: function() {
			if (this._form.validate()) {
				for (var name in this._widgets) {
					if (this._widgets[name].classname == "vuuvv.ui.HtmlArea")
						this._widgets[name].syncValue();
				}
				var data = qx.util.Serializer.toUriParameter(this._controller.getModel());
				this.fireDataEvent("beforesave", this._controller.getModel());
				var q = new vuuvv.Query;
				q.addListener("completed", this._onSaveCompleted, this);
				q.setName(this.getName());
				q.setValue(data);
				q.setType("save");
				q.query();
			}
		},

		_onSaveCompleted: function(e) {
			var model = this._controller.getModel();
			this.fireDataEvent("aftersave", e.getData());
		},

		_onCancel: function() {
			this.fireEvent("cancel");
		}
	},

	destruct: function() {
		this._disposeObjects("_form", "_protoModel", "_controller");
		this._disposeMap("_widgets");
		this._form = null;
		this._protoModel = null;
		this._controller = null;
		this._widgets = null;
	}
});
