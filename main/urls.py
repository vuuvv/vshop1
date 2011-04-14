from django.conf.urls.defaults import patterns, include, url
import views

urlpatterns = patterns('',
	url(r'^$', views.index),
	url(r'^login$', views.login),
	url(r'^register$', views.register),
	url(r'^captcha/', include('captcha.urls')),
	url(r'^uc/', include('registration.backends.default.urls')),
)

