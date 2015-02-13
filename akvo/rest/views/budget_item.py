# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import BudgetItem

from ..serializers import BudgetItemSerializer
from ..viewsets import BaseRSRViewSet


class BudgetItemViewSet(BaseRSRViewSet):
    """
    """
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer
    filter_fields = ('project', 'label', 'type', )
