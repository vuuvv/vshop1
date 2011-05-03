from django import template
register = template.Library()

@register.tag(name="box1")
def do_box1(parser, token):
	nodelist = parser.parse(('endbox1',))
	parser.delete_first_token()
	return BoxNode(nodelist, 1)

@register.tag(name="box2")
def do_box1(parser, token):
	nodelist = parser.parse(('endbox2',))
	parser.delete_first_token()
	return BoxNode(nodelist, 2)

class BoxNode(template.Node):
	def __init__(self, nodelist, number):
		self.nodelist = nodelist
		self.number = number

	def render(self, context):
		output = '<div class="box clearfix"><div class="box_%s clearfix">%s</div></div>' % (self.number, self.nodelist.render(context))
		return output
