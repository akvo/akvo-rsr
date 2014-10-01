# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Forms and validation code for user registration and updating.

"""

from django import forms

from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.sites.models import get_current_site
from django.utils.translation import ugettext_lazy as _

from registration.models import RegistrationProfile

from .models import Organisation

class RegisterForm(forms.Form):
    email = forms.EmailField(
        label='',
        max_length=254,
        widget=forms.TextInput(
            attrs={'placeholder': 'Email'}
        ),
    )
    first_name = forms.CharField(
        label='',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'First name'}
        ),
    )
    last_name = forms.CharField(
        label='',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'Last name'}
        ),
    )
    password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Password'},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Repeat password'},
            render_value=False
        )
    )

    def clean(self):
        """
        Verify that the values entered into the two password fields match. Note that an error here will end up in
        non_field_errors() because it doesn't apply to a single field.
        """
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError(
                    _(u'Passwords do not match. Please enter the same password in both fields.')
                )
        return self.cleaned_data

    def clean_email(self):
        """
        Verify that the email entered does not exist as an email or username.
        """
        email = self.cleaned_data['email']
        if get_user_model().objects.filter(email=email).exists() \
                or get_user_model().objects.filter(username=email).exists():
            raise forms.ValidationError(_(u'A user with this email address already exists.'))
        return email

    def save(self, request):
        """
        Create the new User and RegistrationProfile, and returns the User.

        This is essentially a light wrapper around RegistrationProfile.objects.create_inactive_user(), feeding it the
        form data and a profile callback (see the documentation on create_inactive_user() for details) if supplied.
        Modified to set user.is_active = False and add User object creation.
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
                'placeholder': 'Email',
                'readonly': True}
        ),
    )
    first_name = forms.CharField(
        label='',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'First name'}
        ),
    )
    last_name = forms.CharField(
        label='',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'Last name'}
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
            attrs={'placeholder': 'Current password'},
            render_value=False
        )
    )
    new_password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'New password'},
            render_value=False
        )
    )
    new_password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Repeat new password'},
            render_value=False
        )
    )


class UserOrganisationForm(forms.Form):
    organisation = forms.ModelChoiceField(
        queryset=Organisation.objects.all(),
        label='',
        initial='Organisation'
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
        # TODO: The approval process of users
        request.user.organisations.add(self.cleaned_data['organisation'])
