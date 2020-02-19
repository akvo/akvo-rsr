# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.contrib.auth.models import Group
from django.db import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from akvo.rsr.models import Employment, Organisation
from ..serializers import EmploymentSerializer
from ..viewsets import BaseRSRViewSet


class EmploymentViewSet(BaseRSRViewSet):

    """Employment resource."""

    queryset = Employment.objects.select_related('organisation')
    serializer_class = EmploymentSerializer


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def approve_employment(request, pk=None):
    employment = Employment.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_employment', employment):
        raise PermissionDenied

    employment.approve(user)

    return Response({'status': 'employment approved'})


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


def organisation_members(organisation):
    employments = organisation.employees.select_related('user', 'group')\
                                        .order_by('user__pk').distinct()
    members = {}
    for employment in employments:
        member = members.setdefault(employment.user.email, {})
        if not member:
            member['email'] = employment.user.email
            member['id'] = employment.user.pk
            member['role'] = [employment.group.name]
            member['name'] = employment.user.get_full_name()
        else:
            member['role'].append(employment.group.name)

    return list(members.values())
