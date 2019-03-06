# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import (OrganisationCountryBudget, OrganisationCountryBudgetLine,
                             OrganisationExpenseLine, OrganisationRecipientOrgBudget,
                             OrganisationRecipientOrgBudgetLine, OrganisationRegionBudget,
                             OrganisationRegionBudgetLine, OrganisationTotalBudget,
                             OrganisationTotalBudgetLine, OrganisationTotalExpenditure)


class OrganisationCountryBudgetLineSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = OrganisationCountryBudgetLine


class OrganisationCountryBudgetSerializer(BaseRSRSerializer):

    budget_lines = OrganisationCountryBudgetLineSerializer(many=True, required=False)

    class Meta:
        fields = '__all__'
        model = OrganisationCountryBudget


class OrganisationRecipientOrgBudgetLineSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = OrganisationRecipientOrgBudgetLine


class OrganisationRecipientOrgBudgetSerializer(BaseRSRSerializer):

    budget_lines = OrganisationRecipientOrgBudgetLineSerializer(many=True, required=False)

    class Meta:
        fields = '__all__'
        model = OrganisationRecipientOrgBudget


class OrganisationRegionBudgetLineSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = OrganisationRegionBudgetLine


class OrganisationRegionBudgetSerializer(BaseRSRSerializer):

    budget_lines = OrganisationRegionBudgetLineSerializer(many=True, required=False)

    class Meta:
        fields = '__all__'
        model = OrganisationRegionBudget


class OrganisationTotalBudgetLineSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = OrganisationTotalBudgetLine


class OrganisationTotalBudgetSerializer(BaseRSRSerializer):

    budget_lines = OrganisationTotalBudgetLineSerializer(many=True, required=False)

    class Meta:
        fields = '__all__'
        model = OrganisationTotalBudget


class OrganisationExpenseLineSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = OrganisationExpenseLine


class OrganisationTotalExpenditureSerializer(BaseRSRSerializer):

    budget_lines = OrganisationExpenseLineSerializer(source='expense_lines', many=True, required=False)

    class Meta:
        fields = '__all__'
        model = OrganisationTotalExpenditure
