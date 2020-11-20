# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.contrib.postgres.fields import ArrayField
from django.core.mail import send_mail
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
import rules
from sorl.thumbnail.fields import ImageField
from tastypie.models import ApiKey

from akvo.utils import rsr_image_path
from akvo.rsr.permissions import EDIT_ROLES, CREATE_PROJECT_ROLES

from .employment import Employment
from .partnership import Partnership
from .project_update import ProjectUpdate
from .project import Project
from .project_role import ProjectRole

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


class User(AbstractBaseUser, PermissionsMixin):
    """
    A fully featured User model with admin-compliant permissions that uses a full-length email
    field as the username.
    Email and password are required. Other fields are optional.
    """
    username = ValidXMLCharField(_('username'), max_length=254, unique=True)
    email = models.EmailField(_('email address'), max_length=254, unique=True)
    first_name = ValidXMLCharField(_('first name'), max_length=30, blank=True)
    last_name = ValidXMLCharField(_('last name'), max_length=30, blank=True)
    is_active = models.BooleanField(
        _('active'), default=False,
        help_text=_('Designates whether this user should be treated as active. '
                    'Unselect this instead of deleting accounts.')
    )
    is_staff = models.BooleanField(
        _('staff'), default=False,
        help_text=_('Designates whether the user can log into this admin site.')
    )
    is_admin = models.BooleanField(
        _('admin'), default=False,
        help_text=_('Designates whether the user is a general RSR admin. '
                    'To be used only for Akvo employees.')
    )
    is_support = models.BooleanField(
        _('support user'), default=False,
        help_text=_('Designates whether the user is a support user. To be used for users '
                    'willing to receive notifications when a new user registers for '
                    'their organisation.')
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    organisations = models.ManyToManyField(
        'Organisation', verbose_name=_('organisations'), through='Employment',
        related_name='users', blank=True
    )
    notes = ValidXMLTextField(verbose_name=_('Notes and comments'), blank=True, default='')
    avatar = ImageField(_('avatar'), null=True, upload_to=image_path,
                        help_text=_('The avatar should be less than 500 kb in size.'),
                        )
    seen_announcements = ArrayField(models.CharField(max_length=50), default=[])

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', ]

    def check_password(self, raw_password):
        """
        Returns a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """
        from akvo.rsr.models.login_log import is_login_disabled
        from django import forms
        if is_login_disabled(self.user.username):
            message = _('Login has been disabled for %(time)d minutes') % {
                'time': settings.LOGIN_DISABLE_TIME / 60.0
            }
            raise forms.ValidationError(message)

        return super(User, self).check_password(raw_password)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['username', ]

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return "/user/{}/".format(self.pk)

    def get_full_name(self):
        full_name = "{} {}".format(self.first_name, self.last_name).strip()
        if not full_name:
            full_name = "User with Email: {}".format(self.email)
        return full_name
    get_full_name.short_description = _('full name')

    def get_short_name(self):
        """
        Returns only the first_name, but is needed because the default admin templates use
        this method.
        """
        return self.first_name

    def user_name(self):
        return self.username

    def get_organisation_names(self):
        return "\n".join([o.name for o in self.organisations.all()])
    get_organisation_names.short_description = _('organisations')

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

    def viewable_indicator_updates(self, project_id):

        if not hasattr(self, '_viewable_updates'):
            self._viewable_updates = {}

        if project_id not in self._viewable_updates:
            from akvo.rsr.models import IndicatorPeriodData

            project_updates = IndicatorPeriodData.objects.filter(
                period__indicator__result__project_id=project_id)
            viewable_updates = IndicatorPeriodData.get_user_viewable_updates(project_updates, self)

            self._viewable_updates[project_id] = viewable_updates
        else:
            viewable_updates = self._viewable_updates[project_id]

        return viewable_updates

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].last_modified_at
        else:
            return None

    # methods that interact with the User model
    def get_admin_employment_orgs(self):
        """Return all organisations of the user where they are Admins"""
        return self.approved_employments(['Admins']).organisations().distinct()

    def get_non_admin_employment_orgs(self):
        """Return all organisations of the user where they are *not* Admins"""
        all_orgs = self.approved_employments().organisations()
        admin_orgs = self.get_admin_employment_orgs()
        return all_orgs.exclude(id__in=admin_orgs).distinct()

    def get_owned_org_users(self):
        return self.get_admin_employment_orgs().content_owned_organisations().users()

    def first_organisation(self):
        all_orgs = self.approved_organisations()
        if all_orgs:
            return all_orgs[0]
        else:
            return None

    @property
    def get_api_key(self):
        api_key, _ = ApiKey.objects.get_or_create(user=self)
        return api_key.key

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

    def approved_organisations(self, group_names=None):
        """Return all approved organisations of the user."""
        return self.approved_employments(group_names=group_names).organisations()

    def user_management_organisations(self):
        groups = ['User Managers', 'Admins']
        orgs = self.approved_organisations(group_names=groups)
        return orgs.content_owned_organisations().distinct()

    def my_projects(self, group_names=None, show_restricted=False):
        # Projects where user is employed with specified role
        organisations = self.approved_organisations(group_names=group_names)
        employment_projects = organisations.all_projects()
        # Projects of explicitly content owned organisations
        directly_content_owned_orgs = organisations.content_owned_organisations().filter(
            content_owner__in=organisations)
        content_owned_projects = directly_content_owned_orgs.all_projects()
        # Projects where user has the required role
        roles = ProjectRole.objects.filter(user=self)
        if group_names is not None:
            roles = roles.filter(group__name__in=group_names)
        role_project_ids = roles.values_list('project_id', flat=True)
        # Projects where user is admin of reporting org
        admin_organisations = self.approved_organisations(group_names=['Admins'])
        admin_projects = admin_organisations.all_projects()
        admin_reporting_projects = admin_projects.filter(
            partnerships__iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION)
        content_owned_filter = {
            'pk__in': content_owned_projects,
            'use_project_roles': False
        }
        employment_filter = {
            'pk__in': employment_projects,
            'use_project_roles': False
        }
        if show_restricted:
            content_owned_filter.pop('use_project_roles')
            employment_filter.pop('use_project_roles')

        projects = Project.objects.filter(
            Q(**content_owned_filter)
            | Q(**employment_filter)
            | Q(pk__in=role_project_ids, use_project_roles=True)
            | Q(pk__in=admin_reporting_projects, use_project_roles=True)
        ).distinct()
        return projects

    def can_create_project(self):
        """Check to see if the user can create a project."""

        for org in self.approved_organisations().filter(can_create_projects=True):
            if self.has_perm('rsr.add_project', org):
                return True
        return False

    def can_create_projects_in_program(self, program):
        """Check to see if the user can create a project in a program."""

        if self.is_superuser or self.is_admin:
            return True

        partner_organisations = program.root_project.partners.all().distinct().values_list('pk', flat=True)
        create_perm_user_orgs = self.approved_employments(CREATE_PROJECT_ROLES)\
                                    .filter(organisation__can_create_projects=True)\
                                    .values_list('organisation__pk', flat=True)

        return bool(set(partner_organisations).intersection(create_perm_user_orgs))

    def can_import_results(self, project):
        """Check to see if the user can import results to the specified project."""
        return self.has_perm('rsr.import_results', project)

    def can_view_project(self, project):
        """Check if the user can view a project."""
        return self.has_perm('rsr.view_project', project)

    def can_edit_project(self, project, use_cached_attr=False):
        """Check if the user can edit a project.

        The `use_cached_attr' should be used when this call is being made on a
        list of projects, in a single request. Turning on this flag caches the
        list of projects on the user object, and uses that to determine if a
        project is editable, or not.

        """

        if not use_cached_attr:
            return self.has_perm('rsr.change_project', project)

        if self.is_superuser or self.is_admin:
            return True

        elif not hasattr(self, '_editable_projects'):
            editable_projects = self.my_projects(group_names=EDIT_ROLES)
            self._editable_projects = set(editable_projects.values_list('pk', flat=True))

        return project.pk in self._editable_projects

    def can_publish_project(self, project):
        """Check if the user can publish a project."""
        return self.has_perm('rsr.change_publishingstatus', project)

    def can_edit_settings(self, project):
        """Check if the user can edit settings of a project."""
        return self.has_perm('rsr.change_projecteditorvalidationset', project)

    def can_edit_access(self, project):
        """Check if the user can edit access to a project."""
        return (
            self.is_superuser
            or self.is_admin
            or self.admin_of(project.reporting_org)
            or (project.use_project_roles
                and ProjectRole.objects.filter(project=project, user=self, group__name='Admins').exists())
        )

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

    def admin_projects(self):
        """Return all projects of orgs where user is an admin."""
        return self.my_projects(group_names=['Admins'])

    def me_manager_projects(self):
        """Return all projects of orgs where user is m&e manager."""
        return self.my_projects(group_names=['M&E Managers'])

    def project_editor_me_manager_projects(self):
        """Return all projects of orgs where user is project editor or m&e manager."""
        return self.my_projects(group_names=['Project Editors', 'M&E Managers'])

    def user_manager_projects(self):
        """Return all projects where user is a user manager."""
        return self.my_projects(group_names=['User Managers'])

    def enumerator_projects(self):
        """Return all projects where user is an enumerator."""
        return self.my_projects(group_names=['Enumerators'])

    def get_permission_filter(self, permission, project_relation, include_user_owned=True):
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
            'is_org_me_manager_or_project_editor': Q(
                **{project_filter_name: self.project_editor_me_manager_projects()}
            ),
            'is_org_me_manager': Q(
                **{project_filter_name: self.me_manager_projects()}
            ),
            'is_org_enumerator': (
                Q(**{project_filter_name: self.enumerator_projects()})
            ),
            'is_org_user_manager': Q(**{project_filter_name: self.user_manager_projects()}),
            'is_org_user': Q(**{project_filter_name: self.my_projects()}),
        }
        if include_user_owned:
            permissions['is_org_user'] = permissions['is_org_user'] & Q(user=self)
            permissions['is_org_user_manager'] = permissions['is_org_user_manager'] & Q(user=self)
            permissions['is_own'] = Q(user=self)

        operators = {'|': Q.OR, '&': Q.AND}
        return self.parse_permission_expression(permission_expression, permissions, operators)

    @staticmethod
    def parse_permission_expression(permission_expression, permissions, operators, ignored=None):
        """Convert permission expression to a queryset filter using permissions mapping

        NOTE: This function does no error checking and assumes that all the
        expressions are valid, and all the operations in the expression are
        binary and correctly parenthesized.  The expressions from the rules
        library satisfy these assumptions and can be safely used as inputs to
        this function.

        """
        if ignored is None:
            ignored = {}

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
                if first is None:
                    result = second
                elif second is None:
                    result = first
                else:
                    result = first._combine(second, op)
                expression_stack.append(result)

            elif item == '(':
                continue

            elif item in ignored:
                expression_stack.append(None)

            else:
                raise RuntimeError('{} permission not supported'.format(item))

        return expression_stack[0]


User._meta.get_field('is_superuser').help_text = _(
    'Designates that this user has all permissions without explicitly assigning them. '
    'Use this only for RSR team members. For other Akvo users, use is_admin flag.'
)
