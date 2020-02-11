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
from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import Project, ProjectRole, User
from akvo.rest.serializers import (
    OrganisationBasicSerializer,
    ProjectRoleSerializer,
)


Role = namedtuple("Role", ("email", "role"))


def is_reporting_org_admin(user, project):
    reporting_org = project.reporting_org
    if reporting_org is None:
        return False

    org_ids = {org.id for org in user.get_admin_employment_orgs()}
    return reporting_org.pk in org_ids


@api_view(["GET", "PATCH"])
@login_required
def project_roles(request, project_pk):
    user = request.user
    try:
        project = Project.objects.get(id=project_pk)
    except Project.DoesNotExist:
        raise Http404

    if not (
        user.is_admin
        or user.is_superuser
        or is_reporting_org_admin(user, project)
    ):
        raise PermissionDenied

    status = 200
    if request.method == "PATCH":
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
        new_roles = {Role(**role) for role in roles}
        existing_roles = {
            Role(*role)
            for role in project.projectrole_set.values_list(
                "user__email", "group__name"
            ).distinct()
        }

        with transaction.atomic():
            # Set use_project_roles flag, if not already set
            if not project.use_project_roles:
                project.use_project_roles = True
                project.save(update_fields=["use_project_roles"])

            # Delete roles
            for project_role in existing_roles - new_roles:
                ProjectRole.objects.filter(
                    project=project,
                    user__email=project_role.email,
                    group__name=project_role.role,
                ).delete()

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
