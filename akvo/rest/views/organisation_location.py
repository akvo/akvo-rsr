# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import OrganisationLocation
from ..serializers import OrganisationLocationSerializer, MapOrganisationLocationSerializer
from ..viewsets import BaseRSRViewSet


class OrganisationLocationViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation locations to be viewed or edited.
    """
    queryset = OrganisationLocation.objects.all()
    serializer_class = OrganisationLocationSerializer


class MapOrganisationLocationViewSet(BaseRSRViewSet):

    """Returns a resource tailored for generating a map of organisation locations.

    Allowed parameters are:
    limit (default 100 / max 500),
    location_target (filter on organisation ID), and
    country (filter on country ID)
    """

    filter_fields = ('location_target', 'country')
    max_paginate_by = 500
    paginate_by = 100
    queryset = OrganisationLocation.objects.select_related(
        'location_target', 'country').only(
            'id', 'latitude', 'longitude',
            'location_target__id', 'location_target__name',
            'location_target__logo',
            'country')
    serializer_class = MapOrganisationLocationSerializer
