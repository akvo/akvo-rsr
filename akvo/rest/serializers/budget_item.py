# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from .budget_item_label import BudgetItemLabelSerializer
from akvo.rsr.models import BudgetItem, CountryBudgetItem

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class BudgetItemRawSerializer(BaseRSRSerializer):

    class Meta:
        model = BudgetItem


class BudgetItemRawDeepSerializer(BudgetItemRawSerializer):

    label = BudgetItemLabelSerializer(source='label')


class BudgetItemSerializer(BudgetItemRawSerializer):

    label_label = serializers.ReadOnlyField(source='get_label')
    type_label = serializers.ReadOnlyField(source='iati_type')
    currency_label = serializers.ReadOnlyField(source='iati_currency')
    status_label = serializers.ReadOnlyField(source='iati_status')


class CountryBudgetItemSerializer(BaseRSRSerializer):

    code_label = serializers.ReadOnlyField(source='iati_code')

    class Meta:
        model = CountryBudgetItem
