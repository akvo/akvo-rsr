# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from collections import namedtuple

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import Project, ProjectRole, User
from akvo.rest.serializers import (
    OrganisationBasicSerializer,
    ProjectRoleSerializer,
)
from akvo.rest.views.utils import create_invited_user
from akvo.utils import send_user_invitation, log_project_changes


Role = namedtuple("Role", ("email", "role"))


@api_view(["GET", "PATCH"])
@login_required
def project_roles(request, project_pk):
    user = request.user
    project = get_object_or_404(Project, pk=project_pk)

    if not user.can_edit_enumerator_access(project):
        raise PermissionDenied

    status = 200
    if request.method == "PATCH":
        manage_only_enumerators = not user.can_edit_access(project)
        roles = request.data.get("roles", [])
        auth_groups = {role["role"] for role in roles}
        unknown_groups = auth_groups - set(settings.REQUIRED_AUTH_GROUPS)
        if unknown_groups:
            response = {
                "error": "Unknown groups: {}".format(",".join(unknown_groups))
            }
            return Response(response, status=400)

        emails = {role["email"] for role in roles}
        unknown_users = emails - set(
            User.objects.filter(email__in=emails).values_list(
                "email", flat=True
            )
        )
        if unknown_users:
            response = {
                "error": "Unknown users: {}".format(",".join(unknown_users))
            }
            return Response(response, status=400)

        groups = {name: Group.objects.get(name=name) for name in auth_groups}
        users = {email: User.objects.get(email=email) for email in emails}
        new_roles = {
            Role(email=role['email'], role=role['role'])
            for role in (
                [r for r in roles if r['role'] == 'Enumerators']
                if manage_only_enumerators
                else roles
            )
        }
        existing_roles = {
            Role(*role)
            for role in (
                project.projectrole_set.filter(group__name="Enumerators")
                if manage_only_enumerators
                else project.projectrole_set
            ).values_list("user__email", "group__name").distinct()
        }
        use_project_roles = (
            request.data.get('use_project_roles', False)
            or bool(new_roles)
            or (manage_only_enumerators and project.use_project_roles)
        )

        with transaction.atomic():
            # Set use_project_roles flag on the project
            if project.use_project_roles != use_project_roles:
                project.use_project_roles = use_project_roles
                project.save(update_fields=["use_project_roles"])

            # Delete roles
            for project_role in existing_roles - new_roles:
                deleted_roles = ProjectRole.objects.filter(
                    project=project,
                    user__email=project_role.email,
                    group__name=project_role.role,
                )
                deleted_role = deleted_roles.first()
                deleted_roles.delete()
                if deleted_role:
                    log_project_changes(request.user, project, deleted_role, {}, 'deleted')

            # Create roles
            created = [
                ProjectRole(
                    project=project,
                    user=users[project_role.email],
                    group=groups[project_role.role],
                )
                for project_role in (new_roles - existing_roles)
            ]
            ProjectRole.objects.bulk_create(created)
            for role in created:
                log_project_changes(request.user, project, role, {}, 'added')

    if not project.use_project_roles:
        roles = []
        organisations = OrganisationBasicSerializer(
            project.partners.distinct(), many=True
        ).data
    else:
        roles = ProjectRoleSerializer(
            project.projectrole_set.distinct(), many=True
        ).data
        organisations = []

    response = {
        "use_project_roles": project.use_project_roles,
        "roles": roles,
        "organisations": organisations,
        "project": project_pk,
    }
    return Response(response, status=status)


@api_view(["POST"])
@login_required
def project_invite_user(request, project_pk):
    user = request.user
    project = get_object_or_404(Project, id=project_pk)

    can_manage_users = user.has_perm('rsr.user_management', project)

    if not can_manage_users and not user.can_edit_enumerator_access(project):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    email, role, name = request.data.get('email'), request.data.get('role'), request.data.get('name')
    if not (email and role):
        return Response({'error': _('Email and Role are required keys')},
                        status=status.HTTP_400_BAD_REQUEST)

    group = Group.objects.filter(name=role).first()
    if group is None:
        return Response({'error': _('Role does not exist')}, status=status.HTTP_400_BAD_REQUEST)
    if not can_manage_users and group.name != 'Enumerators':
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    invited_user = create_invited_user(email)
    project_role, __ = ProjectRole.objects.get_or_create(project=project, user=invited_user, group=group)
    if not invited_user.is_active:
        first_name, last_name = (name.split(' ', 1) + [''])[:2]
        invited_user.first_name = first_name
        invited_user.last_name = last_name
        invited_user.save(update_fields=['first_name', 'last_name'])
        send_user_invitation(email, user, invited_user, employment=None, project=project)

    data = {'status': _('User invited'), 'role': ProjectRoleSerializer(project_role).data}
    return Response(data, status=status.HTTP_201_CREATED)
