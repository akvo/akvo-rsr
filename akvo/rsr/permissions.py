# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import rules

from django.contrib.auth import get_user_model

from ..utils import project_access_filter
from .models import Employment, IatiExport, Organisation, PartnerSite, Project, ProjectUpdate

GROUP_NAME_ADMINS = 'Admins'
GROUP_NAME_ME_MANAGERS = 'M&E Managers'
GROUP_NAME_PROJECT_EDITORS = 'Project Editors'
GROUP_NAME_USERS = 'Users'
GROUP_NAME_ENUMERATORS = 'Enumerators'
GROUP_NAME_USER_MANAGERS = 'User Managers'


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
        all_projects = employments.organisations().all_projects()
        projects = project_access_filter(user, all_projects)
        return id_ in projects.values_list('id', flat=True)

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
    group_names = [GROUP_NAME_ADMINS]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_user_manager(user, obj):
    group_names = [GROUP_NAME_USER_MANAGERS]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_me_manager_or_project_editor(user, obj):
    group_names = [GROUP_NAME_PROJECT_EDITORS, GROUP_NAME_ME_MANAGERS]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_me_manager(user, obj):
    group_names = [GROUP_NAME_ME_MANAGERS]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_user(user, obj):
    group_names = [GROUP_NAME_USERS]
    return _user_has_group_permissions(user, obj, group_names)


@rules.predicate
def is_org_enumerator(user, obj):
    group_names = [GROUP_NAME_ENUMERATORS]
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
