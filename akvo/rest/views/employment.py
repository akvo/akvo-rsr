# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.contrib.auth.models import Group
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from akvo.rsr.models import Employment, Organisation, User, Project, ProjectRole, Partnership
from ..serializers import EmploymentSerializer
from ..viewsets import BaseRSRViewSet
from .utils import create_invited_user
from .user_management import employ_user, valid_email


class EmploymentViewSet(BaseRSRViewSet):

    """Employment resource."""

    queryset = Employment.objects.select_related('organisation')
    serializer_class = EmploymentSerializer


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def set_group(request, pk=None, group_id=None):
    employment = Employment.objects.get(pk=pk)
    group = Group.objects.get(pk=group_id)
    user = request.user

    if not user.has_perm('rsr.change_employment', employment):
        raise PermissionDenied

    employment.group = group
    try:
        employment.save()
    except IntegrityError:
        return Response({'status': 'group not set', 'error': 'Employment already exists.'},
                        status=status.HTTP_400_BAD_REQUEST)

    return Response({'status': 'group set'})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def managed_employments(request):
    user = request.user
    admin_orgs = (
        user.user_management_organisations()
        if not (user.is_admin or user.is_superuser)
        else Organisation.objects.all()
    )
    members = {}
    data = [
        {'id': org.id, 'name': org.name, 'members': organisation_members(org)}
        for org in admin_orgs
    ]
    for org in data:
        for member in org['members']:
            entry = members.setdefault(member['email'],
                                       {'email': member['email'],
                                        'id': member['id'],
                                        'name': member['name']})
            organisations = entry.setdefault('organisations', {})
            organisations[org['id']] = {
                'id': org['id'], 'name': org['name'], 'role': member['role']}

    projects = Project.objects.filter(
        use_project_roles=True,
        partnerships__organisation__in=admin_orgs,
        partnerships__iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION)
    roles = ProjectRole.objects.filter(project__in=projects).distinct().values(
        'user__email', 'user__id', 'user__first_name', 'user__last_name', 'project__id',
        'project__title', 'group__name', )

    project_roles = {}
    for role in roles:
        user = project_roles.setdefault(
            role['user__email'],
            {'email': role['user__email'], 'id': role['user__id'], 'name':
             f'{role["user__first_name"]} {role["user__last_name"]}', 'projects': {}})
        user_roles = user['projects']
        project_id = role['project__id']
        project_title = role['project__title']
        group_name = role['group__name']
        user_project_roles = user_roles.setdefault(
            project_id,
            {'id': project_id, 'title': project_title, 'role': []})
        user_project_roles['role'].append(group_name)

    managed_users = project_roles
    for email, member in members.items():
        if email in managed_users:
            managed_users[email]['organisations'] = member['organisations']
        else:
            managed_users[email] = member

    return Response(managed_users)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def organisations_members(request):
    organisation_ids = request.GET.get('orgs', '[]')
    try:
        org_ids = json.loads(organisation_ids)
    except json.JSONDecodeError:
        org_ids = []
    if not org_ids:
        return Response({'error': 'Please provide list of organisation IDs query parameter.'},
                        status=status.HTTP_400_BAD_REQUEST)
    data = [
        {"id": organisation.id, "members": organisation_members(organisation)}
        for organisation in Organisation.objects.filter(pk__in=org_ids)
    ]
    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated, ))
def organisation_user_roles(request, pk=None):
    """End point for Organisation User Roles."""
    organisation = get_object_or_404(Organisation, pk=pk)

    if request.method == 'POST':
        inviting_user = request.user
        if not inviting_user.has_perm('rsr.change_employment', organisation):
            raise PermissionDenied

        email = request.data.get('email', '').lower().strip()
        if not (email and valid_email(email)):
            return Response({'error': _("Please use a valid email ID")},
                            status=status.HTTP_400_BAD_REQUEST)

        group_names = request.data.get('role', [])
        groups = Group.objects.filter(name__in=group_names)
        if len(group_names) != len(groups):
            return Response({'error': _('Please use valid group names')},
                            status=status.HTTP_400_BAD_REQUEST)

        invited_user = create_invited_user(email)
        if invited_user is None:
            return Response({'error': _('Trying to create a user that already exists')},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        name = request.data.get('name', '').strip()
        if name and invited_user.get_full_name() != name:
            invited_user.first_name, invited_user.last_name = (name.split(' ', 1) + [''])[:2]
            invited_user.save(update_fields=['first_name', 'last_name'])

        for group in groups:
            employ_user(invited_user, organisation, group, inviting_user)

        data = user_employment_data(invited_user, organisation)
        return Response(data, status=201)

    else:
        return Response(organisation_members(organisation), status=200)


@api_view(['PATCH', 'DELETE'])
@permission_classes((IsAuthenticated, ))
def change_user_roles(request, org_pk=None, user_pk=None):
    """End point for Organisation User Roles."""
    organisation = get_object_or_404(Organisation, pk=org_pk)
    user = get_object_or_404(User, pk=user_pk)

    if not request.user.has_perm('rsr.change_employment', organisation):
        raise PermissionDenied

    if request.method == 'DELETE':
        group_names = set()
    else:
        group_names = set(request.data.get('role', []))

    groups = Group.objects.filter(name__in=group_names)
    if len(group_names) != len(groups):
        return Response({'error': _('Please use valid group names')},
                        status=status.HTTP_400_BAD_REQUEST)
    employments = Employment.objects.select_related('group')\
                                    .filter(user=user, organisation=organisation)
    existing_roles = {employment.group.name for employment in employments}

    # Delete removed roles
    for employment in employments:
        if employment.group not in group_names:
            employment.delete()

    # Add new roles
    for role in group_names:
        if role not in existing_roles:
            group = Group.objects.get(name=role)
            employ_user(user, organisation, group, request.user)

    data = user_employment_data(user, organisation)
    return Response(data)


def user_employment_data(user, organisation):
    user_roles = list(
        organisation.employees.filter(user=user).order_by('group__name')
        .values_list('group__name', flat=True).distinct()
    )
    data = {
        'email': user.email,
        'id': user.id,
        'name': user.get_full_name(),
        'role': user_roles
    }
    return data


def organisation_members(organisation):
    employments = organisation.employees.values(
        'user__email', 'user__id', 'user__first_name', 'user__last_name', 'group__name'
    ).distinct()

    members = {}
    for employment in employments:
        email = employment['user__email']
        group_name = employment['group__name']
        user_name = '{} {}'.format(employment['user__first_name'], employment['user__last_name'])
        member = members.setdefault(email, {})
        if not member:
            member['email'] = email
            member['id'] = employment['user__id']
            member['role'] = [group_name]
            member['name'] = user_name
        else:
            member['role'].append(group_name)

    return list(members.values())
