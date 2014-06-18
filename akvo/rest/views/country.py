# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from akvo.rsr.models import Country

from ..models import TastyTokenAuthentication
from ..serializers import CountrySerializer


class CountryViewSet(viewsets.ModelViewSet):
    """
    """
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication, TastyTokenAuthentication)
    permission_classes = (IsAuthenticated,)