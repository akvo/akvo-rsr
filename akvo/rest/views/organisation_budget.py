# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.serializers import (OrganisationTotalBudgetSerializer,
                                   OrganisationTotalBudgetLineSerializer,
                                   OrganisationRecipientOrgBudgetSerializer,
                                   OrganisationRecipientOrgBudgetLineSerializer,
                                   OrganisationRegionBudgetSerializer,
                                   OrganisationRegionBudgetLineSerializer,
                                   OrganisationCountryBudgetSerializer,
                                   OrganisationCountryBudgetLineSerializer,
                                   OrganisationTotalExpenditureSerializer,
                                   OrganisationExpenseLineSerializer)
from akvo.rest.viewsets import BaseRSRViewSet
from akvo.rsr.models import (OrganisationTotalBudget, OrganisationTotalBudgetLine,
                             OrganisationRecipientOrgBudget, OrganisationRecipientOrgBudgetLine,
                             OrganisationRegionBudget, OrganisationRegionBudgetLine,
                             OrganisationCountryBudget, OrganisationCountryBudgetLine,
                             OrganisationTotalExpenditure, OrganisationExpenseLine)


class OrganisationTotalBudgetViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation total budgets to be viewed or edited.
    """
    queryset = OrganisationTotalBudget.objects.all()
    serializer_class = OrganisationTotalBudgetSerializer


class OrganisationTotalBudgetLineViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation total budget lines to be viewed or edited.
    """
    queryset = OrganisationTotalBudgetLine.objects.all()
    serializer_class = OrganisationTotalBudgetLineSerializer


class OrganisationRecipientOrgBudgetViewSet(BaseRSRViewSet):
    """
    API endpoint that allows recipient organisation budgets to be viewed or edited.
    """
    queryset = OrganisationRecipientOrgBudget.objects.all()
    serializer_class = OrganisationRecipientOrgBudgetSerializer


class OrganisationRecipientOrgBudgetLineViewSet(BaseRSRViewSet):
    """
    API endpoint that allows recipient organisation budget lines to be viewed or edited.
    """
    queryset = OrganisationRecipientOrgBudgetLine.objects.all()
    serializer_class = OrganisationRecipientOrgBudgetLineSerializer


class OrganisationRegionBudgetViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation region budgets to be viewed or edited.
    """
    queryset = OrganisationRegionBudget.objects.all()
    serializer_class = OrganisationRegionBudgetSerializer


class OrganisationRegionBudgetLineViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation region budget lines to be viewed or edited.
    """
    queryset = OrganisationRegionBudgetLine.objects.all()
    serializer_class = OrganisationRegionBudgetLineSerializer


class OrganisationCountryBudgetViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation country budgets to be viewed or edited.
    """
    queryset = OrganisationCountryBudget.objects.all()
    serializer_class = OrganisationCountryBudgetSerializer


class OrganisationCountryBudgetLineViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation country budget lines to be viewed or edited.
    """
    queryset = OrganisationCountryBudgetLine.objects.all()
    serializer_class = OrganisationCountryBudgetLineSerializer


class OrganisationTotalExpenditureViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation total expenditures to be viewed or edited.
    """
    queryset = OrganisationTotalExpenditure.objects.all()
    serializer_class = OrganisationTotalExpenditureSerializer


class OrganisationExpenseLineViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation expense lines to be viewed or edited.
    """
    queryset = OrganisationExpenseLine.objects.all()
    serializer_class = OrganisationExpenseLineSerializer
