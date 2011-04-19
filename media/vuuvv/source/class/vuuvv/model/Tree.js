qx.Class.define("vuuvv.model.Tree", {
	extend: qx.core.Object,

	construct: function() {
		this.base(arguments);
		this.setChildren(new qx.data.Array());
	},

	properties: 
	{
		children: {
			check: "qx.data.Array",
			event: "changeChildren"
		},

		parent: {
			check: "vuuvv.model.Tree",
			event: "changeParent",
			init: null
		}
	},

	members: 
	{
		pwd: function(tag) {
			if (this.getParent() == null) {
				return [this.get(tag)];
			} else {
				return this.getParent().pwd(tag).concat(this.get(tag));
			}
		},

		getIterator: function(style, exclude_self) {
			var agenda = exclude_self ? [] : [this];
			var depthfirst = style == "depth" ? 1 : 0;

			function f() {
				var curr;

				if (agenda.length) {
					curr = agenda.shift();
					var children = curr.getChildren().toArray();

					if (children.length) {
						if (depthfirst) {
							agenda = children.concat(agenda);  // depth-first
						} else {
							agenda = agenda.concat(children);  // breadth-first
						}
					}
				}
				else 
					curr = null;
				return curr;
			}

			// f()
			return f;
		},

		map: function(fun, args, exclude_self) {
			var style = "depth";
			var curr = this;

			var iter = this.getIterator(style, exclude_self);
			while (curr = iter())
				   fun.apply(curr, args);
		},

		add: function(node, orderPath) {
			var kids = this.getChildren();
			if (orderPath) {
				// because the number of data is small, so use the simple algorithm
				var order = node.get(orderPath);
				for (var i = 0; i < kids.length; i++) {
					if (order < kids.getItem(i).get(orderPath)) {
						break;
					}
				}
				kids.insertAt(i, node);
			} else
				kids.push(node);
			node.setParent(this);
		},

		// include self
		siblings: function() {
			return this.getParent().getChildren();
		},

		rm: function() {
			this.siblings().remove(this);
		},

		isDescendantOf: function(node, include_self) {
			include_self = include_self || false;
			if (include_self && this == node)
				return true;

			var p = this.getParent();
			while (p) {
				if (p == node)
					return true;
				p = p.getParent()
			}
			return false;
		},

		isAncestorOf: function(node, include_self) {
			return node.isDescendantOf(this, include_self);
		},

		// not check the circular reference
		moveto: function(node, orderPath) {
			orderPath = orderPath || false;
			this.rm();
			node.add(this, orderPath);
		}
	},

	statics: 
	{
		/**
		 * data: Is a premium Array of javascript
		 */
		create: function(data, cls, parentPath, orderPath) {
			var orderPath = orderPath || "id";
			var root = new cls();
			root.setLabel("---");
			root.setId(null);
			var lookup = {};

			// this loop is assign the normal properties to the model class object
			for (var i = 0; i < data.length; i++) {
				var model = new cls();
				var item = data[i];

				var properties = qx.util.PropertyUtil.getProperties(model.constructor);
				for (var p in properties) {
					if (p != 'children' || p != 'parent')
						model.set(p, item[p]);
				}
				lookup[i] = model;
			}

			// this loop make the parent children relationship
			for (var i in lookup) {
				var pid = data[i][parentPath];
				var item = lookup[i];
				var p = pid ? lookup[pid] : root;
				p.add(item, orderPath);
			}
			lookup[-1] = root;
			return lookup;
		},

		findRoots: function(nodes) {
			var items = [];
			for (var i = 0; i < nodes.length; i++) {
				var item = nodes.getItem(i);
				if (item.getId() == -1) {
					items = item.getChildren().toArray();
					break;
				}

				var valid = true;
				for (var j = 0; j < items.length; j++) {
					var old = items[j];
					if (old.isDescendantOf(item)) {
						items.splice(j, 1);
						j--;
					} else if (old.isAncestorOf(item)) {
						valid = false;
						break;
					}
				}
				if (valid) 
					items.push(item);
			}
			return items;
		}
	}
});
