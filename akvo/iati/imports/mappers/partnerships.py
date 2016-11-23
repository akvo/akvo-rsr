# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.partnership import Partnership
from .. import ImportMapper, akvo_ns


ROLE_TO_CODE = {
    'accountable': 2,
    'extending': 3,
    'funding': 1,
    'implementing': 4
}


class Partnerships(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Partnerships, self).__init__(
            iati_import_job, parent_elem, project, globals, related_obj)
        self.model = Partnership

    def do_import(self):
        """
        Retrieve and store the partnerships.
        The partnerships will be extracted from the 'participating-org' elements. Since it is not
        possible in the IATI standard to supply the funding amount for a funding partner, this value
        is calculated by taking the total budget of the project and dividing that by the number of
        funding partners.

        :return: List; contains fields that have changed
        """
        imported_partnerships = []
        changes = []
        funding_amount_present = False

        # Check if import should ignore this kind of data
        if self.skip_importing('participating-org'):
            return changes

        for partnership in self.parent_elem.findall('participating-org'):

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

            iati_activity_id = self.get_attrib(partnership, 'activity-id', 'iati_activity_id')

            funding_amount = self.get_attrib(
                    partnership, akvo_ns('funding-amount'), 'funding_amount', None)
            if funding_amount:
                funding_amount_present = True
                funding_amount = self.cast_to_decimal(
                        funding_amount, 'participating-org', 'funding_amount')

            if not (organisation and organisation_role):
                self.add_log('participating-org', 'participating_org',
                             'participating organisation or role missing')
                continue

            partnership_obj, created = Partnership.objects.get_or_create(
                project=self.project,
                organisation=organisation,
                iati_organisation_role=organisation_role,
                iati_activity_id=iati_activity_id,
                funding_amount=funding_amount
            )
            if created:
                changes.append(u'added partnership (id: {}): {}'.format(
                        partnership_obj.pk, partnership_obj))
            imported_partnerships.append(partnership_obj)

        changes += self.delete_objects(
                self.project.partnerships.filter(iati_organisation_role__lt=100),
                imported_partnerships, 'partnership')

        if not funding_amount_present:
            funding_partners = self.project.partnerships.filter(iati_organisation_role=1)
            total_budget = self.project.budget

            if funding_partners.count() > 0 and total_budget > 0:
                average_budget = total_budget / funding_partners.count()
                for funding_partner in funding_partners:
                    if funding_partner.funding_amount != average_budget:
                        funding_partner.funding_amount = average_budget
                        funding_partner.save()
                        changes.append(
                                u'updated funding amount for partnership (id: {}): {}'.format(
                                    funding_partner.pk, funding_partner))
        return changes
