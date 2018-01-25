# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.core.signing import TimestampSigner
from django.core.validators import validate_email
from django.db import IntegrityError

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from akvo.utils import rsr_send_mail
from ...rsr.models import Employment, Organisation


def valid_email(email_address):
    try:
        validate_email(email_address)
        return True
    except ValidationError:
        return False


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def invite_user(request):
    """
    Invite a new user to RSR.

    :param request; request.data is a JSON string containing email, organisation and group data
    """

    user = request.user
    if not user.has_perm('rsr.user_management'):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    # Check if all information is present, and if the organisation and group exist
    data, missing_data = request.data.get('user_data'), []
    if not data:
        missing_data.append('email', 'organisation', 'group')
        return Response({'missing_data': missing_data},
                        status=status.HTTP_400_BAD_REQUEST)
    else:
        data = json.loads(data)

    # Check organisation
    try:
        organisation = Organisation.objects.get(pk=int(data['organisation']))
    except (Organisation.DoesNotExist, ValueError):
        missing_data.append('organisation')

    # Check email
    email = data['email'].lower().strip()
    if not (email and valid_email(email)):
        missing_data.append('email')
    elif user.email == email and organisation:
        # Only superusers, RSR admins and organisation admins can invite themselves
        if not (user.is_admin or user.is_superuser):
            admin_group = Group.objects.get(name='Admins')
            content_owned = []
            for empl in Employment.objects.filter(user=user, group=admin_group).exclude(
                    organisation=None):
                content_owned += empl.organisation.content_owned_organisations()
            if organisation not in content_owned:
                missing_data.append('email')

    # Check group
    try:
        group = Group.objects.get(pk=int(data['group']))
    except (Group.DoesNotExist, ValueError):
        missing_data.append('group')

    if missing_data:
        return Response({'missing_data': missing_data}, status=status.HTTP_400_BAD_REQUEST)

    User = get_user_model()

    # Check if the user already exists, based on the email address
    try:
        invited_user = User.objects.get(email=email)
    except User.DoesNotExist:
        try:
            invited_user = User.objects.create_user(username=email, email=email)
        except IntegrityError:
            return Response({'error': 'Trying to create a user that already exists'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if invited_user.is_active:
        # For active users, we know their email address is correct so we approve their new
        # employment immediately. They'll get a mail that their employment is approved.

        employment, created = Employment.objects.get_or_create(
            user=invited_user,
            organisation=organisation,
            group=group,
            # NOTE: Create approved employment to avoid sending 'organisation request' mail
            defaults=dict(is_approved=True)
        )

        if created:
            # HACK: We force approve to log, instead of manually logging.
            # Creating an unapproved employment, to start with, isn't ideal
            # since this would send approval requests to a bunch of users with
            # the permissions to approve.
            employment.is_approved = False
            employment.approve(user)

        elif not employment.is_approved:
            # Approve the existing unapproved employment
            employment.approve(user)

        else:
            return Response('Employment already exists', status=status.HTTP_200_OK)

    else:
        # Create an unapproved employment for inactive users
        employment, _ = Employment.objects.get_or_create(
            user=invited_user,
            organisation=organisation,
            group=group,
        )

        # Send an activation email
        _, token_date, token = TimestampSigner().sign(email).split(':')

        rsr_send_mail(
            [email],
            subject='registration/invited_user_subject.txt',
            message='registration/invited_user_message.txt',
            html_message='registration/invited_user_message.html',
            msg_context={
                'user': user,
                'invited_user': invited_user,
                'employment': employment,
                'token': token,
                'token_date': token_date,
            }
        )

    return Response('User invited', status=status.HTTP_201_CREATED)
