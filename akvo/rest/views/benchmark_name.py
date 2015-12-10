# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Benchmarkname

from ..serializers import BenchmarknameSerializer
from ..viewsets import PublicProjectViewSet

class BenchmarknameViewSet(PublicProjectViewSet):
    """
    """
    queryset = Benchmarkname.objects.all()
    serializer_class = BenchmarknameSerializer

    def get_queryset(self, related_to='benchmark__project__'):
        return super(BenchmarknameViewSet, self).get_queryset(related_to)
