qx.Class.define("vuuvv.ui.Image", {
	extend: qx.ui.container.Composite,

	construct: function(source) {
		var layout = new qx.ui.layout.Atom;
		layout.setCenter(true);
		this.base(arguments, layout);
		this.add(new qx.ui.basic.Image(source));
	}
});
