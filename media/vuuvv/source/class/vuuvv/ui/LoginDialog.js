qx.Class.define("vuuvv.ui.LoginDialog", {
	extend: qx.ui.window.Window,

	events: {
		success: "qx.event.type.Data"
	},

	construct: function() {
		this.base(arguments);
		this.setModal(true);
		this.setCaption("Login");
		this.createWidgets();
		this.center();
	},

	members: {
		__controller: null,
		__form: null,

		createWidgets: function() {
			this.setLayout(new qx.ui.layout.VBox);
			var form = new qx.ui.form.Form();
			form.add(new qx.ui.form.TextField(), "username");
			form.add(new qx.ui.form.PasswordField(), "password");
			var csrf = new qx.ui.form.TextField();
			form.add(csrf, "csrfmiddlewaretoken");
			csrf.exclude();

			var login = new qx.ui.form.Button("Login");
			var reset = new qx.ui.form.Button("Reset");
			form.addButton(login);
			form.addButton(reset);

			login.addListener("execute", this.onLogin, this);
			reset.addListener("execute", this.onReset, this);
			this.__controller = new qx.data.controller.Form(null, form);
			var model = this.__controller.createModel();
			model.setCsrfmiddlewaretoken(vuuvv.Global.csrf_token);
			this.__form = form;
			this.add(new qx.ui.form.renderer.Single(form));
		},

		getModel: function() {
			return this.__controller.getModel();
		},

		onLogin: function() {
			if (this.__form.validate()) {
				var req = new qx.io.remote.Request(vuuvv.Global.getUrl("login"), "POST", "application/json");
				req.setTimeout(180000);
				req.setProhibitCaching(false);

				req.setData(qx.util.Serializer.toUriParameter(this.getModel()));

				req.addListener("completed", this.onDataCompleted, this);
				req.addListener("failed", this.onFailed, this);
				req.send();
			}
		},

		onDataCompleted: function(e) {
			var data = e.getContent();
			if (data.type == "error") {
				alert(data.message);
			} else {
				this.fireDataEvent("success", data);
				this.hide();
			}
		},

		onFailed: function(e) {
		},

		onReset: function() {
			this.__form.reset();
		}
	},

	destruct: function() {
		this._disposeObjects("__controller", "__form");
		this.__controller = null;
		this.__form = null;
	}
});
