from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from django.middleware.csrf import get_token
import json

def ajax_response(request, type, message, value=None):
	resp = {
		"user": {
			"id": request.user.id,
			"name": request.user.username
		},
		"type": type,
		"message": message,
		"value": value,
		"csrf": get_token(request),
	}
	return HttpResponse(json.dumps(resp, cls=DjangoJSONEncoder))

