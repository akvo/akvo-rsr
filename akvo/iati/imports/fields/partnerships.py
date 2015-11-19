# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.partnership import Partnership

from ..utils import add_log, get_or_create_organisation, get_text, ImporterHelper

from django.conf import settings

ROLE_TO_CODE = {
    'accountable': 2,
    'extending': 3,
    'funding': 1,
    'implementing': 4
}


class Partnerships(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Partnerships, self).__init__(iati_import, parent_elem, project, globals, related_obj)
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

        for partnership in self.parent_elem.findall('participating-org'):
            # org_ref = ''
            # partner_role = None
            # funding_amount = None

            org_ref = self.get_attrib(partnership, 'ref', None)
            # if 'ref' in partnership.attrib.keys():
            #     org_ref = partnership.attrib['ref']

            org_name = self.get_text(partnership)
            # org_name = get_text(partnership, activities_globals['version'])

            organisation = get_or_create_organisation(org_ref, org_name)

            organisation_role = partnership.get('role', None)
            if organisation_role and organisation_role.lower() in ROLE_TO_CODE:
                organisation_role = ROLE_TO_CODE[organisation_role.lower()]
            elif organisation_role:
                try:
                    organisation_role = int(organisation_role)
                except ValueError as e:
                    organisation_role = None
                    self.add_log('role', 'iati_organisation_role', str(e))

            funding_amount = self.get_attrib(
                    partnership, '{%s}funding-amount' % settings.AKVO_NS, 'funding_amount', None)
            if funding_amount:
                funding_amount = self.cast_to_decimal(
                        funding_amount, 'participating-org', 'funding_amount')
            # if '{%s}funding-amount' % settings.AKVO_NS in partnership.attrib.keys():
            #     try:
            #         funding_amount = int(partnership.attrib['{%s}funding-amount' % settings.AKVO_NS])
            #         funding_amount_present = True
            #     except ValueError as e:
            #         add_log(iati_import, 'funding_amount', str(e), project)

            if not (organisation or organisation_role):
                self.add_log('participating-org', 'participating_org',
                             'participating organisation or role missing')
                continue

            partnership_obj, created = Partnership.objects.get_or_create(
                project=self.project,
                organisation=organisation,
                iati_organisation_role=organisation_role,
                funding_amount=funding_amount
            )

            if created:
                changes.append(u'added partnership (id: {}): {}'.format(
                        partnership_obj.pk, partnership_obj))

            imported_partnerships.append(partnership_obj)

        changes += self.delete_objects(
                self.project.partnerships, imported_partnerships, 'partnership')
        # for partnership in self.project.partnerships.all():
        #     if not partnership in imported_partnerships and \
        #             not partnership.iati_organisation_role == partnership.IATI_REPORTING_ORGANISATION:
        #         changes.append(u'deleted partnership (id: {}): {}'.format(
        #                 partnership.pk, partnership.__unicode__()))
        #         partnership.delete()

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
