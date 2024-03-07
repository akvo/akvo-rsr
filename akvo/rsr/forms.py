# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Forms and validation code for user registration and updating.

"""

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm as PRF, UserCreationForm
from django.contrib.auth.password_validation import validate_password
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError
from django.db.models import F, Q
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe

from akvo import settings
from akvo.password_policy.error_messages import get_error_message
from akvo.password_policy.rules.character import CharacterRule
from akvo.password_policy.rules.compound import CompoundRule
from akvo.password_policy.rules.length import LengthRule
from akvo.rsr.registration import send_activation_email

PASSWORD_MINIMUM_LENGTH = settings.PASSWORD_MINIMUM_LENGTH

User = get_user_model()


def password_policy_fallback(password, *_):
    rules = [
        LengthRule(min=PASSWORD_MINIMUM_LENGTH),
        CharacterRule.letters(min_length=1),
        CharacterRule.uppercases(min_length=1),
        CharacterRule.lowercase(min_length=1),
        CharacterRule.numbers(min_length=1),
        CharacterRule.symbols(min_length=1),
    ]
    validator = CompoundRule(rules)
    result = validator.validate(password)
    if not result.is_valid():
        errors = [
            ValidationError(get_error_message(error.code), code=error.code, params=error.context)
            for error in result.errors
        ]
        raise ValidationError(errors)


def resolve_password_policy(user):
    organisation = user.first_organisation()
    return organisation.password_policy if organisation else None


class RegisterForm(UserCreationForm):
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

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2')

    def save(self, request):
        self.instance.username = self.cleaned_data['email']
        self.instance.last_login = self.instance.date_joined
        user = super().save()
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


class InvitedUserForm(forms.Form):
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
        validate_password(password2, self.user)
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
