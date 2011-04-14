from django import forms
from django.utils.translation import ugettext_lazy as _
from captcha.fields import CaptchaField, CaptchaTextInput

class RegistrationForm(forms.Form):
	username = forms.RegexField(regex=r'^\w+$',
		min_length=5,
		max_length=30,
		widget=forms.TextInput(attrs={"class": "field-text"}),
		label=_("Username:"),
		error_message={'invalid': _("This value must contain only letters, numbers and underscores.")}
	)

	password = forms.CharField(widget=forms.PasswordInput(attrs={"class": "field-text"}), label=_("Password:"))
	repassword = forms.CharField(widget=forms.PasswordInput(attrs={"class": "field-text"}), label=_("RePassword:"))
	email = forms.EmailField(widget=forms.TextInput(attrs={"class": "field-text"}), label=_("Email:"))
	captcha = CaptchaField(widget_kwargs={"attrs": {"class": "field-captcha"}}, label=_("Captcha:"))

