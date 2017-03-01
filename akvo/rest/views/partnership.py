# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Partnership

from ..serializers import PartnershipSerializer, PartnershipBasicSerializer
from ..viewsets import PublicProjectViewSet


class PartnershipViewSet(PublicProjectViewSet):
    """
    """
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer

    def get_queryset(self):
        """Allow filtering on partner_type."""
        partner_type = self.request.query_params.get('partner_type', None)
        if partner_type and partner_type in Partnership.PARTNER_TYPES_TO_ROLES_MAP.keys():
            self.queryset = self.queryset.filter(
                iati_organisation_role=Partnership.PARTNER_TYPES_TO_ROLES_MAP[partner_type]
            ).distinct()
        return super(PartnershipViewSet, self).get_queryset()


class PartnershipMoreLinkViewSet(PublicProjectViewSet):
    """
    Specific endpoint for the '+X partners' links in RSR. Contains the name, long name and logo of
    an organisation and the partnership role.
    """
    queryset = Partnership.objects.all()
    serializer_class = PartnershipBasicSerializer
