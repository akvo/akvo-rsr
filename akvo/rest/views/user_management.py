# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.conf import settings
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.signing import TimestampSigner
from django.core.validators import validate_email
from django.db import IntegrityError
from django.utils.encoding import force_unicode

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
    def valid_email(email_address):
        try:
            validate_email(email_address)
            return True
        except ValidationError:
            return False

    user, group, organisation = request.user, None, None
    if not user.has_perm('rsr.user_management'):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    # Check if all information is present, and if the organisation and group exist
    data, missing_data = request.DATA.get('user_data'), []
    if not data:
        return Response({'missing_data': missing_data.append(['email', 'organisation', 'group'])},
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

    # Check if the user already exists, based on the email address
    try:
        invited_user = get_user_model().objects.get(email=email)
    except get_user_model().DoesNotExist:
        try:
            invited_user = get_user_model().objects.create_user(username=email, email=email)
        except IntegrityError:
            return Response({'error': 'Trying to create a user that already exists'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if invited_user.is_active:
        # For active users, we know their email address is correct so we approve their new
        # employment immediately. They'll get a mail that their employment is approved.
        if Employment.objects.filter(user=invited_user,
                                     organisation=organisation,
                                     group=group).exists():
            employment = Employment.objects.get(user=invited_user, organisation=organisation,
                                                group=group)
            if not employment.is_approved:
                # Approve the employment
                employment.approve(user)
            else:
                # Employment already exists and is already approved
                return Response('Employment already exists', status=status.HTTP_200_OK)

        else:
            employment = Employment.objects.create(
                user=invited_user, organisation=organisation, group=group, is_approved=True
            )

            # Manual log the approval.
            # We can't use approve(), since then we would first need to create an employment that
            # is not approved, which will in turn send a 'organisation request' email.
            LogEntry.objects.log_action(
                user_id=user.pk,
                content_type_id=ContentType.objects.get_for_model(Employment).pk,
                object_id=employment.pk,
                object_repr=force_unicode(employment),
                action_flag=CHANGE,
                change_message=u'Changed is_approved, outside of admin.'
            )
    else:
        # Inactive users, need an activation email.
        employment, empl_created = Employment.objects.get_or_create(
            user=invited_user, organisation=organisation
        )
        employment.group = group
        employment.save()

        token_value = TimestampSigner().sign(email)
        token = token_value.split(':')[2]
        token_date = token_value.split(':')[1]

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
