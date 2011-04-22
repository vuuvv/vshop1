from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder, Serializer
from django.middleware.csrf import get_token
from django.conf import settings
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

def get_template(name):
	return settings.TEMPLATE_NAME + "/" + name

def get_fields_name(cls):
	from django.db.models.related import RelatedObject
	opt = cls._meta
	try:
		cache = opt._name_map
	except AttributeError:
		cache = opt.init_name_map()
	return [f for f, v in cache.items() if not isinstance(v[0], RelatedObject)]

def set_data_to_model(cls, data):
	from django.db.models.related import RelatedObject
	from django.db.models.fields.related import ForeignKey
	opt = cls._meta
	try:
		cache = opt._name_map
	except AttributeError:
		cache = opt.init_name_map()

	value = {}
	for k, v in data.items():
		if k in cache:
			field = cache[k][0]
			if isinstance(field, RelatedObject):
				continue
			if isinstance(field, ForeignKey):
				value[field.attname] = v
			else:
				value[k] = v
	return value

def query(cls, conditions={}, orderby=[], limit=None, fields=[]):
	fields_name = get_fields_name(cls)
	fields = [f for f in fields_name if f in fields] if fields else fields_name
	obj = cls.objects.filter(**conditions).order_by(*orderby).values(*fields)

	if limit:
		if (len(limit) == 1):
			return obj[limit[0]:]
		else:
			return obj[limit[0]:limit[1]]
	else:
		return obj

def related_query(cls, conditions={}, orderby=[], limit=None, fields=[], relations={}):
	fields_name = get_fields_name(cls)
	fields = [f for f in fields_name if f in fields] if fields else fields_name
	qs = cls.objects.filter(**conditions).order_by(*orderby)
	ret = []
	for item in qs:
		value = {}
		for f in fields:
			v = getattr(item, f)
			if f in relations:
				v = getattr(v, relations[f]) if v else None
			value[f] = v
		ret.append(value)
	return ret

def full_permission_name(permission, cls):
	return "%s.%s_%s" % (cls._meta.app_label, permission, cls._meta.module_name)
