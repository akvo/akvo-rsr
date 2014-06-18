# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import BudgetItem


class BudgetItemSerializer(serializers.HyperlinkedModelSerializer):
    # project = ProjectSerializer(many=True, required=False)
    # label = BudgetItemLabelSerializer(many=True, required=False)

    class Meta:
        model = BudgetItem
        fields = (
            # TODO: related fields
            # 'project',
            # 'label',
            'other_extra',
            'amount',
        )
