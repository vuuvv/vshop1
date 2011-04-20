from django.db import models
from django.db.models.base import ModelBase
from django.contrib.auth.models import User

class BaseMetaClass(ModelBase):
	def __new__(cls, name, bases, attrs):
		klass = super(BaseMetaClass, cls).__new__(cls, name, bases, attrs)
		klass._meta.permissions.append(('view_' + klass._meta.module_name, u'Can view %s' % klass._meta.verbose_name))
		return klass

class BaseModel(models.Model):
	__metaclass__ = BaseMetaClass

	class Meta:
		abstract = True

class Menu(BaseModel):
	label = models.CharField(max_length=128)
	tooltip = models.CharField(max_length=128)
	icon = models.CharField(max_length=128)
	command = models.CharField(max_length=128)
	parent = models.ForeignKey('self', null=True, blank=True, related_name="children")

class UserProfile(models.Model):
	user = models.ForeignKey(User, unique=True)

	parent = models.ForeignKey(User, null=True, blank=True, related_name="children")
