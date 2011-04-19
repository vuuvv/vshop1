from django.http import HttpResponseRedirect, HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from decorators import login_required, model_query
from utils import ajax_response, get_fields_name, query as _query
from models import Menu

@login_required
def appdata(request):
	value = {
		"Menu": Menu.objects.all(),
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
def query(request, cls):
	obj = doquery(request, cls)
	return list(obj)

def doquery(request, cls, related=False):
	fields = request.POST.get("fields", None)
	conditions = request.POST.get("conditions", None)
	orderby = request.POST.get("orderby", None)
	limit = request.POST.get("limit", None)

	if fields:
		fields = json.loads(fields)
		if fields and "id" not in fields:
			fields.append("id")
	fields = fields if fields else get_fields_name(cls)
	conditions = json.loads(conditions) if conditions else {}
	orderby = json.loads(orderby) if orderby else []
	limit = json.loads(limit) if limit else None

	return _query(cls, conditions, orderby, limit, fields)
