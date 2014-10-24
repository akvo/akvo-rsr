# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group

from sorl.thumbnail.fields import ImageWithThumbnailsField

from tastypie.models import ApiKey

from akvo.utils import GROUP_RSR_EDITORS, GROUP_RSR_PARTNER_ADMINS, GROUP_RSR_PARTNER_EDITORS
from akvo.utils import groups_from_user, rsr_image_path

from .employment import Employment
from .project_update import ProjectUpdate

from ..fields import ValidXMLCharField, ValidXMLTextField


class CustomUserManager(BaseUserManager):

    def _create_user(self, username, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(username=username,
                          email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email, password=None, **extra_fields):
        return self._create_user(username, email, password, False, False, **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        return self._create_user(username, email, password, True, True, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    A fully featured User model with admin-compliant permissions that uses a full-length email field as the username.
    Email and password are required. Other fields are optional.
    """
    username = ValidXMLCharField(_('username'), max_length=254, unique=True)
    email = models.EmailField(_('email address'), max_length=254, unique=True)
    first_name = ValidXMLCharField(_('first name'), max_length=30, blank=True)
    last_name = ValidXMLCharField(_('last name'), max_length=30, blank=True)
    is_active = models.BooleanField(
        _('active'), default=False, help_text=_('Designates whether this user should be treated as active. '
                                                'Unselect this instead of deleting accounts.')
    )
    is_staff = models.BooleanField(
        _('staff status'), default=False, help_text=_('Designates whether the user can log into this admin site.')
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    organisations = models.ManyToManyField(
        'Organisation', verbose_name=_(u'organisations'), through=Employment, related_name='users', blank=True
    )
    notes = ValidXMLTextField(verbose_name=_('Notes and comments'), blank=True, default='')

    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/user/%(instance_pk)s/%(file_name)s')

    avatar = ImageWithThumbnailsField(
        _(u'avatar'), null=True, upload_to=image_path,
        thumbnail={'size': (200, 200), 'options': ('pad', )},
        help_text=_(
            u'The avatar should be less than 3.5 mb in size.'
        ),
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        app_label = 'rsr'
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['username', ]

    def __unicode__(self):
        return self.username

    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.email)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()
    get_full_name.short_description = _(u'full name')

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def user_name(self):
        return self.__unicode__()

    def get_organisation_names(self):
        return "\n".join([o.name for o in self.organisations.all()])
    get_organisation_names.short_description = _(u'organisations')

    def updates(self):
        """
        return all updates created by the user
        """
        return ProjectUpdate.objects.filter(user=self).order_by('-created_at')

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].created_at
        else:
            return None

    #methods that interact with the User model
    def get_is_active(self):
        return self.is_active
    get_is_active.boolean = True  # make pretty icons in the admin list view
    get_is_active.short_description = _(u'active')

    def set_is_active(self, set_it):
        self.is_active = set_it
        self.save()

    def get_is_staff(self):
        return self.is_staff
    get_is_staff.boolean = True  # make pretty icons in the admin list view

    def set_is_staff(self, set_it):
        self.is_staff = set_it
        self.save()

    def get_is_rsr_admin(self):
        return GROUP_RSR_EDITORS in groups_from_user(self)

    def get_is_org_admin(self):
        return GROUP_RSR_PARTNER_ADMINS in groups_from_user(self)
    get_is_org_admin.boolean = True  # make pretty icons in the admin list view
    get_is_org_admin.short_description = _(u'organisation admin')

    def set_is_org_admin(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_ADMINS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_ADMINS)

    def get_is_org_editor(self):
        return GROUP_RSR_PARTNER_EDITORS in groups_from_user(self)
    get_is_org_editor.boolean = True  # make pretty icons in the admin list view
    get_is_org_editor.short_description = _(u'project editor')

    def set_is_org_editor(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_EDITORS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_EDITORS)

    def _add_user_to_group(self, group_name):
        group = Group.objects.get(name=group_name)
        if not group in self.groups.all():
            self.groups.add(group)
            self.save()

    def _remove_user_from_group(self, group_name):
        group = Group.objects.get(name=group_name)
        if group in self.groups.all():
            self.groups.remove(group)
            self.save()

    def my_projects(self):
        return self.organisations.all().all_projects()

    def first_organisation(self):
        all_orgs = self.organisations.all()
        if all_orgs:
            return all_orgs[0]
        else:
            return None

    def allow_edit(self, project):
        """ Support partner organisations may "take ownership" of projects, meaning that editing of them is restricted
        This method is used "on top" of normal checking for user access to projects since it is only relevant for
        Partner users
        """
        allow_edit = True
        partner_admins_allowed = []
        # compile list of support orgs that limit editing
        for partner in project.support_partners():
            if not partner.allow_edit:
                allow_edit = False
                partner_admins_allowed.append(partner)
        # no-one limits editing, all systems go
        if allow_edit:
            return True
        # Only Partner admins on the list of "limiters" list may edit
        else:
            if self.get_is_org_admin() and self.organisation in partner_admins_allowed:
                return True
        return False

    @property
    def api_key(self, key=""):
        try:
            api_key = ApiKey.objects.get(user=self)
            key = api_key.key
        except:
            pass
        return key

    def email_user(self, subject, message, from_email=None):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email])
        pass

    def get_profile(self):
        """
        Needed to replicate the old user profile behaviour.
        """
        return self

    @property
    def user(self):
        # Support for self as profile. Use of this is deprecated
        return self

    def employments_dict(self):
        """Represent User as dict with employments"""
        employments = Employment.objects.filter(user=self)

        employments_array = []
        for employment in employments:
            employment_obj = employment.to_dict()
            employments_array.append(employment_obj)

        return dict(
            email=self.email,
            first_name=self.first_name,
            last_name=self.last_name,
            employments=employments_array,
        )
