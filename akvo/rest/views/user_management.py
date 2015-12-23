# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.signing import TimestampSigner

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from akvo.utils import rsr_send_mail
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
    data, missing_data = request.DATA.get('user_data'), []
    if not data:
        return Response({'missing_data': missing_data.append(['email', 'organisation', 'group'])},
                        status=status.HTTP_400_BAD_REQUEST)
    else:
        data = json.loads(data)

    # Check email
    # TODO: increase email checks (e.g. '@' in email)
    email = data['email'].lower().strip()
    if not email:
        missing_data.append('email')

    # Check organisation
    try:
        organisation = Organisation.objects.get(pk=int(data['organisation']))
    except (Organisation.DoesNotExist, ValueError):
        missing_data.append('organisation')

    # Check group
    try:
        group = Group.objects.get(pk=int(data['group']))
    except (Group.DoesNotExist, ValueError):
        missing_data.append('group')

    if missing_data:
        return Response({'missing_data': missing_data}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the user already exists, based on the email address
    try:
        invited_user = get_user_model().objects.get(email=email)
    except get_user_model().DoesNotExist:
        invited_user = get_user_model().objects.create_user(email, email=email)
        invited_user.set_is_active(False)

    # Link user to organisation
    employment, empl_created = Employment.objects.get_or_create(
        user=invited_user, organisation=organisation
    )

    # For existing employments, we do not change the group
    if empl_created:
        employment.group = group
    # Approve the employment
    if not employment.is_approved:
        employment.approve(user)

    # Active users automatically get an email stating that their new employment is approved
    # Inactive users should get an activation email
    if not invited_user.is_active:
        expiration_days = getattr(settings, 'ACCOUNT_ACTIVATION_DAYS', 7)

        token_value = TimestampSigner().sign(email)
        token = token_value.split(':')[2]
        token_date = token_value.split(':')[1]

        rsr_send_mail(
            [email],
            subject='registration/invite_user_subject.txt',
            message='registration/invite_user_message.txt',
            html_message='registration/invite_user_message.html',
            msg_context={
                'user': user,
                'invited_user': invited_user,
                'organisation': organisation,
                'token': token,
                'token_date': token_date,
                'expiration_days': expiration_days
            }
        )

    return Response('User invited', status=status.HTTP_201_CREATED)
