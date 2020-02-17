# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Partnership
from akvo.rsr.tests.base import BaseTestCase


class ProjectQuerySetTestCase(BaseTestCase):

    def test_field_partners(self):
        project = self.create_project('Project')
        project_2 = self.create_project('Project 2')

        org_a = self.create_organisation('Organisation A', can_create_projects=False)
        self.make_partner(project, org_a, Partnership.IATI_ACCOUNTABLE_PARTNER)
        self.make_partner(project_2, org_a, Partnership.IATI_IMPLEMENTING_PARTNER)

        org_b = self.create_organisation('Organisation B', can_create_projects=False)
        self.make_partner(project, org_b, Partnership.IATI_IMPLEMENTING_PARTNER)

        org_c = self.create_organisation('Organisation C', can_create_projects=True)
        self.make_partner(project, org_c, Partnership.IATI_REPORTING_ORGANISATION)

        self.assertNotIn(org_a, org_c.all_projects().field_partners())
