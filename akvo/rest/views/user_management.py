# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...rsr.models import Employment, Organisation


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def invite_user(request):
    """
    Invite a new user to RSR.

    :param request; request.DATA is a JSON string containing email, organisation and group data
    """
    user = request.user
    if not user.has_perm('rsr.user_management'):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    # Check if all information is present, and if the organisation and group exist
    data = request.DATA.get('user_data')
    if not data:
        return Response('User data missing', status=status.HTTP_400_BAD_REQUEST)
    else:
        data = json.loads(data)

    email = data['email']
    try:
        organisation = Organisation.objects.get(pk=int(data['organisation']))
    except Organisation.DoesNotExist:
        return Response('Organisation does not exist', status=status.HTTP_400_BAD_REQUEST)
    try:
        group = Group.objects.get(pk=int(data['group']))
    except Group.DoesNotExist:
        return Response('Group does not exist', status=status.HTTP_400_BAD_REQUEST)

    if not (email or organisation or group):
        return Response('Information missing', status=status.HTTP_400_BAD_REQUEST)

    # Check if the user already exists, based on the email address
    try:
        invited_user = get_user_model().objects.get(email=email)
        user_created = False
    except get_user_model().DoesNotExist:
        invited_user = get_user_model().objects.create_user(email, email=email)
        user_created = True

    # Link user to organisation
    employment, empl_created = Employment.objects.get_or_create(
        user=invited_user, organisation=organisation
    )
    if empl_created:
        employment.group = group
        employment.is_approved = True
        employment.save()

    # TODO: Send emails

    return Response('User invited', status=status.HTTP_201_CREATED)
