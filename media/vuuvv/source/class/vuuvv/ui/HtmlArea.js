qx.Class.define("vuuvv.ui.HtmlArea", {
	extend: qx.ui.container.Composite,
	implement: [
		qx.ui.form.IForm,
		qx.ui.form.IStringForm
	],
	include: [
		qx.ui.form.MForm
	],

	construct: function() {
		this.base(arguments, new qx.ui.layout.VBox());

		this._htmlArea = new qx.ui.embed.HtmlArea("", null, "blank.html");
		this._htmlArea.set( {width: 600, height:400} );

		this._srcArea = new qx.ui.form.TextArea();

		this._editArea = new qx.ui.container.Stack();
		this._editArea.add(this._htmlArea);
		this._editArea.add(this._srcArea);

		this.add(this._setupToolBar());
		this.add(this._editArea);

		this.bind("value", this._srcArea, "value");
		this.bind("value", this._htmlArea, "value");
		this._srcArea.bind("value", this, "value");
		//this._htmlArea.bind("value", this, "value");
	},

	properties: {
		value: {
			check: "String",
			init: "",
			nullable: true,
			apply: "_applyValue",
			event: "changeValue"
		},

		mode: {
			check: ["src", "html"],
			init: "html",
			event: "changeMode"
		}
	},

	members : {
		_htmlArea: null,
		_filebrowser: null,

		_applyValue: function(value, old) {
			if(!this._htmlArea.getIframeObject() && value) {
				this._htmlArea.addListenerOnce("appear", function() {
					this.setValue(value);
				}, this._htmlArea);
			}
		},

		syncValue: function() {
			this.setValue(this._htmlArea.getHtml());
		},

		resetValue : function() {
			this.initValue();
		},

		_test: function() {
			this.debug(this.getHtml());
		},

		_getUploader: function() {
		},

		_getToolbarEntries: function() {
			return [{
				bold:                { text: "Format Bold", action: this._htmlArea.setBold },
				italic:              { text: "Format Italic", action: this._htmlArea.setItalic },
				underline:           { text: "Format Underline", action: this._htmlArea.setUnderline },
				strikethrough:       { text: "Format Strikethrough", action: this._htmlArea.setStrikeThrough },
				removeFormat:        { text: "Remove Format", action: this._htmlArea.removeFormat }
			}, {
				alignLeft:           { text: "Align Left", action: this._htmlArea.setJustifyLeft },
				alignCenter:         { text: "Align Center", action: this._htmlArea.setJustifyCenter },
				alignRight:          { text: "Align Right", action: this._htmlArea.setJustifyRight },
				alignJustify:        { text: "Align Justify", action: this._htmlArea.setJustifyFull }
			}, {
				indent:              { text: "Indent More", action: this._htmlArea.insertIndent },
				outdent:             { text: "Indent Less", action: this._htmlArea.insertOutdent }
			}, {
				insertImage:         { text: "Insert Image", action: this._insertImageHandler, context: this},
				insertHR:            { text: "Insert Horizontal Ruler", action: this._htmlArea.insertHorizontalRuler }
			}, {
				ol:                  { text: "Insert Ordered List", action: this._htmlArea.insertOrderedList },
				ul:                  { text: "Inserted Unordered List", action: this._htmlArea.insertUnorderedList }
			}, {
				undo:                { text: "Undo Last Change", action: this._htmlArea.undo },
				redo:                { text: "Redo Last Undo Step", action: this._htmlArea.redo }
			}, {
				src:                 { text: "Go to source code", action: this._showSource, context: this}
			}];
		},

		_setupToolBar: function() {
			var toolbar = new qx.ui.toolbar.ToolBar;
			toolbar.setDecorator("main");
			var btn;
			var items = this._getToolbarEntries();
			for (var i = 0; i < items.length; i++) {
				var part = new qx.ui.toolbar.Part;
				toolbar.add(part);

				for(var j in items[i]) {
					var item = items[i][j];
					var image = vuuvv.Global.getIcon(j);
					var label = image ? null : j;
					var context = item.context ? item.context : this._htmlArea;
					btn = new qx.ui.toolbar.Button(label, image);;
					btn.set({
						focusable: false,
						keepFocus: true,
						center: true,
						toolTipText: item.text ? item.text : ""
					});
					btn.addListener("execute", item.action, context);
					part.add(btn);
				}
			}
			return toolbar;
		},

		_showSource: function() {
			var mode = this.getMode();
			if (mode === "html") {
				this.syncValue();
				this._editArea.setSelection([this._srcArea]);
				this.setMode("src");
			} else {
				this._editArea.setSelection([this._htmlArea]);
				this.setMode("html");
			}
		},

		_insertImageHandler: function() {
			this.getFileBrowser().show();
		},

		getFileBrowser: function() {
			if (!this._filebrowser)
				this._filebrowser = new vuuvv.ui.FileBrowser();
			return this._filebrowser;
		}
	},

	destruct : function() {
		this._disposeObjects("_htmlArea", "_filebrowser");
	}
});
