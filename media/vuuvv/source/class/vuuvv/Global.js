/* ************************************************************************

#asset(qx/icon/${qx.icontheme}/22/actions/*.png)
#asset(qx/icon/${qx.icontheme}/16/actions/*.png)
#asset(qx/icon/${qx.icontheme}/64/actions/*.png)
#asset(vuuvv/images/*)
************************************************************************ */
qx.Class.define("vuuvv.Global", {
	statics: {
		csrf_token: null,

		icons: {
			"new": "icon/22/actions/document-new.png",
			"edit": "icon/22/actions/document-properties.png",
			"delete": "icon/22/actions/edit-delete.png",
			"find": "icon/22/actions/edit-find.png",
			"reload": "icon/22/actions/view-refresh.png",
			"up": "icon/22/actions/go-up.png",
			"enter": "icon/22/actions/dialog-ok.png",
			"src": "icon/22/actions/document-properties.png",
			"bold": "icon/16/actions/format-text-bold.png",
			"italic": "icon/16/actions/format-text-italic.png",
			"underline": "icon/16/actions/format-text-underline.png",
			"strikethrough": "icon/16/actions/format-text-strikethrough.png",
			"removeformat": "icon/16/actions/edit-clear.png",
			"alignleft": "icon/16/actions/format-justify-left.png",
			"aligncenter": "icon/16/actions/format-justify-center.png",
			"alignright": "icon/16/actions/format-justify-right.png",
			"alignjustify": "icon/16/actions/format-justify-fill.png",
			"indent": "icon/16/actions/format-indent-more.png",
			"outdent": "icon/16/actions/format-indent-less.png",
			"insertimage": "icon/16/actions/insert-image.png",
			"inserthr": "vuuvv/images/insert-horizontal-rule.png",
			"ol": "vuuvv/images/format-list-ordered.png",
			"ul": "vuuvv/images/format-list-unordered.png",
			"undo": "icon/16/actions/edit-undo.png",
			"redo": "icon/16/actions/edit-redo.png",
			"loading": "vuuvv/images/loading66.gif",
			"loadingfailed": "icon/64/actions/edit-delete.png"
		},

		getIcon: function(name) {
			return vuuvv.Global.icons[name.toLowerCase()] || null;
		},

		urls: {
			"login": "/manage/login",
			"appdata": "/manage/appdata"
		},

		getUrl: function(name) {
			return vuuvv.Global.urls[name.toLowerCase()] || null;
		},

		query_prefix: "/manage"
	}
});
