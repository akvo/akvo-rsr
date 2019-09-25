from django.core.exceptions import PermissionDenied
from django.db.models import Q
from rules.permissions import permissions

from akvo.rsr.models import Project, ProjectRole, User
from akvo.rsr.permissions import PERM_NAME_GROUP_MAP
from akvo.utils import get_project_for_object


class ProjectRolePermissionBackend(object):
    def authenticate(self, username, password):
        return None

    def has_perm(self, user, perm, obj):
        if not user.is_authenticated():
            return False

        groups = groups_from_permission(perm)
        all_roles = ProjectRole.objects.filter(Q(user=user) & groups)
        if obj is None:
            # obj=None calls are made by the DRF when checking if permissions
            # should be given for a "view", and not a specific object.
            # Check if the user has a project role with specified groups that
            # have the required permission, irrespective of which project the
            # role exists for.
            return all_roles.exists()

        project = get_project_for_object(Project, obj)
        if project is None:
            return False

        if not project.use_project_roles:
            # If the project is not using project roles, let the default
            # ObjectPermissionBackend handle the permisisons!
            return False

        # RSR admins and org admins of the reporting organisation will have
        # access, irrespective of the roles! Django super users have access
        # irrespective of any permission rules.
        if user.is_admin or user.admin_of(project.reporting_org):
            return True

        roles = all_roles.filter(project=project)
        if roles.exists():
            return True
        else:
            raise PermissionDenied


def groups_from_permission(permission):
    predicate = permissions.get(permission, None)
    if predicate is None:
        return []

    rules = predicate.name
    rule_to_group_mapping = {
        name: Q(group__name__in=groups) for name, groups in PERM_NAME_GROUP_MAP.items()
    }
    # Add is_rsr_admin since it doesn't use a group.
    rule_to_group_mapping['is_rsr_admin'] = Q(user__is_admin=True)
    # NOTE: is_self and is_own are ignored because they are not relevant for
    # projects, and they are also not relevant when an object is not present in
    # the context
    ignored = {'is_self', 'is_own'}
    operators = {'|': Q.OR, '&': Q.AND}
    groups = User.parse_permission_expression(rules, rule_to_group_mapping, operators, ignored)
    return groups
