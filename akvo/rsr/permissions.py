# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import rules

from django.contrib.auth import get_user_model
from django.db.models import QuerySet

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
        if obj.user_id == user.id:
            return True
        elif group_names == [GROUP_NAME_ADMINS]:
            # Check if user can admin the user making the update

            # NOTE: We could set `obj = user` and just see if the admin has the
            # right permissions on the user, but admins cannot modify content
            # owned users, only their employments. This seems to be reasonable,
            # though, it may be harmless to change. We therefor use an ugly
            # Employment QuerySet here to check further.
            obj = obj.user.employers.all()
            id_ = None
        else:
            return False

    elif hasattr(obj, 'project_id'):
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

    # FIXME: Admins can only edit directly employed users, not content owned
    # users. Admins can change employments of content_owned_users, though
    all_users = employments.organisations().users().values_list('id', flat=True)
    if isinstance(obj, User):
        return obj.id in all_users

    # NOTE: This is a "caching" hack. The query for content_owned_organisations
    # is pretty slow, and doing it multiple times per request is a disaster.
    # Per request, though, the user object should ideally be created once and
    # only once. So, we are caching the ids of the content owned organisations
    # on the user object, and avoiding multiple slow queries.
    if not hasattr(user, '_content_owned_organisations'):
        content_owned_organisations = employments.organisations()\
                                                 .content_owned_organisations()\
                                                 .values_list('id', flat=True)
        user._content_owned_organisations = content_owned_organisations
    else:
        content_owned_organisations = user._content_owned_organisations

    if isinstance(obj, Organisation):
        return obj.id in content_owned_organisations

    if isinstance(obj, Employment):
        return obj.organisation_id in content_owned_organisations

    if isinstance(obj, QuerySet) and obj.model == Employment:
        # NOTE: We reach here from the ProjectUpdate check above
        return bool(
            set(obj.values_list('organisation_id', flat=True)) & set(content_owned_organisations)
        )

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
