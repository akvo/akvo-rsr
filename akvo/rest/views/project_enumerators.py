# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import datetime

from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils.timezone import now as tz_now
from request_token.models import RequestToken
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response

from akvo.constants import JWT_WEB_FORMS_SCOPE, JWT_MAX_USE
from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, Indicator, IndicatorPeriod, User
from akvo.utils import rsr_send_mail


@api_view(["GET", "PATCH"])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_enumerators(request, project_pk):
    queryset = Project.objects.prefetch_related("results")
    project = get_object_or_404(queryset, pk=project_pk)
    if not request.user.has_perm("rsr.view_project", project):
        raise Http404

    indicator_ids = set(
        Indicator.objects.filter(result__project=project).values_list("pk", flat=True)
    )
    if request.method == "PATCH":
        data = request.data

        # Look for incorrect indicator IDs and fail
        incorrect_ids = set()
        for enumerator in data:
            incorrect_ids.update(set(enumerator['indicators']) - indicator_ids)

        if incorrect_ids:
            ids = ", ".join(sorted(incorrect_ids))
            response = {
                "error": f"Indicators with id(s) -- {ids} -- are not associated with project {project_pk}"
            }
            return Response(response, status=400)

        # Look for incorrect users and fail
        incorrect_emails = set()
        for enumerator in data:
            email = enumerator['email']
            try:
                user = User.objects.get(email__iexact=email)
                enumerator['user'] = user
            except User.DoesNotExist:
                incorrect_emails.add(email)
            else:
                if not user.has_perm('rsr.add_indicatorperioddata', project):
                    incorrect_emails.add(email)

        if incorrect_emails:
            ids = ", ".join(sorted(incorrect_emails))
            response = {
                "error": f"Users with emails(s) -- {ids} -- do not exist or don't have permissions for project {project_pk}"
            }
            return Response(response, status=400)

        for enumerator in data:
            _assign_indicators(enumerator['user'], set(enumerator['indicators']))

    indicators = Indicator.objects.filter(result__project=project)
    data = _get_enumerators(project, indicators)
    return Response(data)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def assignment_send(request, project_pk):
    queryset = Project.objects.prefetch_related("results")
    project = get_object_or_404(queryset, pk=project_pk)
    if not request.user.has_perm("rsr.view_project", project):
        raise Http404

    unlocked_period_indicators = IndicatorPeriod.objects\
                                                .filter(indicator__result__project=project, locked=False)\
                                                .values_list("indicator", flat=True)

    emails = request.data.get('emails', [])

    assigned_enumerators = User.objects.filter(assigned_indicators__in=unlocked_period_indicators,
                                               email__in=emails).distinct()\
                                       .values_list('id', 'email')

    email_context = dict(
        title=project.title,
        results_url=request.build_absolute_uri(f'/my-rsr/projects/{project.pk}/results')
    )
    for user_id, email in assigned_enumerators:
        _send_assignment_email(user_id, project.pk, email, email_context)

    data = dict(status='success', emails=sorted(email for _, email in assigned_enumerators))
    return Response(data)


def _get_enumerators(project, indicators):
    assigned_enumerators = User.objects.filter(assigned_indicators__in=indicators)\
                                       .prefetch_related('assigned_indicators').distinct()
    data = []
    for e in assigned_enumerators:
        enumerator_data = {
            "email": e.email,
            "name": e.get_full_name(),
            "indicators": [i.pk for i in e.assigned_indicators.all()]
        }
        token = e.request_tokens.order_by('-issued_at').first()
        date_sent = token.data.get(str(project.pk), None) if token is not None else None
        enumerator_data['date_sent'] = date_sent
        data.append(enumerator_data)

    assigned_emails = {e.email for e in assigned_enumerators}
    enumerators = project.users_with_access('Enumerators')\
                         .only('pk', 'email', 'first_name', 'last_name')
    for enumerator in enumerators:
        if enumerator.email not in assigned_emails:
            enumerator_data = dict(email=enumerator.email,
                                   name=enumerator.get_full_name(),
                                   indicators=[])
            data.append(enumerator_data)
    return data


def _assign_indicators(enumerator, indicator_ids):
    assigned_indicators = set(enumerator.assigned_indicators.values_list('pk', flat=True))

    to_remove = assigned_indicators - indicator_ids
    to_add = indicator_ids - assigned_indicators

    for pk in to_add:
        enumerator.assigned_indicators.add(pk)

    for pk in to_remove:
        enumerator.assigned_indicators.remove(pk)


def _update_user_token(user_id, project_id):
    token = RequestToken.objects.filter(scope=JWT_WEB_FORMS_SCOPE, user_id=user_id).first()
    issued_at = tz_now()
    expiration_time = issued_at + datetime.timedelta(days=365)
    data = {str(project_id): issued_at.isoformat()}
    if token is None:
        token = RequestToken.objects.create_token(
            scope=JWT_WEB_FORMS_SCOPE,
            login_mode=RequestToken.LOGIN_MODE_REQUEST,
            user_id=user_id,
            max_uses=JWT_MAX_USE,
            expiration_time=expiration_time,
            data=data,
        )
    else:
        token.expiration_time = expiration_time
        token.max_uses += JWT_MAX_USE
        token.data.update(data)
        token.save(update_fields=['max_uses', 'expiration_time', 'data'])
    return token


def _send_assignment_email(user_id, project_id, email, context, use_new_token=True):
    token = _update_user_token(user_id, project_id)
    jwt = token.jwt()
    results_url = context['results_url']
    context['url'] = f"{results_url}/?rt={jwt}"
    rsr_send_mail([email],
                  subject='enumerators/assignment_subject.txt',
                  message='enumerators/assignment_message.txt',
                  subject_context=context,
                  msg_context=context)
