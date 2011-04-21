from django.http import HttpResponseRedirect, HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from decorators import login_required, model_query
from utils import ajax_response, get_fields_name, query as _query, related_query as _related_query, set_data_to_model
from models import Menu
import json

@login_required
def appdata(request):
	value = {
		"Menu": list(Menu.objects.all().values()),
	}
	return ajax_response(request, "success", "", value)

def login(request):
	from django.contrib.auth import authenticate, login
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(username=username, password=password)
	if user is not None:
		if user.is_active:
			login(request, user)
			return ajax_response(request, "success", "login success")
		else:
			return ajax_response(request, "error", "account disabled")
	else:
		return ajax_response(request, "error", "invalid username and password")

@model_query("view")
def query(cls, data):
	obj = doquery(cls, data)
	return list(obj)

@model_query("view")
def count(cls, data):
	obj = doquery(cls, data)
	return obj.count()

@model_query("add")
def save(cls, data):
	ret = {"create": False, "id": None}
	value = data["value"]
	fields = set_data_to_model(cls, value)
	id = fields["id"]
	if id is None:
		ret["create"] = True
		fields.pop("id")
	model = cls(**fields)
	model.save()
	ret["id"] = model.id
	return ret

@model_query("delete")
def delete(cls, data):
	conditions = data.get("conditions", {})
	obj = cls.objects.filter(**conditions)
	obj.delete()
	return "deleted"

def doquery(cls, data):
	fields = data.get("fields", [])
	conditions = data.get("conditions", {})
	orderby = data.get("orderby", [])
	limit = data.get("limit", [])
	relations = data.get("relations", {})

	if fields and "id" not in fields:
		fields.append("id")

	if relations:
		return _related_query(cls, conditions, orderby, limit, fields, relations)
	else:
		return _query(cls, conditions, orderby, limit, fields)

