from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render_to_response
from django.conf import settings
from utils import get_template
from models import Nav, Category, Goods, Specification
from tree import Tree
import forms
import json
import logging

TEMPLATE = "ecshop"

def index(request):
	nav = Nav.objects.all()
	data = {
		"nav_top": [n for n in nav if n.position == "top"],
		"nav_middle": [n for n in nav if n.position == "middle"],
		"nav_bottom": [n for n in nav if n.position == "bottom"],
		"categories": Tree(list(Category.objects.all().values())),
	}
	return render_to_response(get_template("index.html"), {"data": data})

def goods_detail(request, id):
	nav = Nav.objects.all()
	goods = Goods.objects.get(id=id)
	props = json.loads(goods.properties)
	spec = Specification.objects.filter(id__in=props["spec"])
	data = {
		"nav_top": [n for n in nav if n.position == "top"],
		"nav_middle": [n for n in nav if n.position == "middle"],
		"nav_bottom": [n for n in nav if n.position == "bottom"],
		"categories": Tree(list(Category.objects.all().values())),
		"goods": goods,
		"spec": spec,
		"specitem": json.dumps(props["specitem"]),
	}
	return render_to_response(get_template("goods_detail.html"), {"data": data})

def login(request):
	from django.contrib.auth.views import login
	return login(request, get_template("index.html"))

def register(request):
	form = forms.RegistrationForm()
	return render_to_response(get_template("index.html"), {"form": form})

def media(request, path):
	import django.views.static
	root = getattr(settings, 'MEDIA_ROOT', None)
	return django.views.static.serve(request, path, root)

