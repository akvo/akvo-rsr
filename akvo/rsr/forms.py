# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Forms and validation code for user registration and updating.

"""
#import re
from urlparse import urlsplit, urlunsplit

from django import forms
#TODO fix for django 1.0
#from django import oldforms
#from django.core import validators
#from django.core.validators import alnum_re
#from django.conf import settings
#from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm, AuthenticationForm, PasswordResetForm, SetPasswordForm
from django.contrib.sites.models import get_current_site
from django.db.models import get_model
from django.template.defaultfilters import slugify
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from registration.forms import RegistrationFormUniqueEmail
from registration.models import RegistrationProfile

from mollie.ideal.utils import get_mollie_banklist
from akvo import settings

from akvo.rsr.models import UserProfile, Organisation, Project, PartnerSite

# I put this on all required fields, because it's easier to pick up
# on them with CSS or JavaScript if they have a class of "required"
# in the HTML. Your mileage may vary. If/when Django ticket #3515
# lands in trunk, this will no longer be necessary.
attrs_dict = {'class': 'input c4', }


# TODO fix for django 1.0
class RSR_TextField():  # oldforms.TextField):
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


# TODO fix for django 1.0
class RSR_SigninTextField():  # oldforms.TextField):
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


#class OrganisationForm(forms.Form):
class RegistrationForm1(forms.Form):
    organisation = forms.ModelChoiceField(queryset=Organisation.objects.all(), widget=forms.Select(attrs={'style': 'margin: 10px 50px; display: block'}))

# class OrganisationForm(forms.Form):
#class OrganisationForm(forms.ModelForm):
    #iati_id = forms.CharField(max_length=75, min_length=3)

 #   class Meta:
 #       model = Organisation

    #def clean_iati_id(self):
        #iati_id = self.data['iati_id']
    #    return self.cleaned_data
    #   iati_id = self.cleaned_data.get('iati_id')


    #def clean_iati_id(self):
    #   iati_id = self.cleaned_data.get('iati_id')
        #import re
        #pattern = r'[^\.a-z0-9]'
        #if re.search(pattern, iati_id):
        #    raise forms.ValidationError(_(u'Invalid IATI ID'))
    #    return self.cleaned_data

    #organisation = forms.ModelChoiceField(queryset=Organisation.objects.all(), widget=forms.Select(attrs={ 'style': 'margin: 10px 50px; display: block' }))

    # def clean(self):
    #     print "Cleaning"
    #     iati_id = self.cleaned_data.get('iati_id')
    #     import re
    #     pattern = r'[^\.a-z0-9]'
    #     if re.search(pattern, iati_id):
    #         raise forms.ValidationError(_(u'Invalid IATI ID'))
    #     return self.cleaned_data


class RSR_RegistrationFormUniqueEmail(RegistrationFormUniqueEmail):

    org_id = forms.IntegerField(widget=forms.HiddenInput)
    username = forms.RegexField(
        regex=r'^\w+$',
        max_length=30,
        widget=forms.TextInput(attrs=attrs_dict),
        label=_(u'username')
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs=attrs_dict, render_value=False),
        label=_(u'password')
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs=attrs_dict, render_value=False),
        label=_(u'password (again)')
    )
    first_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs=attrs_dict)
    )
    last_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs=attrs_dict)
    )
    email = forms.EmailField(
        widget=forms.TextInput(attrs=dict(attrs_dict, maxlength=75)),
        label=_(u'email address')
    )
    email2 = forms.EmailField(
        widget=forms.TextInput(attrs=dict(attrs_dict, maxlength=75)),
        label=_(u'email address (again)')
    )

    def clean(self):
        """
        Verifiy that the values entered into the two password fields
        match. Note that an error here will end up in
        ``non_field_errors()`` because it doesn't apply to a single
        field.
        Modified to do the same for the email fields

        """
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError(_(u'Passwords do not match. Please enter the same password in both fields.'))
        if 'email' in self.cleaned_data and 'email2' in self.cleaned_data:
            if self.cleaned_data['email'] != self.cleaned_data['email2']:
                raise forms.ValidationError(_(u'Email addresses do not match. Please enter the email address in both fields.'))
        return self.cleaned_data

    def save(self, request):
        """
        Create the new ``User`` and ``RegistrationProfile``, and
        returns the ``User``.

        This is essentially a light wrapper around
        ``RegistrationProfile.objects.create_inactive_user()``,
        feeding it the form data and a profile callback (see the
        documentation on ``create_inactive_user()`` for details) if
        supplied.
        Modified to set user.is_active = False and add UserProfile object creation,
        recording the org_id associated with the user

        """
        site = get_current_site(request)
        new_user = RegistrationProfile.objects.create_inactive_user(
            username=self.cleaned_data['username'],
            password=self.cleaned_data['password1'],
            email=self.cleaned_data['email'],
            site=site,
        )
        new_user.first_name = self.cleaned_data['first_name']
        new_user.last_name = self.cleaned_data['last_name']
        new_user.is_active = False
        new_user.save()
        UserProfile.objects.create(user=new_user, organisation=Organisation.objects.get(pk=self.cleaned_data['org_id']))
        return new_user


class RSR_ProfileUpdateForm(forms.Form):
    first_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))
    last_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))
    #phone_number   = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))
    #organisation   = forms.CharField(max_length=30, widget=forms.TextInput(attrs=attrs_dict))

    def update(self, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user


class RSR_SetPasswordForm(SetPasswordForm):
    new_password1 = forms.CharField(label=_("New password"), widget=forms.PasswordInput(attrs={'class': 'input'}))
    new_password2 = forms.CharField(label=_("New password confirmation"), widget=forms.PasswordInput(attrs={'class': 'input'}))


class RSR_PasswordResetForm(PasswordResetForm):
    email = forms.EmailField(label=_("E-mail"), max_length=75, widget=forms.TextInput(attrs={'class': 'input'}))
#        self.fields['email'].widget.attrs = {'class': 'input'}


class InvoiceForm(forms.ModelForm):
    def __init__(self, project, engine, *args, **kwargs):
        super(InvoiceForm, self).__init__(*args, **kwargs)
        self.project = project
        self.engine = engine
        self.fields['email2'] = forms.EmailField()
        if engine == 'ideal':
            self.fields['bank'] = forms.CharField(max_length=4,
                widget=forms.Select(choices=get_mollie_banklist()))

    """HACK:

    Ideally the name and email fields in the Invoice model
    should be required. They are not because of the original (legacy)
    design of the Invoice model.

    The fields below *override* the model to ensure data consistency.

    """
    amount = forms.IntegerField(min_value=2)
    name = forms.CharField()
    email = forms.EmailField()
    email2 = forms.EmailField()
    is_public = forms.BooleanField(required=False)

    class Meta:
        model = get_model('rsr', 'invoice')
        fields = ('amount', 'name', 'email', 'email2',
                  'campaign_code', 'is_public')

    def over_donated(self):
        donation = self.cleaned_data.get('amount', 0)
        if self.engine == 'paypal':
            if self.project.amount_needed_to_fully_fund_via_paypal() < donation:
                return True
        else:
            if self.project.amount_needed_to_fully_fund_via_ideal() < donation:
                return True
        return False

    def clean(self):
        if self.over_donated():
            raise forms.ValidationError(_('You cannot donate more than the project actually needs!'))
        cd = self.cleaned_data
        if 'email' in cd and 'email2' in cd:
            if cd['email'] != cd['email2']:
                raise forms.ValidationError(_('You must type the same email address each time!'))
        return cd


# based on http://www.djangosnippets.org/snippets/1008/
# a form field that only displays the __unicode__ of the foreign key field and
# hides the pk in a hidden input
class ReadonlyFKWidget(forms.HiddenInput):
    def __init__(self, admin_site, original_object):
        self.admin_site = admin_site
        self.original_object = original_object
        super(ReadonlyFKWidget, self).__init__()

    def render(self, name, value, attrs=None):
        if self.original_object is not None:
            return super(ReadonlyFKWidget, self).render(
                name, value, attrs) + mark_safe('<span>%s</span>' % (escape(unicode(self.original_object)),))
        else:
            return "None"


class ReadonlyFKAdminField(object):
    def get_form(self, request, obj=None, **kwargs):
        form = super(ReadonlyFKAdminField, self).get_form(request, obj, **kwargs)
        if hasattr(self, 'readonly_fk'):
            for field_name in self.readonly_fk:
                if field_name in form.base_fields:
                    form.base_fields[field_name].widget = ReadonlyFKWidget(self.admin_site, getattr(obj, field_name, ''))
        return form


class ProjectUpdateForm(forms.ModelForm):
    """Form representing a ProjectUpdate."""

    title = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '42',
        'maxlength': '50',
        'style': 'margin-left:0',
        }))
    text = forms.CharField(required=False, widget=forms.Textarea(attrs={
        'class': 'textarea',
        'cols': '44',
        }))
    language = forms.ChoiceField(choices=settings.LANGUAGES, initial='en', widget=forms.Select(attrs={'style': 'height: 2em',}))
    photo = forms.ImageField(required=False, widget=forms.FileInput(attrs={
        'class': 'input',
        'size': '15',
        'style': 'height: 2em',
        }))
    photo_caption = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        }))
    photo_credit = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '25',
        }))
    video = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '42',
        'maxlength': '255',
        }))
    video_caption = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        }))
    video_credit = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '25',
        }))

    class Meta:
        model = get_model('rsr', 'projectupdate')
        fields = ('title', 'text', 'language', 'photo', 'photo_caption', 'photo_credit', 'video', 'video_caption',
        'video_credit')

    def clean_video(self):
        data = self.cleaned_data['video']
        if data:
            scheme, netloc, path, query, fragment = urlsplit(data)
            netloc = netloc.lower()
            valid_url = (netloc == 'blip.tv' or
                         netloc == 'vimeo.com' or
                         netloc == 'www.youtube.com' and path == '/watch' or
                         netloc == 'youtu.be')
            if not valid_url:
                raise forms.ValidationError(_('Invalid video URL. Currently '
                    'Blip.TV, Vimeo and YouTube are supported.'))
            if netloc == 'youtu.be':
                netloc = 'www.youtube.com'
                path = '/watch?v=%s' % path.lstrip('/')
                data = urlunsplit((scheme, netloc, path, query, fragment))
        return data

class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = Project
        widgets = {
            'keywords': forms.Textarea(attrs={'cols': 29, 'rows': 1}),
        }

class PartnerSiteAdminForm(forms.ModelForm):
    class Meta:
        model = PartnerSite
        widgets = {
            'keywords': forms.Textarea(attrs={'cols': 29, 'rows': 1}),
        }

    def clean_hostname(self):
        hostname = slugify(self.cleaned_data['hostname'])
        if hostname == 'www':  # TODO: test for other reserved hostnames
            raise forms.ValidationError(_('www is a reserved hostname. Please choose another hostname.'))
        return hostname
