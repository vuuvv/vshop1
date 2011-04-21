try:
	from functools import wraps
except ImportError:
	from django.utils.functional import wraps  # Python 2.4 fallback.
from django.utils.decorators import available_attrs
from django.core.exceptions import PermissionDenied
from utils import ajax_response, full_permission_name
from main.models import Menu
from django.db import models
import json

def user_passes_test(test_func):
	"""
	Decorator for views that checks that the user passes the given test,
	redirecting to the log-in page if necessary. The test should be a callable
	that takes the user object and returns True if the user passes.
	"""

	def decorator(view_func):
		@wraps(view_func, assigned=available_attrs(view_func))
		def _wrapped_view(request, *args, **kwargs):
			if test_func(request.user):
				return view_func(request, *args, **kwargs)
			return ajax_response(request, "error", "unauthorized")
		return _wrapped_view
	return decorator


def login_required(function=None):
	"""
	Decorator for views that checks that the user is logged in, redirecting
	to the log-in page if necessary.
	"""
	actual_decorator = user_passes_test(
			lambda u: u.is_authenticated()
			)
	if function:
		return actual_decorator(function)
	return actual_decorator

def permission_required(perm):
	"""
	Decorator for views that checks whether a user has a particular permission
	enabled, redirecting to the log-in page if necessary.
	"""
	return user_passes_test(lambda u: u.has_perm(perm))

class ModelQuery(object):
	def __init__(self, permission=None):
		self.permission = permission

	def __call__(self, func):
		def _func(request, *args):
			obj = {}
			data = request.POST.get("data", None)
			data = json.loads(data) if data else []
			for k, v in data.items():
				name = v.get("name", k)
				try:
					cls = globals()[name]
					if issubclass(cls, models.Model):
						if not self.permission or request.user.has_perm(full_permission_name(self.permission, cls)):
							obj[k] = func(cls, v, *args)
						else:
							raise PermissionDenied("You have not enough permission to do this operate") 
				except KeyError:
					pass
				except PermissionDenied, e:
					return ajax_response(request, "error", e.message)
			return ajax_response(request, value=obj)

		return _func

def model_query(permission=None):
	return ModelQuery(permission)


