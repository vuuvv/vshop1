from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render_to_response
import forms
import logging

TEMPLATE = "taobao"

def index(request):
	return HttpResponse(request.user)

def login(request):
	from django.contrib.auth.views import login
	return login(request, TEMPLATE + "/login.html")

def register(request):
	form = forms.RegistrationForm()
	return render_to_response(TEMPLATE + "/register.html", {"form": form})

