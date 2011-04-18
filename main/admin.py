from django.http import HttpResponseRedirect, HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from decorators import login_required
from utils import ajax_response

@login_required
def appdata(request):
	return ajax_response(request, "success", "", {})

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

