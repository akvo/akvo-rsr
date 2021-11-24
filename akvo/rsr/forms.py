# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Forms and validation code for user registration and updating.

"""

import re

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import SetPasswordForm, PasswordResetForm as PRF
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import F, Q
from django.utils.translation import ugettext_lazy as _
from django.utils.safestring import mark_safe

from akvo import settings
from akvo.rsr.registration import send_activation_email

PASSWORD_MINIMUM_LENGTH = settings.PASSWORD_MINIMUM_LENGTH


def check_password_minimum_length(password):
    if len(password) < PASSWORD_MINIMUM_LENGTH:
        raise forms.ValidationError(
            _('Passwords must be at least {} characters long.'.format(
                PASSWORD_MINIMUM_LENGTH))
        )


def check_password_has_number(password):
    if not re.findall(r'\d', password):
        raise forms.ValidationError(
            _('The password must contain at least one digit, 0-9.')
        )


def check_password_has_upper(password):
    if not re.findall('[A-Z]', password):
        raise forms.ValidationError(
            _('The password must contain at least one uppercase letter, A-Z.')
        )


def check_password_has_lower(password):
    if not re.findall('[a-z]', password):
        raise forms.ValidationError(
            _('The password must contain at least one lowercase letter, a-z.')
        )


REQUIRED_SYMBOLS = '()[]{}|\\`~!@#$%%^&*_-+=;:\'",<>./?'


def check_password_has_symbol(password):
    if not any(char in REQUIRED_SYMBOLS for char in password):
        raise forms.ValidationError(
            _(f'The password must contain at least one symbol: {REQUIRED_SYMBOLS}')
        )


class PasswordValidationMixin():

    def clean(self):
        if self.errors:
            raise forms.ValidationError(
                self.errors[list(self.errors.keys())[0]]
            )

        if 'password1' in self.cleaned_data:
            password = self.cleaned_data['password1']
        elif 'new_password1' in self.cleaned_data:
            password = self.cleaned_data['new_password1']
        else:
            raise forms.ValidationError(
                _("Couldn't find the password fields in the form")
            )

        check_password_minimum_length(password)
        check_password_has_number(password)
        check_password_has_upper(password)
        check_password_has_lower(password)
        check_password_has_symbol(password)

        return self.cleaned_data


class RegisterForm(PasswordValidationMixin, forms.Form):
    email = forms.EmailField(
        label=_('Email'),
        max_length=254,
        widget=forms.TextInput(
            attrs={'placeholder': _('Email')}
        ),
    )
    first_name = forms.CharField(
        label=_('First name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _('First name')}
        ),
    )
    last_name = forms.CharField(
        label=_('Last name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _('Last name')}
        ),
    )
    password1 = forms.CharField(
        label=_('Password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _('Password')},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label=_('Repeat password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _('Repeat password')},
            render_value=False
        )
    )

    def clean_email(self):
        """
        Verify that the email entered does not exist as an email or username.
        """
        email = self.cleaned_data['email']
        if get_user_model().objects.filter(email__iexact=email).exists() \
                or get_user_model().objects.filter(username__iexact=email).exists():
            raise forms.ValidationError(_('A user with this email address already exists.'))
        return email

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    _('Passwords do not match. Please enter the same password in both fields.')
                )
        return password2

    def save(self, request):
        """Create the new user and RegistrationProfile, and returns the user."""

        User = get_user_model()
        username = email = self.cleaned_data['email']
        password = self.cleaned_data['password1']
        first_name = self.cleaned_data['first_name']
        last_name = self.cleaned_data['last_name']
        user = User.objects.create_user(
            username, email, password, first_name=first_name, last_name=last_name
        )

        site = get_current_site(request)
        send_activation_email(user, site)

        return user


class PasswordResetForm(PRF):

    def get_users(self, email):
        """Given an email, return matching user(s) who should receive a reset.

        Overriden from the base class to allow users who didn't click on the
        activation email or invite activation emails to get a new password, by
        clicking on the forgot password email link.

        We still ensure that users who have been explicitly deactivated are not
        able to reset their account by requesting a new password. We check if
        the user has logged in at least once, to differentiate such users from
        other users.

        """
        User = get_user_model()
        users = User.objects.filter(email__iexact=email).filter(
            # Active users should be allowed to reset passwords
            Q(is_active=True)
            # Newly registered users should be allowed to ask for reset
            # password, even if they didn't activate their account.
            | Q(last_login=F('date_joined'))
        ).distinct()
        return users


class RSRSetPasswordForm(PasswordValidationMixin, SetPasswordForm):
    """
    Customization of SetPasswordForm to extend validation
    """
    def clean(self):
        super(RSRSetPasswordForm, self).clean()


class InvitedUserForm(PasswordValidationMixin, forms.Form):
    first_name = forms.CharField(
        label=_('First name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _('First name')}
        ),
    )
    last_name = forms.CharField(
        label=_('Last name'),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': _('Last name')}
        ),
    )
    password1 = forms.CharField(
        label=_('Password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _('Password')},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label=_('Repeat password'),
        widget=forms.PasswordInput(
            attrs={'placeholder': _('Repeat password')},
            render_value=False
        )
    )

    def __init__(self, user, *args, **kwargs):
        """Add the user to the form."""
        super(InvitedUserForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    _('Passwords do not match. Please enter the same password in both fields.')
                )
        return password2

    def save(self, request):
        """
        Set the user to active and update the user's credentials.
        """
        self.user.is_active = True
        self.user.first_name = self.cleaned_data['first_name']
        self.user.last_name = self.cleaned_data['last_name']
        self.user.set_password(self.cleaned_data['password1'])
        self.user.save()


class UserAvatarForm(forms.ModelForm):
    """Form for updating the avatar of a user."""
    avatar = forms.ImageField(widget=forms.FileInput(attrs={
        'class': 'input',
        'size': '15',
    }))

    class Meta:
        model = get_user_model()
        fields = ('avatar',)


class CustomLabelModelChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        if not obj.is_public:
            return mark_safe('<span class="noCheck">%s <i>(private project)</i></span>' % obj)
        elif obj.is_published():
            return mark_safe('<span class="noCheck">%s</span>' % obj)
        else:
            return mark_safe('<span class="noCheck">%s <i>(not published)</i></span>' % obj)
