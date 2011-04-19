from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from django.middleware.csrf import get_token
import json

def ajax_response(request, type="success", message="", value=None):
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

def get_fields_name(cls):
	from django.db.models.related import RelatedObject
	opt = cls._meta
	try:
		cache = opt._name_map
	except AttributeError:
		cache = opt.init_name_map()
	return [f for f, v in cache.items() if not isinstance(v[0], RelatedObject)]

def query(cls, conditions={}, orderby=[], limit=None, fields=[]):
	obj = cls.objects.filter(**conditions).order_by(*orderby).values(*fields)

	if limit:
		if (len(limit) == 1):
			return obj[limit[0]:]
		else:
			return obj[limit[0]:limit[1]]
	else:
		return obj

def full_permission_name(permission, cls):
	return "%s.%s_%s" % (cls._meta.app_label, permission, cls._meta.module_name)
