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
    # need to select_related project to keep call to BudgetItem.iati_currency_unicode() speedy
    queryset = BudgetItem.objects.all().select_related('project')
    serializer_class = BudgetItemSerializer


class CountryBudgetItemViewSet(PublicProjectViewSet):
    """
    """
    queryset = CountryBudgetItem.objects.all()
    serializer_class = CountryBudgetItemSerializer

