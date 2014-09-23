# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Forms and validation code for user registration and updating.

"""

from django import forms

from django.contrib.auth import get_user_model
from django.contrib.sites.models import get_current_site
from django.utils.translation import ugettext_lazy as _

from registration.models import RegistrationProfile


class RegisterForm(forms.Form):
    email = forms.EmailField(
        label='',
        widget=forms.TextInput(
            attrs={'placeholder': 'email address',
                   'max_length': 254}
        ),
    )
    first_name = forms.CharField(
        label='',
        widget=forms.TextInput(
            attrs={'placeholder': 'first name',
                   'max_length': 30}
        ),
    )
    last_name = forms.CharField(
        label='',
        widget=forms.TextInput(
            attrs={'placeholder': 'last name',
                   'max_length': 30}
        ),
    )
    password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'password'},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'repeat password'},
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