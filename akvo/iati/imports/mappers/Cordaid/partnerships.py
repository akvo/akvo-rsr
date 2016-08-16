# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .....rsr.models.organisation import Organisation
from .....rsr.models.partnership import Partnership
from ... import akvo_ns
from ..partnerships import Partnerships
from .financials import BudgetItems

ROLE_TO_CODE = {
    'accountable': 2,
    'extending': 3,
    'funding': 1,
    'implementing': 4
}

CORDAID = 'Cordaid'
CORDAID_ORG_ID = 273
OTHERS = 'Others'
OTHERS_ORG_ID = 1653


class Partnerships(Partnerships):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(Partnerships, self).__init__(
                iati_import_job, parent_elem, project, globals, related_obj)
        self._imported_partnerships = []
        self._changes = []

    def get_or_create_partnership(self, organisation, iati_organisation_role, funding_amount=None):

        partnership_obj, created = Partnership.objects.get_or_create(
            project=self.project,
            organisation=organisation,
            iati_organisation_role=iati_organisation_role,
            funding_amount=funding_amount
        )
        if created:
            self._changes.append(u'added partnership (id: {}): {}'.format(
                partnership_obj.pk, partnership_obj))
        self._imported_partnerships.append(partnership_obj)

    def add_funding_partner(self, budget_from):
        """
        The funding partners for Cordaid are based on one or two <budget> tags.
        They are distinguished via the avko:budget-from attribute to determine if the funing partner
        is Cordaid (CORDAID_ORG_ID) Others (OTHERS_ORG_ID)
        :param budget_from: string; "Cordaid" or "Others"
        :return:
        """
        assert budget_from == "Cordaid" or budget_from == "Others", (
                "akvo:budget-from value incorrect: {}".format(budget_from))

        budget_items = BudgetItems(self.iati_import_job, self.parent_elem, self.project,
                                   self.globals)
        budget = budget_items.get_budget(budget_from)
        amount = budget['amount'] if budget['amount'] else None
        if budget_from == CORDAID:
            organisation = Organisation.objects.get(pk=CORDAID_ORG_ID)
        else:
            organisation = Organisation.objects.get(pk=OTHERS_ORG_ID)
        self.get_or_create_partnership(organisation, Partnership.IATI_FUNDING_PARTNER, amount)

    def do_import(self):
        """
        Set up the custom Cordaid partnerships.
        :return: List; contains fields that have changed
        """
        # "Regular" partners
        for partnership in self.parent_elem.findall('participating-org'):

            # TODO: add internal-org-ref lookup
            org_ref = self.get_attrib(partnership, 'ref', None)
            org_name = self.get_text(partnership)
            organisation = self.get_or_create_organisation(org_ref, org_name)

            organisation_role = partnership.get('role', None)
            if organisation_role and organisation_role.lower() in ROLE_TO_CODE:
                organisation_role = ROLE_TO_CODE[organisation_role.lower()]
            elif organisation_role:
                try:
                    organisation_role = int(organisation_role)
                except ValueError as e:
                    organisation_role = None
                    self.add_log('role', 'iati_organisation_role', str(e))

            if not (organisation and organisation_role):
                self.add_log('participating-org', 'participating_org',
                             'participating organisation or role missing')
                continue

            self.get_or_create_partnership(organisation, organisation_role, None)

        # Cordaid funding partners.
        self.add_funding_partner(CORDAID)
        self.add_funding_partner(OTHERS)

        self._changes += self.delete_objects(
                self.project.partnerships.filter(
                    iati_organisation_role__lt=Partnership.AKVO_SPONSOR_PARTNER),
                self._imported_partnerships, 'partnership')

        return self._changes
