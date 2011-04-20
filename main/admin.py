from django.http import HttpResponseRedirect, HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from decorators import login_required, model_query
from utils import ajax_response, get_fields_name, query as _query
from models import Menu

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
def query(request, cls):
	obj = doquery(request, cls)
	return list(obj)

@model_query("view")
def count(request, cls):
	obj = doquery(request, cls)
	return obj.count()

@model_query("add")
def save(request, cls):
	ret = {"create": False, "id": None}
	post = request.POST
	fields = dict([(a.attname, post.get(a.attname)) for a in cls._meta.fields if a.attname in post])
	id = int(fields["id"])
	if id == -1:
		ret["create"] = True
		fields.pop("id")
	model = cls(**fields)
	model.save()
	ret["id"] = model.id
	return ret

@model_query("delete")
def delete(request, cls):
	conditions = request.POST.get("conditions", [])
	kwargs = {}
	if conditions:
		conditions = json.loads(conditions)
	conditions = dict(json.loads(conditions) if conditions else [])
	obj = cls.objects.filter(**kwargs)
	obj.delete()
	return "deleted"

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
	conditions = dict(json.loads(conditions) if conditions else [])
	orderby = json.loads(orderby) if orderby else []
	limit = json.loads(limit) if limit else None

	return _query(cls, conditions, orderby, limit, fields)
