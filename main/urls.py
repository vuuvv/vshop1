from django.conf.urls.defaults import patterns, include, url
import views
import admin

urlpatterns = patterns('',
	url(r'^$', views.index),
	url(r'^login$', views.login),
	url(r'^register$', views.register),
	url(r'^captcha/', include('captcha.urls')),
	url(r'^uc/', include('registration.backends.default.urls')),
	url(r'^manage/appdata', admin.appdata),
	url(r'^manage/login', admin.login),
	url(r'^manage/query/(\w+)', admin.query),
)

