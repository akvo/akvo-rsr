# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import rules

from django.contrib.auth import get_user_model

from .models import (Employment, IatiExport, Organisation, PartnerSite, Project, ProjectUpdate,
                     IndicatorPeriodData, UserPermissionedProjects)

ADMIN_GROUP_NAME = 'Admins'
ME_MANAGER_GROUP_NAME = 'M&E Managers'
PROJECT_EDITOR_GROUP_NAME = 'Project Editors'
USER_GROUP_NAME = 'Users'
ENUMERATOR_GROUP_NAME = 'Enumerators'
USER_MANAGER_GROUP_NAME = 'User Managers'


@rules.predicate
def is_rsr_admin(user):
    if user.is_authenticated() and user.get_is_admin():
        return True
    return False


@rules.predicate
def is_org_admin(user, obj):
    User = get_user_model()
    if not user.is_authenticated():
        return False

    employments = user.approved_employments(group_names=[ADMIN_GROUP_NAME])
    has_employments = employments.exists()
    if obj is None and has_employments:
        return True

    if isinstance(obj, ProjectUpdate):
        return obj.user == user

    if hasattr(obj, 'project_id'):
        id_ = obj.project_id

    elif isinstance(obj, Project):
        id_ = obj.id

    elif hasattr(obj, 'project_relation'):
        query = {obj.project_relation: [obj.id]}
        id_ = Project.objects.values_list('id', flat=True).get(**query)

    else:
        id_ = None

    if id_:
        all_projects = employments.organisations().all_projects().values_list('id', flat=True)
        try:
            permissioned_projects = UserPermissionedProjects.objects.get(user=user)
            projects = permissioned_projects.projects.values_list('id', flat=True)
        except UserPermissionedProjects.DoesNotExist:
            projects = all_projects

        return id_ in projects

    all_users = employments.organisations().users().values_list('id', flat=True)
    if isinstance(obj, User):
        return obj.id in all_users

    content_owned_organisations = employments.organisations()\
                                             .content_owned_organisations()\
                                             .values_list('id', flat=True)
    if isinstance(obj, Organisation):
        return obj.id in content_owned_organisations

    if isinstance(obj, Employment):
        return obj.organisation_id in content_owned_organisations

    if isinstance(obj, PartnerSite):
        return obj.organisation_id in content_owned_organisations

    if isinstance(obj, IatiExport):
        return obj.reporting_organisation_id in content_owned_organisations

    if hasattr(obj, 'location_target') and isinstance(obj.location_target, Organisation):
        return obj.location_target_id in content_owned_organisations

    return False


@rules.predicate
def is_org_user_manager(user, obj):
    if not user.is_authenticated():
        return False
    for employment in user.approved_employments():
        if employment.group.name == USER_MANAGER_GROUP_NAME:
            if not obj:
                return True
            elif isinstance(obj, get_user_model()) and obj in employment.organisation.all_users():
                return True
            elif type(obj) == Employment and \
                    obj.organisation in employment.organisation.content_owned_organisations():
                return True
            elif type(obj) == Project and obj in employment.organisation.all_projects():
                return True
            elif type(obj) == Organisation and \
                    obj in employment.organisation.content_owned_organisations():
                return True
            elif isinstance(obj, ProjectUpdate) and obj.user == user:
                return True
    return False


@rules.predicate
# FIXME: Bad name:: This is really checking if user is PE/M&E manager
def is_org_project_editor(user, obj):
    if not user.is_authenticated():
        return False
    group_names = [PROJECT_EDITOR_GROUP_NAME, ME_MANAGER_GROUP_NAME]
    for employment in user.approved_employments(group_names=group_names):
        is_privileged = is_organisation_or_user_owned(user, employment, obj)
        if is_privileged:
            return True
        else:
            continue
    return False


@rules.predicate
def is_org_me_manager(user, obj):
    if not user.is_authenticated():
        return False
    group_names = [ME_MANAGER_GROUP_NAME]
    for employment in user.approved_employments(group_names=group_names):
        is_privileged = is_organisation_or_user_owned(user, employment, obj)
        if is_privileged:
            return True
        else:
            continue
    return False


@rules.predicate
def is_org_user(user, obj):
    if not user.is_authenticated():
        return False
    if not obj:
        return True
    if isinstance(obj, ProjectUpdate):
        return obj.user == user
    if isinstance(obj, Project):
        employments = user.approved_employments(group_names=[USER_GROUP_NAME])
        return obj in employments.organisations().all_projects()
    return False


@rules.predicate
def is_org_enumerator(user, obj):
    if not user.is_authenticated():
        return False
    if obj is None:
        return True
    if isinstance(obj, ProjectUpdate):
        return obj.user == user
    if isinstance(obj, IndicatorPeriodData):
        # Show only own updates or approved updates of others
        obj = Project.objects.get(results__indicators__periods__data__in=[obj.id])
    if isinstance(obj, Project):
        employments = user.approved_employments(group_names=[ENUMERATOR_GROUP_NAME])
        return obj in employments.organisations().all_projects()
    return False


@rules.predicate
def is_self(user, obj):
    if not obj:
        return True
    if isinstance(obj, get_user_model()) and obj == user:
        return True
    if isinstance(obj, Employment) and obj.user == user:
        return True
    return False


# FIXME: This method could be re-used in the other predicates too - for
# instance, in is_org_admin, is_org_user_manager, if some of the rules defined
# there are incorporated into this function.
def is_organisation_or_user_owned(user, employment, obj):
    if not obj:
        return True
    if isinstance(obj, Organisation):
        if obj in employment.organisation.content_owned_organisations():
            return True
    elif isinstance(obj, Project) and obj in employment.organisation.all_projects():
        return True
    elif isinstance(obj, ProjectUpdate) and obj.user == user:
        return True
    else:
        try:
            if obj.project and obj.project in employment.organisation.all_projects():
                return True
        except Exception:
            pass
        try:
            if obj.result.project and obj.result.project in \
                    employment.organisation.all_projects():
                return True
        except Exception:
            pass
        try:
            if obj.indicator.result.project and obj.indicator.result.project in \
                    employment.organisation.all_projects():
                return True
        except Exception:
            pass
        try:
            if obj.period.indicator.result.project and \
                obj.period.indicator.result.project in employment.organisation.\
                    all_projects():
                return True
        except Exception:
            pass
        try:
            if obj.data.period.indicator.result.project and \
                obj.data.period.indicator.result.project in employment.organisation.\
                    all_projects():
                return True
        except Exception:
            pass
        try:
            if obj.location.location_target and obj.location.location_target in \
                    employment.organisation.all_projects():
                return True
        except Exception:
            pass
        try:
            if obj.transaction.project and obj.transaction.project in \
                    employment.organisation.all_projects():
                return True
        except Exception:
            pass
        try:
            if isinstance(obj.location_target, Project) and \
                    obj.location_target in employment.organisation.all_projects():
                return True
        except Exception:
            pass
