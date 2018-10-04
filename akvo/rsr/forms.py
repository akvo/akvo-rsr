# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Forms and validation code for user registration and updating.

"""

import datetime
import re

from django import forms

from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.sites.models import get_current_site
from django.utils.translation import ugettext_lazy as _
from django.utils.safestring import mark_safe

from registration.models import RegistrationProfile

from urlparse import urlsplit, urlunsplit

from .models import Country
from .models import Organisation
from .models import ProjectUpdate
from .models import ProjectUpdateLocation

from akvo import settings

PASSWORD_MINIMUM_LENGTH = settings.PASSWORD_MINIMUM_LENGTH


class RegisterForm(forms.Form):
    email = forms.EmailField(
        label=_(u'Email'),
        max_length=254,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'Email')}
        ),
    )
    first_name = forms.CharField(
        label=_(u'First name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'First name')}
        ),
    )
    last_name = forms.CharField(
        label=_(u'Last name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'Last name')}
        ),
    )
    password1 = forms.CharField(
        label=_(u'Password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'Password')},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label=_(u'Repeat password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'Repeat password')},
            render_value=False
        )
    )

    def clean(self):
        """
        Verify that the values entered into the two password fields match.
        Note that an error here will end up in non_field_errors() because it doesn't
        apply to a single field.
        """

        def check_passwords_identical(form):
            if 'password1' in form.cleaned_data and 'password2' in form.cleaned_data:
                if form.cleaned_data['password1'] != form.cleaned_data['password2']:
                    raise forms.ValidationError(
                        _(u'Passwords do not match. Please enter the same password in both fields.')
                    )

        def check_password_minimum_length(password):
            if len(password) < PASSWORD_MINIMUM_LENGTH:
                raise forms.ValidationError(
                    _(u'Passwords must be at least {} characters long.'.format(
                        PASSWORD_MINIMUM_LENGTH))
                )

        def check_password_has_number(password):
            if not re.findall('\d', password):
                raise forms.ValidationError(
                    _(u'The password must contain at least one digit, 0-9.')
                )

        def check_password_has_upper(password):
            if not re.findall('[A-Z]', password):
                raise forms.ValidationError(
                    _(u'The password must contain at least one uppercase letter, A-Z.')
                )

        def check_password_has_lower(password):
            if not re.findall('[a-z]', password):
                raise forms.ValidationError(
                    _(u'The password must contain at least one lowercase letter, a-z.')
                )

        def check_password_has_symbol(password):
            if not re.findall('[()[\]{}|\\`~!@#$%^&*_\-+=;:\'",<>./?]', password):
                raise forms.ValidationError(
                    _(u'The password must contain at least one symbol: '
                      u'()[]{}|\`~!@#$%^&*_-+=;:\'",<>./?')
                )

        check_passwords_identical(self)

        password = self.cleaned_data['password1']
        check_password_minimum_length(password)
        check_password_has_number(password)
        check_password_has_upper(password)
        check_password_has_lower(password)
        check_password_has_symbol(password)

        return self.cleaned_data

    def clean_email(self):
        """
        Verify that the email entered does not exist as an email or username.
        """
        email = self.cleaned_data['email']
        if get_user_model().objects.filter(email__iexact=email).exists() \
                or get_user_model().objects.filter(username__iexact=email).exists():
            raise forms.ValidationError(_(u'A user with this email address already exists.'))
        return email

    def save(self, request):
        """
        Create the new User and RegistrationProfile, and returns the User.

        This is essentially a light wrapper around
        RegistrationProfile.objects.create_inactive_user(), feeding it the form data and
        a profile callback (see the documentation on create_inactive_user() for details)
        if supplied. Modified to set user.is_active = False and add User object creation.
        """
        site = get_current_site(request)
        new_user = RegistrationProfile.objects.create_inactive_user(
            username=self.cleaned_data['email'],
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password1'],
            site=site,
        )
        new_user.first_name = self.cleaned_data['first_name']
        new_user.last_name = self.cleaned_data['last_name']
        new_user.is_active = False
        new_user.save()
        return new_user


class ProfileForm(forms.Form):
    email = forms.EmailField(
        label='',
        max_length=254,
        widget=forms.TextInput(
            attrs={
                'placeholder': _(u'Email'),
                'readonly': True}
        ),
    )
    first_name = forms.CharField(
        label='',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'First name')}
        ),
    )
    last_name = forms.CharField(
        label='',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'Last name')}
        ),
    )

    def save(self, request):
        """
        Update the User profile.
        """
        user = request.user
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()


class PasswordForm(PasswordChangeForm):
    """
    Custom password form to remove the labels of the form fields.
    """
    old_password = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'Current password')},
            render_value=False
        )
    )
    new_password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'New password')},
            render_value=False
        )
    )
    new_password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'Repeat new password')},
            render_value=False
        )
    )


class InvitedUserForm(forms.Form):
    first_name = forms.CharField(
        label=_(u'First name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'First name')}
        ),
    )
    last_name = forms.CharField(
        label=_(u'Last name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'Last name')}
        ),
    )
    password1 = forms.CharField(
        label=_(u'Password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'Password')},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label=_(u'Repeat password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _(u'Repeat password')},
            render_value=False
        )
    )

    def __init__(self, user, *args, **kwargs):
        """Add the user to the form."""
        super(InvitedUserForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        """
        Verify that the values entered into the two password fields match.
        Note that an error here will end up in non_field_errors() because it doesn't
        apply to a single field.
        """
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError(
                    _(u'Passwords do not match. Please enter the same password in both fields.')
                )
        return self.cleaned_data

    def save(self, request):
        """
        Set the user to active and update the user's credentials.
        """
        self.user.is_active = True
        self.user.first_name = self.cleaned_data['first_name']
        self.user.last_name = self.cleaned_data['last_name']
        self.user.set_password(self.cleaned_data['password1'])
        self.user.save()


class UserOrganisationForm(forms.Form):
    organisation = forms.ModelChoiceField(
        queryset=Organisation.objects.all(),
        label='',
        empty_label=_(u'Organisation')
    )
    job_title = forms.CharField(
        label='',
        required=False,
        max_length=50,
        widget=forms.TextInput(
            attrs={'placeholder': _(u'Job title (optional)')}
        ),
    )
    country = forms.ModelChoiceField(
        queryset=Country.objects.all(),
        label='',
        required=False,
        empty_label=_(u'Country (optional)')
    )

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(UserOrganisationForm, self).__init__(*args, **kwargs)

    def clean(self):
        """
        Check that there is no link between user and organisation yet.
        """
        user = self.request.user
        if 'organisation' in self.cleaned_data:
            if self.cleaned_data['organisation'] in user.organisations.all():
                raise forms.ValidationError(
                    _(u'User already linked to organisation.')
                )
        return self.cleaned_data

    def save(self, request):
        """
        Link user to organisation.
        """
        request.user.organisations.add(self.cleaned_data['organisation'])


class DateInput(forms.DateInput):
    """Override to change the input_type."""
    input_type = 'date'


class ProjectUpdateForm(forms.ModelForm):
    """Form representing a ProjectUpdate."""

    title = forms.CharField(label='', widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '42',
        'maxlength': '80',
        'placeholder': _(u'Title'),
    }))
    text = forms.CharField(label='', required=False, widget=forms.Textarea(attrs={
        'class': 'textarea',
        'placeholder': _(u'Description'),
    }))
    language = forms.ChoiceField(choices=settings.LANGUAGES, initial='en')
    event_date = forms.DateField(
        initial=datetime.datetime.now().date(),
        widget=DateInput(),
    )
    photo = forms.ImageField(required=False,
                             widget=forms.FileInput(attrs={
                                 'class': 'input',
                                 'size': '15',
                             }),
                             help_text=_(u'Please upload an image of 2 MB or less.'),
                             )
    photo_caption = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        'placeholder': _(u'Photo caption'),
    }))
    photo_credit = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        'placeholder': _(u'Photo credit'),
    }))
    video = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '42',
        'maxlength': '255',
        'placeholder': _(u'Video link'),
    }))
    video_caption = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        'placeholder': _(u'Video caption'),
    }))
    video_credit = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        'placeholder': _(u'Video credit'),
    }))
    latitude = forms.FloatField(initial=0, widget=forms.HiddenInput())
    longitude = forms.FloatField(initial=0, widget=forms.HiddenInput())

    class Meta:
        model = ProjectUpdate
        fields = ('title', 'text', 'language', 'event_date', 'photo',
                  'photo_caption', 'photo_credit', 'video', 'video_caption',
                  'video_credit')

    def clean_video(self):
        data = self.cleaned_data['video']
        if data:
            scheme, netloc, path, query, fragment = urlsplit(data)
            netloc = netloc.lower()
            valid_url = (netloc == 'vimeo.com' or
                         netloc == 'www.youtube.com' and path == '/watch' or
                         netloc == 'youtu.be')
            if not valid_url:
                raise forms.ValidationError(
                    _(u'Invalid video URL. Currently only YouTube and Vimeo are supported.')
                )
            if netloc == 'youtu.be':
                netloc = 'www.youtube.com'
                path = '/watch?v=%s' % path.lstrip('/')
                data = urlunsplit((scheme, netloc, path, query, fragment))
        return data

    def save(self, project=None, user=None):
        if project and user:
            # Save update
            update = super(ProjectUpdateForm, self).save(commit=False)
            update.project = project
            update.user = user
            update.update_method = 'W'
            update.save()

            # Save update location
            # Only when adding an update. When editing an update,
            # the initial location is maintained.
            if not update.primary_location:
                latitude_data = self.cleaned_data['latitude']
                longitude_data = self.cleaned_data['longitude']
                ProjectUpdateLocation.objects.create(
                    latitude=latitude_data,
                    longitude=longitude_data,
                    location_target=update,
                )

            return update
        else:
            raise forms.ValidationError(_(u'Project or user not found.'))


class UserAvatarForm(forms.ModelForm):
    """Form for updating the avatar of a user."""
    avatar = forms.ImageField(widget=forms.FileInput(attrs={
        'class': 'input',
        'size': '15',
    }))

    class Meta:
        model = get_user_model()
        fields = ('avatar',)


class SelectOrgForm(forms.Form):
    """Form for selecting an organisation."""

    def __init__(self, user, *args, **kwargs):
        super(SelectOrgForm, self).__init__(*args, **kwargs)

        if user.is_superuser or user.is_admin:
            organisations = Organisation.objects.all()
        else:
            organisations = user.employers.approved().organisations()

        self.fields['org'] = forms.ModelChoiceField(
            queryset=organisations,
            label='',
        )


class CustomLabelModelChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        if not obj.is_public:
            return mark_safe(u'<span class="noCheck">%s <i>(private project)</i></span>' %
                             obj.__unicode__())
        elif obj.is_published():
            return mark_safe(u'<span class="noCheck">%s</span>' % obj.__unicode__())
        else:
            return mark_safe(u'<span class="noCheck">%s <i>(not published)</i></span>' %
                             obj.__unicode__())
