# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from akvo.rsr.models import Sector
from akvo.codelists.store.codelists_v203 import SECTOR_CATEGORY
from akvo.utils import codelist_choices
from ..serializers import SectorSerializer
from ..viewsets import PublicProjectViewSet


class SectorViewSet(PublicProjectViewSet):

    """."""

    queryset = Sector.objects.all()
    serializer_class = SectorSerializer


@api_view(['GET'])
def sector_codes(request: Request):
    sectors = [
        {'id': id_, 'name': name}
        for id_, name in codelist_choices(SECTOR_CATEGORY)
    ]
    return Response(sectors)
