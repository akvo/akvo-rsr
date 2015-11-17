# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Benchmark

from ..serializers import BenchmarkSerializer
from ..viewsets import PublicRSRViewSet


class BenchmarkViewSet(PublicRSRViewSet):
    """
    """
    queryset = Benchmark.objects.all()
    serializer_class = BenchmarkSerializer
    filter_fields = ('project', )
