# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.core.mail import send_mail
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
import rules
from sorl.thumbnail.fields import ImageField
from tastypie.models import ApiKey

from akvo.utils import rsr_image_path

from .employment import Employment
from .project_update import ProjectUpdate
from .project import Project

from ..fields import ValidXMLCharField, ValidXMLTextField


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/user/%(instance_pk)s/%(file_name)s')


class CustomUserManager(BaseUserManager):
    def _create_user(self, username, email, password, is_staff, is_superuser, is_active, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(
            username=username, email=email, is_staff=is_staff, is_active=is_active,
            is_superuser=is_superuser, last_login=now, date_joined=now, **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email, password=None, **extra_fields):
        return self._create_user(username, email, password, False, False, False, **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        return self._create_user(username, email, password, True, True, True, **extra_fields)

    def __getattr__(self, attr, *args):
        try:
            return getattr(self.__class__, attr, *args)
        except AttributeError:
            return getattr(self.get_queryset(), attr, *args)


class User(AbstractBaseUser, PermissionsMixin):
    """
    A fully featured User model with admin-compliant permissions that uses a full-length email
    field as the username.
    Email and password are required. Other fields are optional.
    """
    username = ValidXMLCharField(_(u'username'), max_length=254, unique=True)
    email = models.EmailField(_(u'email address'), max_length=254, unique=True)
    first_name = ValidXMLCharField(_(u'first name'), max_length=30, blank=True)
    last_name = ValidXMLCharField(_(u'last name'), max_length=30, blank=True)
    is_active = models.BooleanField(
        _(u'active'), default=False,
        help_text=_(u'Designates whether this user should be treated as active. '
                    u'Unselect this instead of deleting accounts.')
    )
    is_staff = models.BooleanField(
        _(u'staff'), default=False,
        help_text=_(u'Designates whether the user can log into this admin site.')
    )
    is_admin = models.BooleanField(
        _(u'admin'), default=False,
        help_text=_(u'Designates whether the user is a general RSR admin. '
                    u'To be used only for Akvo employees.')
    )
    is_support = models.BooleanField(
        _(u'support user'), default=False,
        help_text=_(u'Designates whether the user is a support user. To be used for users '
                    u'willing to receive notifications when a new user registers for '
                    u'their organisation.')
    )
    date_joined = models.DateTimeField(_(u'date joined'), default=timezone.now)
    organisations = models.ManyToManyField(
        'Organisation', verbose_name=_(u'organisations'), through=Employment,
        related_name='users', blank=True
    )
    notes = ValidXMLTextField(verbose_name=_(u'Notes and comments'), blank=True, default='')
    avatar = ImageField(_(u'avatar'), null=True, upload_to=image_path,
                        help_text=_(u'The avatar should be less than 500 kb in size.'),
                        )

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', ]

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'user')
        verbose_name_plural = _(u'users')
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
        Returns only the first_name, but is needed because the default admin templates use
        this method.
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
        return all updates created by the user or by organisation users if requesting user is admin
        """
        if self.is_superuser or self.is_admin:
            return ProjectUpdate.objects.all()
        else:
            admin_employment_orgs = self.get_admin_employment_orgs()
            if admin_employment_orgs:
                return admin_employment_orgs.all_updates()
            else:
                return ProjectUpdate.objects.filter(user=self)

    def can_edit_update(self, update):
        is_admin = self.is_admin or self.is_superuser
        return is_admin or update in self.get_admin_employment_orgs().all_updates()

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].last_modified_at
        else:
            return None

    # methods that interact with the User model
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
    get_is_admin.short_description = _(u'rsr admin')

    def get_is_support(self):
        return self.is_support
    get_is_support.boolean = True  # make pretty icons in the admin list view
    get_is_support.short_description = _(u'support user')

    def set_is_admin(self, set_it):
        self.is_admin = set_it
        self.save()

    def get_is_org_admin(self, org):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            return False
        return employment.group == Group.objects.get(name='Admins') if \
            employment.is_approved else False
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

    def get_admin_employment_orgs(self):
        employments = Employment.objects.filter(user=self, is_approved=True, group__name='Admins')
        return employments.organisations()

    def get_owned_org_users(self):
        owned_organisation_users = []
        for o in self.get_admin_employment_orgs():
            owned_organisation_users += o.content_owned_organisations().users()
        return owned_organisation_users

    def get_is_user_manager(self, org):
        from .employment import Employment
        try:
            employment = Employment.objects.get(user=self, organisation=org)
        except:
            return False
        return employment.group == Group.objects.get(name='User manager') \
            if employment.is_approved else False
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
        return employment.group == Group.objects.get(name='Project Editors') \
            if employment.is_approved else False
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
        return employment.group == Group.objects.get(name='Users') if \
            employment.is_approved else False
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
        all_orgs = self.approved_organisations()
        if all_orgs:
            return all_orgs[0]
        else:
            return None

    def allow_edit(self, project):
        """ Support partner organisations may "take ownership" of projects, meaning that editing
        of them is restricted. This method is used "on top" of normal checking for user access to
        projects since it is only relevant for Partner users.
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
            if self.organisation in partner_admins_allowed:
                return True
        return False

    @property
    def get_api_key(self, key=""):
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

    @property
    def user(self):
        """
        Support for self as profile. Use of this is deprecated
        """
        return self

    def in_group(self, group, organisation=None):
        """
        Returns whether a user is part of a group. Optionally an organisation can be added
        to check if a user is part of a group for the organisation.
        """
        for employment in self.employers.approved():
            if organisation:
                if employment.group == group and employment.organisation == organisation:
                    return True
            elif employment.group == group:
                return True
        return False

    def approved_employments(self, group_names=None):
        """Return approved employments.

        When no group_names are provided, all the employments are returned.

        group_names can be used to filter employments in specific groups.

        """
        employments = self.employers.all().exclude(is_approved=False)
        if group_names is not None:
            employments = employments.filter(group__name__in=group_names)
        return employments.select_related('organisation', 'group', 'user')

    def can_create_project(self):
        """Check to see if the user can create a project."""

        for employment in self.approved_employments():
            org = employment.organisation
            if org.can_create_projects and self.has_perm('rsr.add_project', org):
                return True

        return False

    def can_import_results(self):
        """
        Check to see if the user can import results.

        :return: Boolean to indicate whether the user can import results
        """
        if self.is_superuser or self.is_admin:
            return True

        if not self.can_create_project():
            return False

        for employment in self.approved_employments():
            org = employment.organisation
            if self.admin_of(org) or self.me_manager_of(org):
                return True

        return False

    def employments_dict(self, org_list):
        """
        Represent User as dict with employments.
        The org_list is a list of approved organisations of the original user. Based on this,
        the original user will have the option to approve / delete the employment.
        """

        employments = Employment.objects.filter(user=self).select_related(
            'user', 'organisation', 'group'
        )
        employments = [employment.to_dict(org_list) for employment in employments]

        return dict(
            id=self.pk,
            email=self.email,
            first_name=self.first_name,
            last_name=self.last_name,
            employments=employments,
        )

    def has_role_in_org(self, org, group):
        """
        Helper function to determine if a user is in a certain group at an organisation.

        :param org; an Organisation instance.
        :param group; a Group instance.
        """
        if self.approved_employments().filter(organisation=org, group=group).exists():
            return True
        return False

    def admin_of(self, org):
        """
        Checks if the user is an Admin of this organisation.

        :param org; an Organisation instance.
        """
        admin_group = Group.objects.get(name='Admins')
        return self.has_role_in_org(org, admin_group)

    def me_manager_of(self, org):
        """
        Checks if the user is an M&E Manager of this organisation.

        :param org; an Organisation instance
        """
        editor_group = Group.objects.get(name='M&E Managers')
        return self.has_role_in_org(org, editor_group)

    def me_manager_for_project(self, project):
        """
        Checks if the user is an M&E Manager for this project

        :param project; a Project instance
        """
        employments = Employment.objects.filter(
            user=self, is_approved=True, group__name='M&E Managers'
        )
        orgs = employments.organisations()
        return project in Project.objects.of_partners(orgs).distinct()

    def project_editor_of(self, org):
        """
        Checks if the user is a Project editor of this organisation.

        :param org; an Organisation instance
        """
        editor_group = Group.objects.get(name='Project Editors')
        return self.has_role_in_org(org, editor_group)

    def get_me_manager_employment_orgs(self):
        """Return all organizations where user is a m&e manager."""

        employments = Employment.objects.filter(
            user=self, is_approved=True, group__name__in=['M&E Managers']
        )
        return employments.organisations()

    def get_project_editor_me_manager_employment_orgs(self):
        """Return all organisations where user is a project editor or m&e manager."""

        employments = Employment.objects.filter(
            user=self, is_approved=True, group__name__in=['Project Editors', 'M&E Managers']
        )
        return employments.organisations()

    def get_user_manager_employment_orgs(self):
        """Return all organisations where user is a user manager."""
        employments = Employment.objects.filter(
            user=self, is_approved=True, group__name='User Managers'
        )
        return employments.organisations()

    def admin_projects(self):
        """Return all projects of orgs where user is an admin."""

        orgs = self.get_admin_employment_orgs()
        return Project.objects.of_partners(orgs).distinct()

    def me_manager_projects(self):
        """Return all projects of orgs where user is m&e manager."""

        orgs = self.get_me_manager_employment_orgs()
        return Project.objects.of_partners(orgs).distinct()

    def project_editor_me_manager_projects(self):
        """Return all projects of orgs where user is project editor or m&e manager."""

        orgs = self.get_project_editor_me_manager_employment_orgs()
        return Project.objects.of_partners(orgs).distinct()

    def user_manager_projects(self):
        """Return all projects where user is a user manager."""

        orgs = self.get_user_manager_employment_orgs()
        return Project.objects.of_partners(orgs).distinct()

    def enumerator_projects(self):
        """Return all projects where user is an enumerator."""

        orgs = self.approved_employments(group_names=['Enumerators']).organisations()
        return Project.objects.of_partners(orgs).distinct()

    def get_permission_filter(self, permission, project_relation):
        """Convert a rules permission predicate into a queryset filter using Q objects.

        project_relation is the string for constructing a field lookup to the
        corresponding Project of the queryset's model.

        """

        permission_predicate = rules.permissions.permissions.get(permission, None)
        if permission_predicate is None:
            return Q(pk=None)  # No such permission exists!

        project_filter_name = '{}in'.format(project_relation or 'id__')
        permission_expression = permission_predicate.name
        permissions = {
            'is_rsr_admin': Q() if self.is_authenticated() and self.is_admin else Q(pk=None),
            'is_org_admin': Q(**{project_filter_name: self.admin_projects()}),
            'is_org_project_editor': Q(
                **{project_filter_name: self.project_editor_me_manager_projects()}
            ),
            'is_org_me_manager': Q(
                **{project_filter_name: self.me_manager_projects()}
            ),
            'is_org_enumerator': (
                Q(**{project_filter_name: self.enumerator_projects()})
            ),
            'is_org_user_manager': (
                Q(**{project_filter_name: self.user_manager_projects()}) & Q(user=self)
            ),
            'is_org_user': Q(**{project_filter_name: self.my_projects()}) & Q(user=self),
        }
        operators = {'|': Q.OR, '&': Q.AND}
        return self.parse_permission_expression(permission_expression, permissions, operators)

    @staticmethod
    def parse_permission_expression(permission_expression, permissions, operators):
        """Convert permission expression to a queryset filter using permissions mapping

        NOTE: This function does no error checking and assumes that all the
        expressions are valid, and all the operations in the expression are
        binary and correctly parenthesized.  The expressions from the rules
        library satisfy these assumptions and can be safely used as inputs to
        this function.

        """
        # FIXME: This whole thing seems like a horrible hack, and should go
        # away if the permissions system is reworked!
        expression = re.sub('([()|&])', ' \\1 ', permission_expression).split()
        expression_stack = []
        for item in expression:
            if item in permissions:
                expression_stack.append(permissions[item])

            elif item in operators:
                expression_stack.append(operators[item])

            elif item == ')':
                first, op, second = expression_stack[-3:]
                expression_stack = expression_stack[:-3]
                expression_stack.append(first._combine(second, op))

            elif item == '(':
                continue

            else:
                raise RuntimeError('{} permission not supported'.format(item))

        return expression_stack[0]
