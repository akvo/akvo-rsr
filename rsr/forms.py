"""
Forms and validation code for user registration and updating.

"""
from django import newforms as forms
from django import oldforms
from django.core import validators
from django.core.validators import alnum_re
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm, AuthenticationForm

from registration.models import RegistrationProfile

from akvo.rsr.models import RSR_RegistrationProfile, UserProfile, Organisation

# I put this on all required fields, because it's easier to pick up
# on them with CSS or JavaScript if they have a class of "required"
# in the HTML. Your mileage may vary. If/when Django ticket #3515
# lands in trunk, this will no longer be necessary.
attrs_dict = {'class': 'input c4',}

class RSR_TextField(oldforms.TextField):
    # hack to enable class attribute customization on some forms
    def render(self, data):
        if data is None:
            data = u''
        max_length = u''
        if self.max_length:
            max_length = u'maxlength="%s" ' % self.max_length
        return mark_safe(u'<input type="%s" id="%s" name="%s" size="%s" value="%s" class="input c4" %s/>' % \
            (self.input_type, self.get_id(), self.field_name, self.length, escape(data), max_length))

class RSR_PasswordField(RSR_TextField):
    input_type = "password"
    
class RSR_SigninTextField(oldforms.TextField):
    # hack to enable class attribute customization on some forms
    def render(self, data):
        if data is None:
            data = u''
        max_length = u''
        if self.max_length:
            max_length = u'maxlength="%s" ' % self.max_length
        return mark_safe(u'<input type="%s" id="%s" name="%s" size="%s" value="%s" class="signin_field input" %s/>' % \
            (self.input_type, self.get_id(), self.field_name, self.length, escape(data), max_length))

class RSR_SigninPasswordField(RSR_SigninTextField):
    input_type = "password"

class RSR_AuthenticationForm(AuthenticationForm):
    """
    Base class for authenticating users. Extend this to get a form that accepts
    username/password logins.
    """
    def __init__(self, request=None):
        """
        If request is passed in, the manipulator will validate that cookies are
        enabled. Note that the request (a HttpRequest object) must have set a
        cookie with the key TEST_COOKIE_NAME and value TEST_COOKIE_VALUE before
        running this validator.
        """
        self.request = request
        self.fields = [
            RSR_SigninTextField(field_name="username", length=15, max_length=30, is_required=True,
                validator_list=[self.isValidUser, self.hasCookiesEnabled]),
            RSR_SigninPasswordField(field_name="password", length=15, max_length=30, is_required=True),
        ]
        self.user_cache = None

class RSR_PasswordChangeForm(PasswordChangeForm):

    def __init__(self, user):
        self.user = user
        self.fields = (
            RSR_PasswordField(field_name="old_password", length=30, max_length=30, is_required=True,
                validator_list=[self.isValidOldPassword]),
            RSR_PasswordField(field_name="new_password1", length=30, max_length=30, is_required=True,
                validator_list=[validators.AlwaysMatchesOtherField('new_password2', _("The two 'new password' fields didn't match."))]),
            RSR_PasswordField(field_name="new_password2", length=30, max_length=30, is_required=True),
        )

class OrganisationForm(forms.Form):
    organisation = forms.ModelChoiceField(queryset=Organisation.objects.all(), widget=forms.Select(attrs={ 'style': 'margin: 10px 50px; display: block' }))

class ProfileFormBase(forms.Form):
    first_name  = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))
    last_name   = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))
    #initial form data must set the organisation e.g. initial={'org_id': org_id)}

    def save(self, profile_callback=None):
        """
        Create the new ``User`` and ``RegistrationProfile``, and
        returns the ``User``.
        
        This is essentially a light wrapper around
        ``RegistrationProfile.objects.create_inactive_user()``,
        feeding it the form data and a profile callback (see the
        documentation on ``create_inactive_user()`` for details) if
        supplied.
        
        """
        new_user = RegistrationProfile.objects.create_inactive_user(username=self.cleaned_data['username'],
                                                                    password=self.cleaned_data['password1'],
                                                                    email=self.cleaned_data['email'],
                                                                    profile_callback=profile_callback)
        return new_user


