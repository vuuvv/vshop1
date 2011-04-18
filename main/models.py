from django.db import models

<<<<<<< HEAD
class Menu(models.Model):
	label = models.CharField(max_length=128)
	tooltip = models.CharField(max_length=128)
	icon = models.CharField(max_length=128)
	command = models.CharField(max_length=128)
	parent = models.ForeignKey('self', null=True, blank=True, related_name="children")

=======
class Test(models.Model):
	name = models.CharField(max_length=255)
>>>>>>> 60d7f183d0f6d2952005fbe0c1a421a6a5964244
