qx.Class.define("vuuvv.ui.FileBrowser", {
	extend: qx.ui.window.Window,

	construct: function() {
		this.base(arguments);
		this.setLayout(new qx.ui.layout.VBox);
		this._createWidgetContent();
		this.center();
	},

	properties: {
		modal: {
			refine: true,
			init: true
		}
	},

	members: {
		_createWidgetContent: function() {
			var toolbar = new qx.ui.toolbar.ToolBar();
			toolbar.add(new qx.ui.toolbar.Button("test"));
			this.add(toolbar);

			var container = new qx.ui.splitpane.Pane("horizontal");

			this._table = this._getTable();
			container.add(this._table, 1);
			this._rightside = this._getInfoArea();
			container.add(this._rightside, 0);

			this.add(container);

			this._enableDnd();
		},

		_enableDnd: function() {
			var self = this;
			this.addListener("appear", function() {
				var dom = this._rightside.getContainerElement().getDomElement();
				qx.bom.Event.addNativeListener(dom, "dragover", function(e) {
					qx.bom.Event.preventDefault(e);
					self._onDragOver(e);
				});
				qx.bom.Event.addNativeListener(dom, "dragenter", function(e) {
					self._onDragEnter(e);
				});
				qx.bom.Event.addNativeListener(dom, "dragleave", function(e) {
					qx.bom.Event.preventDefault(e);
					self._onDragLevel(e);
				});
				qx.bom.Event.addNativeListener(dom, "drop", function(e) {
					qx.bom.Event.preventDefault(e);
					self._onDrop(e);
				});
			}, this);
		},

		_getTable: function() {
			var model = new vuuvv.model.RemoteFileModel;
			var table = new qx.ui.table.Table(model);

			table.getTableColumnModel().setColumnVisible(0, false);
			this.set({width: 600, height: 400});
			var newRenderer = new qx.ui.table.cellrenderer.Conditional();
			newRenderer.addNumericCondition("==", true, null, "#0000FF", null, null, "dir");
			table.getTableColumnModel().setDataCellRenderer(1, newRenderer);

			table.addListener("cellDblclick", function(e) {
				var model = table.getTableModel();
				if (model.cdRow(e.getRow())) {
					table.setFocusedCell(0, 0);
					table.getSelectionModel().setSelectionInterval(0, 0);
				}
			}, this);
			table.getSelectionModel().addListener("changeSelection", function(e) {
				var model = table.getTableModel();
				var row = e.getTarget().getSelectedRanges()[0].minIndex;
				if (row) {
					var src = model.rowPath(row);
					this.debug(vuuvv.utils.suffix(src));
					if (["jpg", "png", "gif"].indexOf(vuuvv.utils.suffix(src)) >= 0)
						this._preview.setSource(src);
				}
			}, this);
			return table;
		},

		_getInfoArea: function() {
			var vbox = new qx.ui.layout.VBox().set({spacing: 3});
			var container = new qx.ui.container.Composite(vbox).set({
				backgroundColor: "#AFAFAF",
				width: 200
			});

			var btnPane = new qx.ui.container.Composite(new qx.ui.layout.HBox).set({
				height: 40
			});
			var uploader = new vuuvv.ui.Uploader();
			btnPane.add(uploader);
			var uploadBtn = new qx.ui.form.Button("Upload", "/media/images/uploadFileButton1.png").set({
				show: "icon",
				padding: 0
			});
			btnPane.add(uploadBtn);
			uploadBtn.addListener("execute", function() {
				uploader.uploadAll("/admin/upload", "POST", {"path": "/media/upload"});
			}, this);

			uploader.addListener("fileSelect", function(e) {
				var files = e.getData().fileList;
				var rawdata = [];
				for (var i in files) {
					var model = this._getProtoModel();
					model.setName(files[i].name);
					model.setSize(files[i].size);
					model.setId(files[i].id);
					rawdata.push(model);
				}
				this._filectrl.setModel(new qx.data.Array(rawdata));
				console.log(files);
			}, this);
			uploader.addListener("uploadProgress", function(e) {
				this.debug("uploadProgress");
				var files = this._filectrl.getModel();
				var data = e.getData();
				console.log(data);
				for (var i = 0; i < files.length; i++){
					if (files.getItem(i).getId() === data.id) {
						break;
					}
				}
				files.getItem(i).setUploaded(data.bytesLoaded);
			}, this);
			uploader.addListener("uploadCompleteData", function(e) {
				this.debug("uploadCompleteData");
			}, this);
			container.add(btnPane);

			var fileList = new qx.ui.form.List();
			this._filectrl = new qx.data.controller.List(null, fileList);
			container.add(fileList, {flex: 1});

			var preview = this._getPreview();
			container.add(preview, {height: "40%"});

			this._filectrl.setDelegate({
				createItem: function() {
					return new vuuvv.ui.UploadView();
				},

				bindItem: function(ctrl, item, id) {
					ctrl.bindProperty("name", "name", null, item, id);
					ctrl.bindProperty("uploaded", "uploaded", null, item, id);
					ctrl.bindProperty("size", "size", null, item, id);
				},

				configureItem: function(item) {
				}
			});
			return container;
		},

		_getProtoModel: function() {
			var data = {
				id: "",
				name: "",
				uploaded: 0,
				size: 0
			};
			return qx.data.marshal.Json.createModel(data);
		},

		_getPreview: function() {
			var layout = new qx.ui.layout.Atom;
			layout.setCenter(true);
			var border = new qx.ui.decoration.Single(1, "solid", "black");
			var container = new qx.ui.container.Composite(layout).set({
				backgroundColor: "white",
				decorator: border
			});
			this._preview = new qx.ui.basic.Image().set({
				decorator: border,
				scale: true
			});
			this._preview.addListener("changeSource", this._adjustImage, this);
			this._preview.addListener("loaded", this._adjustImage, this);
			container.add(this._preview);
			return container;
		},

		_adjustImage: function() {
			var src = this._preview.getSource();
			var loader = qx.io.ImageLoader;
			if (loader.isLoaded(src)) {
				var area = vuuvv.utils.shrink(loader.getWidth(src), loader.getHeight(src), 160, 160);
				this.debug(area);
				this._preview.set({
					width: parseInt(area.x),
					height: parseInt(area.y)
				});
			}
		},

		_setDragEffect: function() {
			this._rightside.getContentElement().setStyle("backgroundColor", "#cccccc");
		},

		_clearDragEffect: function() {
			this._rightside.getContentElement().setStyle("backgroundColor", "");
		},

		_onDragOver: function(e) {
		},

		_onDragEnter: function(e) {
			this._setDragEffect();
			this.debug("dragenter");
		},

		_onDragLevel: function(e) {
			this._clearDragEffect();
			this.debug("dragleave");
		},

		_onDrop: function(e) {
			this._clearDragEffect();
			this.debug("drop");
			console.log(e.dataTransfer.files);
		}
	}
});