class RegistrationForm(ProfileFormBase):
    """
    Form for registering a new user account.
    
    Validates that the requested username is not already in use, and
    requires the password to be entered twice to catch typos.
    
    Subclasses should feel free to add any additional validation they
    need, but should either preserve the base ``save()`` or implement
    a ``save()`` which accepts the ``profile_callback`` keyword
    argument and passes it through to
    ``RegistrationProfile.objects.create_inactive_user()``.
    
    """
    org_id = forms.IntegerField(widget=forms.HiddenInput)    
    username = forms.CharField(max_length=30,
                               widget=forms.TextInput(attrs=attrs_dict),
                               label=_(u'username'))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs=attrs_dict, render_value=False),
                                label=_(u'password'))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs=attrs_dict, render_value=False),
                                label=_(u'password (again)'))
    email1 = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               maxlength=75)),
                             label=_(u'email address'))
    email2 = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               maxlength=75)),
                             label=_(u'email address (again)'))
    
    def clean(self):
        """
        Verifiy that the values entered into the two password fields
        match. Note that an error here will end up in
        ``non_field_errors()`` because it doesn't apply to a single
        field.
        
        """
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError(_(u'You must type the same password each time'))
        if 'email1' in self.cleaned_data and 'email2' in self.cleaned_data:
            if self.cleaned_data['email1'] != self.cleaned_data['email2']:
                raise forms.ValidationError(_(u'You must type the same email address each time'))        
        return self.cleaned_data

    def clean_username(self):
        """
        Validate that the username is alphanumeric and is not already
        in use.
        
        """
        if not alnum_re.search(self.cleaned_data['username']):
            raise forms.ValidationError(_(u'Usernames can only contain letters, numbers and underscores'))
        try:
            user = User.objects.get(username__iexact=self.cleaned_data['username'])
        except User.DoesNotExist:
            return self.cleaned_data['username']
        raise forms.ValidationError(_(u'This username is already taken. Please choose another.'))

    

class RegistrationFormTermsOfService(RegistrationForm):
    """
    Subclass of ``RegistrationForm`` which adds a required checkbox
    for agreeing to a site's Terms of Service.
    
    """
    tos = forms.BooleanField(widget=forms.CheckboxInput(attrs=attrs_dict),
                             label=_(u'I have read and agree to the Terms of Service'))
    
    def clean_tos(self):
        """
        Validate that the user accepted the Terms of Service.
        
        """
        if self.cleaned_data.get('tos', False):
            return self.cleaned_data['tos']
        raise forms.ValidationError(_(u'You must agree to the terms to register'))


class RegistrationFormUniqueEmail(RegistrationForm):
    """
    Subclass of ``RegistrationForm`` which enforces uniqueness of
    email addresses.
    
    """
    def clean_email1(self):
        """
        Verifiy that the values entered into the two email fields
        match. Note that an error here will end up in
        ``non_field_errors()`` because it doesn't apply to a single
        field.
        Validate that the supplied email address is unique for the
        site.
        
        """
        try:
            user = User.objects.get(email__iexact=self.cleaned_data['email1'])
        except User.DoesNotExist:
            return self.cleaned_data['email1']
        raise forms.ValidationError(_(u'This email address is already in use. Please supply a different email address.'))


class RegistrationFormNoFreeEmail(RegistrationForm):
    """
    Subclass of ``RegistrationForm`` which disallows registration with
    email addresses from popular free webmail services; moderately
    useful for preventing automated spam registrations.
    
    To change the list of banned domains, subclass this form and
    override the attribute ``bad_domains``.
    
    """
    bad_domains = ['aim.com', 'aol.com', 'email.com', 'gmail.com',
                   'googlemail.com', 'hotmail.com', 'hushmail.com',
                   'msn.com', 'mail.ru', 'mailinator.com', 'live.com']
    
    def clean_email(self):
        """
        Check the supplied email address against a list of known free
        webmail domains.
        
        """
        email_domain = self.cleaned_data['email'].split('@')[1]
        if email_domain in self.bad_domains:
            raise forms.ValidationError(_(u'Registration using free email addresses is prohibited. Please supply a different email address.'))
        return self.cleaned_data['email']


class RSR_RegistrationForm(RegistrationFormUniqueEmail):
    
    def save(self, profile_callback=None):
        """
        Create the new ``User`` and ``RegistrationProfile``, and
        returns the ``User``.
        
        This is essentially a light wrapper around
        ``RegistrationProfile.objects.create_inactive_user()``,
        feeding it the form data and a profile callback (see the
        documentation on ``create_inactive_user()`` for details) if
        supplied.
        
        """
        new_user =  RSR_RegistrationProfile.objects.create_inactive_user(
                        username=self.cleaned_data['username'],
                        password=self.cleaned_data['password1'],
                        email=self.cleaned_data['email1'],
                        first_name=self.cleaned_data['first_name'],
                        last_name=self.cleaned_data['last_name'],
                        profile_callback=profile_callback,
                        profile_data={'org_id':self.cleaned_data['org_id']}
                    )
        return new_user

class RSR_ProfileUpdateForm(ProfileFormBase):

    #phone_number   = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))
    #organisation   = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))

    def update(self, user):
        updated_user =  RSR_RegistrationProfile.objects.update_active_user(
                        user,
                        first_name      =self.cleaned_data['first_name'],
                        last_name       =self.cleaned_data['last_name'],
                    )
        return updated_user        
