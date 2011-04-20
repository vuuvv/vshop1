qx.Class.define("vuuvv.ui.Uploader", {
	extend: qx.ui.embed.Flash,

	construct: function(swfUrl, callback, buttonSkin, multiple) {
		swfUrl = swfUrl || "/media/flash/uploader.swf";
		callback = callback || "vuuvv.ui.Uploader.callback";
		buttonSkin = buttonSkin || "/media/images/selectFileButton.png";
		multiple = multiple === undefined ? true : multiple;
		this.base(arguments, swfUrl);
		this.setWmode("transparent");
		var id = vuuvv.ui.Uploader.generateId();
		this.setVariables({
			"YUIBridgeCallback": callback,
			"buttonSkin": buttonSkin,
			"YUISwfId": id
		});
		this.setId(id);
		vuuvv.ui.Uploader.addUploader(id, this);
		this.addListener("swfReady", function(e) {
			this.setAllowMultipleFiles(multiple);
		}, this);
	},

	events: {
		swfReady: "qx.event.type.Event",
		fileSelect: "qx.event.type.Data",
		uploadStart: "qx.event.type.Event",
		uploadProgress: "qx.event.type.Data",
		uploadCancel: "qx.event.type.Event",
		uploadComplete: "qx.event.type.Event",
		uploadCompleteData: "qx.event.type.Data",
		uploadError: "qx.event.type.Data"
	},

	statics: {
		uploader: {},

		id: 1,

		addUploader: function(id, uploader) {
			vuuvv.ui.Uploader.uploader[id] = uploader;
		},

		generateId: function() {
			return "genuploader-" + vuuvv.ui.Uploader.id++;
		},

		getUploader: function(id) {
			return vuuvv.ui.Uploader.uploader[id] || null;
		},

		callback: function(id, evt) {
			var me = vuuvv.ui.Uploader.getUploader(id);
			var data = {};
			for (var key in evt) {
				if (key !== "type")
					data[key] = evt[key];
			}
			if (data !== {})
				me.fireDataEvent(evt.type, data);
			else
				me.fireEvent(evt.type);
		}
	},

	members: {
		upload: function(fileid, url, method, vars, fieldName) {
			this.getFlashElement().upload(fileid, url, method, vars, fieldName);
		},

		uploadThese: function(fileids, url, method, vars, fieldName) {
			this.getFlashElement().uploadThese(fileids, url, method, vars, fieldName);
		},

		uploadAll: function(url, method, vars, fieldName) {
			this.getFlashElement().uploadAll(url, method, vars, fieldName);
		},

		cancel: function(fileid) {
			this.getFlashElement().cancel(fileid);
		},

		clearFileList: function() {
			this.getFlashElement().clearFileList();
		},

		removeFile: function (fileID) {
			this.getFlashElement().removeFile(fileID);
		},

		setAllowLogging: function (allowLogging) {
			this.getFlashElement().setAllowLogging(allowLogging);
		},

		setSimUploadLimit : function (simUploadLimit) {
		   this.getFlashElement().setSimUploadLimit(simUploadLimit);
		},

		setAllowMultipleFiles : function (allowMultipleFiles) {
			this.getFlashElement().setAllowMultipleFiles(allowMultipleFiles);
		},

		setFileFilters : function (fileFilters) {
		   this.getFlashElement().setFileFilters(fileFilters);
		},

		enable : function () {
			this.getFlashElement().enable();
		},

		disable : function () {
			this.getFlashElement().disable();
		}
	},

	destruct: function() {
		this._disposeObjects();
		delete vuuvv.ui.Uploader.uploader(this.getId());
	}
});
