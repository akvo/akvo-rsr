from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import PermissionDenied
from django.db.models import Model, Q
from rules import Predicate
from rules.permissions import permissions

from akvo.rsr.models import Project, ProjectRole, User
from akvo.rsr.permissions import PERM_NAME_GROUP_MAP
from akvo.utils import get_project_for_object

OWNABLE_MODELS = {
    "rsr.projectupdate"
}

class ProjectRolePermissionBackend(BaseBackend):
    def authenticate(self, request, **kwargs):
        return None

    def has_perm(self, user, perm, obj=None):
        if not user.is_authenticated:
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
        elif can_own_model(perm, obj) and (obj_user_id := getattr(obj, "user_id", None)):
            # When a model can be owned despite the project role, check if the current user does own it
            return obj_user_id and obj.user_id == user.id

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

        # NOTE: We are using can_edit_access method, since anyone with
        # permissions to edit access, essentially has access to everything.
        if user.can_edit_access(project):
            return True

        roles = all_roles.filter(project=project)
        if roles.exists():
            return True
        else:
            raise PermissionDenied


def can_own_model(permission: str, obj: Model) -> bool:
    """
    A simplistic check whether object ownership is important for the permission check

    Just like the rest of this permission system, this method shouldn't exist.
    It's extremely simplistic in that it ignores predicate logic and just checks if "is_own"
     is in the predicate.
    It would just take too much time to write another hack like User.parse_permission_expression
    This might go wrong for complicated predicates.
    """
    predicate: Predicate = permissions.get(permission, None)
    if predicate is None:
        return False
    return "is_own" in predicate.name and str(obj._meta) in OWNABLE_MODELS


def groups_from_permission(permission):
    predicate = permissions.get(permission, None)
    if predicate is None:
        return Q(pk=None)

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
