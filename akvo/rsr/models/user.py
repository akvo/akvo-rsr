# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail.fields import ImageField

from tastypie.models import ApiKey

from akvo.utils import rsr_image_path

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
        _('staff'), default=False, help_text=_('Designates whether the user can log into this admin site.')
    )
    is_admin = models.BooleanField(
        _('admin'), default=False, help_text=_('Designates whether the user is a general RSR admin. '
                                               'To be used only for Akvo employees.')
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    organisations = models.ManyToManyField(
        'Organisation', verbose_name=_(u'organisations'), through=Employment, related_name='users', blank=True
    )
    notes = ValidXMLTextField(verbose_name=_('Notes and comments'), blank=True, default='')

    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/user/%(instance_pk)s/%(file_name)s')

    avatar = ImageField(_(u'avatar'),
                        null=True,
                        upload_to=image_path,
                        help_text=_(u'The avatar should be less than 500 kb in size.'),
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
        return "/user/{}/".format(self.pk)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()
    get_full_name.short_description = _(u'full name')

    def get_short_name(self):
        """
        Returns only the first_name, but is needed because the default admin templates use this method.
        """
        return self.first_name

    def user_name(self):
        return self.__unicode__()

    def get_organisation_names(self):
        return "\n".join([o.name for o in self.organisations.all()])
    get_organisation_names.short_description = _(u'organisations')

    def approved_organisations(self):
        """
        return all approved organisations of the user
        """
        from .organisation import Organisation
        return Organisation.objects.filter(employees__user=self, employees__is_approved=True)

    def updates(self):
        """
        return all updates created by the user
        """
        return ProjectUpdate.objects.filter(user=self).order_by('-created_at')

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].last_modified_at
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

    def get_is_admin(self):
        return self.is_admin
    get_is_admin.boolean = True  # make pretty icons in the admin list view

    def set_is_admin(self, set_it):
        self.is_admin = set_it
        self.save()

    def get_is_org_admin(self, org):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            return False
        return employment.group == Group.objects.get(name='Admins') if employment.is_approved else False
    get_is_org_admin.boolean = True  # make pretty icons in the admin list view
    get_is_org_admin.short_description = _(u'organisation admin')

    def set_is_org_admin(self, org, set_it):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            pass
        if set_it:
            employment.group = Group.objects.get(name='Admins')
            employment.save()
        else:
            employment.group.delete()

    def get_is_user_manager(self, org):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            return False
        return employment.group == Group.objects.get(name='User manager') if employment.is_approved else False
    get_is_user_manager.boolean = True  # make pretty icons in the admin list view
    get_is_user_manager.short_description = _(u'organisation admin')

    def set_is_user_manager(self, org, set_it):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            pass
        if set_it:
            employment.group = Group.objects.get(name='User manager')
            employment.save()
        else:
            employment.group.delete()

    def get_is_project_editor(self, org):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            return False
        return employment.group == Group.objects.get(name='Project Editors') if employment.is_approved else False
    get_is_project_editor.boolean = True  # make pretty icons in the admin list view
    get_is_project_editor.short_description = _(u'organisation admin')

    def set_is_project_editor(self, org, set_it):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            pass
        if set_it:
            employment.group = Group.objects.get(name='Project Editors')
            employment.save()
        else:
            employment.group.delete()

    def get_is_user(self, org):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            return False
        return employment.group == Group.objects.get(name='Users') if employment.is_approved else False
    get_is_user.boolean = True  # make pretty icons in the admin list view
    get_is_user.short_description = _(u'organisation admin')

    def set_is_user(self, org, set_it):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            pass
        if set_it:
            employment.group = Group.objects.get(name='Users')
            employment.save()
        else:
            employment.group.delete()

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
        """
        Support for self as profile. Use of this is deprecated
        """
        return self

    def in_group(self, group, organisation=None):
        """
        Returns whether a user is part of a group. Optionally an organisation can be added to check if a user is part
        of a group for the organisation.
        """
        for employment in self.employers.approved():
            if organisation:
                if employment.group == group and employment.organisation == organisation:
                    return True
            elif employment.group == group:
                return True
        return False

    def approved_employments(self):
        """
        Return
        """
        return self.employers.all().exclude(is_approved=False)

    def employments_dict(self, org_list):
        """
        Represent User as dict with employments.
        The org_list is a list of approved organisations of the original user. Based on this, the original user will
        have the option to approve / delete the employment.
        """
        employments = Employment.objects.filter(user=self)

        employments_array = []
        for employment in employments:
            employment_obj = employment.to_dict(org_list)
            employments_array.append(employment_obj)

        return dict(
            id=self.pk,
            email=self.email,
            first_name=self.first_name,
            last_name=self.last_name,
            employments=employments_array,
        )
