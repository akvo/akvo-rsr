# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import InternalOrganisationID

from ..serializers import InternalOrganisationIDSerializer
from ..viewsets import BaseRSRViewSet


class InternalOrganisationIDViewSet(BaseRSRViewSet):
    """
    API endpoint that allows internal organisation IDs to be viewed or edited.
    """
    serializer_class = InternalOrganisationIDSerializer
    queryset = InternalOrganisationID.objects.all()
    filter_fields = ('recording_org', 'referenced_org', 'identifier', )

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