# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response

from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, Indicator, User


@api_view(["GET", "PATCH"])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_enumerators(request, pk):
    queryset = Project.objects.prefetch_related("results")
    project = get_object_or_404(queryset, pk=pk)
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
                "error": f"Indicators with id(s) -- {ids} -- are not associated with project {pk}"
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
                "error": f"Users with emails(s) -- {ids} -- do not exist or don't have permissions for project {pk}"
            }
            return Response(response, status=400)

        for enumerator in data:
            _assign_indicators(enumerator['user'], set(enumerator['indicators']))

    indicators = Indicator.objects.filter(result__project=project)
    data = _get_enumerators(project, indicators)
    return Response(data)


def _get_enumerators(project, indicators):
    assigned_enumerators = User.objects.filter(assigned_indicators__in=indicators)\
                                       .prefetch_related('assigned_indicators').distinct()
    data = [
        {"email": e.email,
         "name": e.get_full_name(),
         "indicators": [i.pk for i in e.assigned_indicators.all()]}
        for e in assigned_enumerators
    ]
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
