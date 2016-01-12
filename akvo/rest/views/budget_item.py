# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import BudgetItem, CountryBudgetItem

from ..serializers import BudgetItemSerializer, CountryBudgetItemSerializer
from ..viewsets import PublicProjectViewSet


class BudgetItemViewSet(PublicProjectViewSet):
    """
    """
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer
    filter_fields = ('project', 'label', 'type', )

    def get_queryset(self, related_to='project__'):
        return super(BudgetItemViewSet, self).get_queryset(related_to)


class CountryBudgetItemViewSet(PublicProjectViewSet):
    """
    """
    queryset = CountryBudgetItem.objects.all()
    serializer_class = CountryBudgetItemSerializer
    filter_fields = ('project', 'code', )

    def get_queryset(self, related_to='project__'):
        return super(CountryBudgetItemViewSet, self).get_queryset(related_to)
