# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import viewsets

from .serializers import OrganisationSerializer

from akvo.rsr.models import Organisation

class OrganisationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organisations to be viewed or edited.
    """
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
class OrganisationLocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organisations to be viewed or edited.
    """
    queryset = OrganisationLocation.objects.all()
    serializer_class = OrganisationLocationSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication, TastyTokenAuthentication)
    permission_classes = (IsAuthenticated,)


class InternalOrganisationIDViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organisations to be viewed or edited.
    """
    serializer_class = InternalOrganisationIDSerializer
    queryset = InternalOrganisationID.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication, TastyTokenAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        filter on recording org and/or identifier
        """
        queryset = self.queryset
        recording_org = self.request.QUERY_PARAMS.get('recording_org', None)
        identifier = self.request.QUERY_PARAMS.get('identifier', None)
        filter_params = {}
        if recording_org is not None:
            filter_params.update(recording_org__id=recording_org)
        if identifier is not None:
            filter_params.update(identifier=identifier)
        if filter:
            queryset = queryset.filter(**filter_params)
        return queryset


#class CountryViewSet(viewsets.ModelViewSet):
#    """
#    API endpoint that allows organisations to be viewed or edited.
#    """
#    queryset = Country.objects.all()
#    serializer_class = CountrySerializer