# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import PlannedDisbursement

from ..serializers import PlannedDisbursementSerializer
from ..viewsets import PublicProjectViewSet


class PlannedDisbursementViewSet(PublicProjectViewSet):
    """
    """
    queryset = PlannedDisbursement.objects.all()
    serializer_class = PlannedDisbursementSerializer
    filter_fields = ('project', 'currency', 'type', )

    def get_queryset(self, related_to='project__'):
        return super(PlannedDisbursementViewSet, self).get_queryset(related_to)
