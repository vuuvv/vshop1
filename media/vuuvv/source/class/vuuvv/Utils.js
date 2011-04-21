qx.Class.define("vuuvv.Utils", {
	statics: {
		/**
		 * [] is False
		 */
		isFalse: function(value) {
			if (qx.lang.Type.isArray(value) && value.length === 0)
				return false;
			return !!value;
		}
	}
});
