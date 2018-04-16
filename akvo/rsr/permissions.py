# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import rules

from django.contrib.auth import get_user_model

from .models import (Employment, IatiExport, Organisation, PartnerSite,
                     Project, ProjectUpdate, UserPermissionedProjects)

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


def _user_has_group_permissions(user, obj, group_names):
    User = get_user_model()
    if not user.is_authenticated():
        return False

    employments = user.approved_employments(group_names=group_names)
    has_employments = employments.exists()
    if not has_employments:
        return False

    if obj is None:
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
        # Check if the user permissions have been explicitly set for any projects
        try:
            permissioned_projects = UserPermissionedProjects.objects.get(user=user)
            projects = permissioned_projects.projects.values_list('id', flat=True)
            projects = set(all_projects).intersection(projects)
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
def is_org_admin(user, obj):
    group_names = [ADMIN_GROUP_NAME]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_user_manager(user, obj):
    group_names = [USER_MANAGER_GROUP_NAME]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
# FIXME: Bad name:: This is really checking if user is PE/M&E manager
def is_org_project_editor(user, obj):
    group_names = [PROJECT_EDITOR_GROUP_NAME, ME_MANAGER_GROUP_NAME]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_me_manager(user, obj):
    group_names = [ME_MANAGER_GROUP_NAME]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_user(user, obj):
    group_names = [USER_GROUP_NAME]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_enumerator(user, obj):
    group_names = [ENUMERATOR_GROUP_NAME]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_self(user, obj):
    if not obj:
        return True
    if isinstance(obj, get_user_model()) and obj == user:
        return True
    if isinstance(obj, Employment) and obj.user == user:
        return True
    return False
