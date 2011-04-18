from django.db import models

class Menu(models.Model):
	label = models.CharField(max_length=128)
	tooltip = models.CharField(max_length=128)
	icon = models.CharField(max_length=128)
	command = models.CharField(max_length=128)
	parent = models.ForeignKey('self', null=True, blank=True, related_name="children")

