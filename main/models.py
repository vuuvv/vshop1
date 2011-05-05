from django.db import models
from django.db.models.base import ModelBase
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from datetime import datetime

class BaseMetaClass(ModelBase):
	def __new__(cls, name, bases, attrs):
		klass = super(BaseMetaClass, cls).__new__(cls, name, bases, attrs)
		klass._meta.permissions.append(('view_' + klass._meta.module_name, u'Can view %s' % klass._meta.verbose_name))
		return klass

class BaseModel(models.Model):
	__metaclass__ = BaseMetaClass

	class Meta:
		abstract = True

class Menu(models.Model):
	label = models.CharField(max_length=128)
	tooltip = models.CharField(max_length=128)
	icon = models.CharField(max_length=128)
	command = models.CharField(max_length=128)
	parent = models.ForeignKey('self', null=True, blank=True, related_name="children")

class UserProfile(models.Model):
	user = models.ForeignKey(User, unique=True)

	parent = models.ForeignKey(User, null=True, blank=True, related_name="children")

class Nav(models.Model):
	name = models.CharField(max_length=128)
	order = models.IntegerField(default=0)
	url = models.CharField(max_length=255)
	opennew = models.BooleanField(default=False)
	show = models.BooleanField(default=True)
	position = models.CharField(max_length=128, default="middle")

class Category(models.Model):
	name = models.CharField(max_length=128)
	desc = models.CharField(max_length=255, null=True, blank=True)
	order = models.IntegerField(default=0)
	unit = models.CharField(max_length=128, null=True, blank=True)
	show = models.BooleanField(default=True)
	grade = models.IntegerField(null=True, blank=True)
	parent = models.ForeignKey('self', null=True, blank=True, related_name="children")

class Brand(models.Model):
	name = models.CharField(max_length=128)
	logo = models.CharField(max_length=255, null=True, blank=True)
	desc = models.CharField(max_length=255, null=True, blank=True)
	url = models.CharField(max_length=255, null=True, blank=True)
	order = models.IntegerField(default=0)
	show = models.BooleanField(default=True)

class Supplier(models.Model):
	name = models.CharField(max_length=128)
	desc = models.CharField(max_length=255)
	check = models.BooleanField()

class GoodsManager(models.Manager):
	pass

class Goods(models.Model):
	sn = models.CharField(max_length=128)
	name = models.CharField(max_length=128)
	name_style = models.CharField(max_length=128, default="+")
	click_count = models.IntegerField(default=0)
	provider = models.CharField(max_length=128, null=True, blank=True)
	count = models.IntegerField(default=0)
	warn_count = models.IntegerField(default=1)
	weight = models.FloatField(default=1.0)
	market_price = models.FloatField()
	shop_price = models.FloatField()
	promote_price = models.FloatField(default=0.00)
	keywords = models.CharField(max_length=255, null=True, blank=True)
	brief = models.CharField(max_length=255, null=True, blank=True)
	desc = models.CharField(max_length=255, null=True, blank=True)
	thumb = models.CharField(max_length=255, null=True, blank=True)
	image = models.CharField(max_length=255, null=True, blank=True)
	original_image = models.CharField(max_length=255, null=True, blank=True)
	real = models.BooleanField(default=True)
	on_sale = models.BooleanField(default=True)
	alone_sale = models.BooleanField(default=True)
	shipping = models.BooleanField(default=True)
	order = models.IntegerField(default=0)
	add_time = models.DateTimeField(default=datetime.now)
	lastest_update = models.DateTimeField(default=datetime.now)
	is_new = models.BooleanField(default=False)
	is_best = models.BooleanField(default=False)
	is_hot = models.BooleanField(default=False)
	properties = models.TextField(default="")

	category = models.ForeignKey(Category, null=True, blank=True, related_name="goods")
	brand = models.ForeignKey(Brand, null=True, blank=True, related_name="goods")
	supplier = models.ForeignKey(Supplier, null=True, blank=True, related_name="goods")

	objects = GoodsManager()

class Product(models.Model):
	sn = models.CharField(max_length=128)
	price = models.FloatField(default=0.0)
	cost = models.FloatField(default=0.0)
	weight = models.FloatField(default=0.0)
	count = models.IntegerField(default=0)
	name = models.CharField(max_length=255)
	disabled = models.BooleanField(default=False)
	add_time = models.DateTimeField(default=datetime.now)
	last_modified = models.DateTimeField(default=datetime.now)

	goods = models.ForeignKey(Goods, related_name="products")

class Gallery(models.Model):
	desc = models.CharField(max_length=128, null=True, blank=True)
	image = models.CharField(max_length=255)
	order = models.IntegerField(default=0)

	goods = models.ForeignKey(Goods, related_name="galleries")

class Specification(models.Model):
	name = models.CharField(max_length=128)
	desc = models.CharField(max_length=128, null=True, blank=True)
	order = models.IntegerField(default=0)

class SpecItem(models.Model):
	value = models.CharField(max_length=64)
	properties = models.TextField(default="")
	spec = models.ForeignKey(Specification, related_name="items")
	order = models.IntegerField(default=0)

class Cart(models.Model):
	price = models.FloatField()
	user = models.ForeignKey(User, null=True, blank=True, related_name="carts")
	session = models.ForeignKey(Session, null=True, blank=True, related_name="carts")
	goods = models.ForeignKey(Goods, null=True, blank=True, related_name="carts")


