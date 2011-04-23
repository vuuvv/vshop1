
class Node(object):
	def __init__(self, data):
		self.data = data
		self.children = []
		self.parent = None

	def hasChildren(self):
		return len(self.children) != 0

	def is_root(self):
		return self.parent == None

	def is_leaf(self):
		return not self.children

	def is_descendant_of(self, other, include_self=False):
		if include_self and self == other:
			return True

		p = self.parent
		while p is not None:
			if p == other:
				return True
			p = p.parent
		return False

	def is_acenstor_of(self, other, include_self=False):
		return other.is_descendant_of(self, include_self)

	def pwd(self):
		if self.parent is None:
			return [self]
		else:
			return self.parent.pwd() + [self]

	def xpath(self, path, attr):
		parts = [ i for i in path.split("/") if i]
		curr = self
		for part in parts:
			item = curr.find_from_children(attr, part)
			if item:
				curr = item
			else:
				return None
		return curr

	def find_from_children(self, key, val):
		for item in self.children:
			if item.data[key] == val:
				return item
		return None

	def leaf(self):
		return [i for i in self if not i.children]

	def sibling(self, offset):
		if not self.parent:
			return None
		sibs = self.parent.children
		index = sibs.index(self) + offset
		if index >= 0 and index < len(sibs):
			return sibs[index]
		return None

	def siblings(self):
		return self.parent.children

	def left(self):
		return self.sibling(-1)

	def right(self):
		return self.sibling(1)

	def add(self, node):
		if type(node) == Node:
			node = [node]
		self.children.extend(node)
		map(lambda x: setattr(x, "parent", self), node)
		return self

	def remove(self, node):
		try:
			self.children.remove(node)
		except:
			pass

	def __iter__(self):
		return self.iterator()

	def iterator(self):
		agenda = [self]

		while len(agenda):
			curr = agenda.pop(0)
			agenda = curr.children + agenda
			yield curr

class Tree(object):
	def __init__(self, objects, parent_path="parent_id", label_path="name"):
		self.objects = objects
		self._id_lookup = {None: Node({label_path: "---"})}
		self.root = self._id_lookup[None]

		# set item to all lookup dictory
		for item in objects:
			self._id_lookup[item["id"]] = Node(item)

		# create tree struct
		for key, val in self._id_lookup.items():
			if key is not None:
				pid = val.data[parent_path]
				parent = self._id_lookup[pid]
				parent.add(val)

if __name__ == "__main__":
	Node1 = Node({"label": "1"})
	Node2 = Node({"label": "2"})
	Node3 = Node({"label": "3"})
	Node4 = Node({"label": "4"})
	Node5 = Node({"label": "5"})
	Node6 = Node({"label": "6"})
	Node7 = Node({"label": "7"})
	Node8 = Node({"label": "8"})

	Node1.add([Node7, Node3, Node6])
	Node7.add([Node2, Node5])
	Node3.add([Node4])
	Node4.add(Node8)

	def p(x): print x
	map(lambda x: p(x.data), Node1)
	print
	map(lambda x: p(x.data), Node1.leaf())
	print
	print Node3.left().data
	print Node3.right().data
	print Node3.is_descendant_of(Node3, True)
	print Node3.is_descendant_of(Node3)
	print Node8.is_descendant_of(Node3)
	print Node5.is_descendant_of(Node3)
	print Node3.is_acenstor_of(Node3, True)
	print Node3.is_acenstor_of(Node3)
	print Node8.is_acenstor_of(Node6, True)
	print Node7.is_acenstor_of(Node5, True)
	print
	print Node8.pwd()
	print Node1.xpath("7/2", "label").data
