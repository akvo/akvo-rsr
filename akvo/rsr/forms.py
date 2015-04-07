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
from django.db.models import get_model
from django.utils.translation import ugettext_lazy as _
from django.utils.safestring import mark_safe

from mollie.ideal.utils import get_mollie_banklist

from registration.models import RegistrationProfile

from urlparse import urlsplit, urlunsplit

from .models import Country, Invoice, Organisation, Project, ProjectUpdate, ProjectUpdateLocation

from akvo import settings


class RegisterForm(forms.Form):
    email = forms.EmailField(
        label='Email',
        max_length=254,
        widget=forms.TextInput(
            attrs={'placeholder': 'Email'}
        ),
    )
    first_name = forms.CharField(
        label='First name',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'First name'}
        ),
    )
    last_name = forms.CharField(
        label='Last name',
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'Last name'}
        ),
    )
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Password'},
            render_value=False
        )
    )
    password2 = forms.CharField(
        label='Repeat password',
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
        if get_user_model().objects.filter(email__iexact=email).exists() \
                or get_user_model().objects.filter(username__iexact=email).exists():
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
        empty_label='Organisation'
    )
    job_title = forms.CharField(
        label='',
        required=False,
        max_length=50,
        widget=forms.TextInput(
            attrs={'placeholder': 'Job title (optional)'}
        ),
    )
    country = forms.ModelChoiceField(
        queryset=Country.objects.all(),
        label='',
        required=False,
        empty_label='Country (optional)'
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


class ProjectUpdateForm(forms.ModelForm):
    """Form representing a ProjectUpdate."""

    title = forms.CharField(label='', widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '42',
        'maxlength': '50',
        'placeholder': 'Title',
        }))
    text = forms.CharField(label='', required=False, widget=forms.Textarea(attrs={
        'class': 'textarea',
        'placeholder': 'Description',
        }))
    language = forms.ChoiceField(choices=settings.LANGUAGES, initial='en')
    photo = forms.ImageField(required=False, widget=forms.FileInput(attrs={
        'class': 'input',
        'size': '15',
        }))
    photo_caption = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        'placeholder': 'Photo caption',
        }))
    photo_credit = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '25',
        'placeholder': 'Photo credit',
        }))
    video = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '42',
        'maxlength': '255',
        'placeholder': 'Video link',
        }))
    video_caption = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '75',
        'placeholder': 'Video caption',
        }))
    video_credit = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={
        'class': 'input',
        'size': '25',
        'maxlength': '25',
        'placeholder': 'Video credit',
        }))
    latitude = forms.FloatField(widget=forms.HiddenInput())
    longitude = forms.FloatField(widget=forms.HiddenInput())

    class Meta:
        model = ProjectUpdate
        fields = ('title', 'text', 'language', 'photo', 'photo_caption', 'photo_credit', 'video', 'video_caption',
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
                raise forms.ValidationError(_('Invalid video URL. Currently only YouTube and Vimeo are supported.'))
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
            # Only when adding an update. When editing an update, the initial location is maintained.
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
            raise forms.ValidationError('Project or user not found.')


class UserAvatarForm(forms.ModelForm):
    """Form for updating the avatar of a user."""
    avatar = forms.ImageField(widget=forms.FileInput(attrs={
        'class': 'input',
        'size': '15',
    }))

    class Meta:
        model = get_user_model()
        fields = ('avatar',)


class InvoiceForm(forms.ModelForm):
    def __init__(self, project, engine, *args, **kwargs):
        super(InvoiceForm, self).__init__(*args, **kwargs)
        self.project = project
        self.engine = engine
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
    name = forms.CharField(label="Full name")
    email = forms.EmailField(label="Email address")
    email2 = forms.EmailField(label="Email address (repeat)")
    campaign_code = forms.CharField(required=False, label="Campaign code (optional)")
    is_public = forms.BooleanField(required=False, label="List name next to donation")

    class Meta:
        model = get_model('rsr', 'invoice')
        fields = ('amount', 'name', 'email', 'email2',
                  'campaign_code', 'is_public')

    def over_donated(self):
        donation = self.cleaned_data.get('amount', 0)
        if self.engine == Invoice.PAYMENT_ENGINE_PAYPAL:
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
            label='Select your organisation',
        )


class CustomLabelModelChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        checks = obj.check_mandatory_fields()
        if checks[0]:
            return mark_safe(u'<span class="success">%s</span>' % obj.__unicode__())
        else:
            label = obj.__unicode__() + " (<a href='/admin/rsr/project/%s/'" \
                                        " target='_blank'>edit project</a>)" % str(obj.pk)
            for check in checks[1]:
                if check[0] == u'error':
                    label += u'<br>- %s' % check[1]
            return mark_safe(u'<span class="error">%s</span>' % label)



class IatiExportForm(forms.ModelForm):
    """Form for adding an entry to the IATI export model."""
    is_public = forms.BooleanField(required=False, label="Show IATI file on organisation page")
    projects = CustomLabelModelChoiceField(
        widget=forms.CheckboxSelectMultiple,
        queryset=Project.objects.all(),
        label="Select the projects included in the export:"
    )

    class Meta:
        model = get_model('rsr', 'IatiExport')
        fields = ('projects', 'is_public', )

    def __init__(self, org=None, *args, **kwargs):
        super(IatiExportForm, self).__init__(*args, **kwargs)
        if org:
            self.fields['projects'].queryset = org.reporting_projects.all()

    def save(self, reporting_organisation=None, user=None):
        if reporting_organisation and user:
            iati_export = super(IatiExportForm, self).save(commit=False)
            iati_export.reporting_organisation = reporting_organisation
            iati_export.user = user
            iati_export.save()
            self.save_m2m()
            iati_export.save()

            return iati_export
        else:
            raise forms.ValidationError('Reporting organisation or user not found.')
