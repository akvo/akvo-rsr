# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.core import management

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Organisation


class MergeOrganisationsTestCase(BaseTestCase):
    """Testing that merging organisations management command works."""

    def setUp(self):
        super(MergeOrganisationsTestCase, self).setUp()

        self.org1 = self.create_organisation('Organisation \\u2013 1')
        self.org2 = self.create_organisation('Org 2')

        self.user1 = self.create_user('user@org1.com', 'password')
        self.user2 = self.create_user('user@org2.com', 'password')
        self.make_org_admin(self.user1, self.org1)
        self.make_org_admin(self.user2, self.org1)
        self.make_org_admin(self.user2, self.org2)

        self.project1 = self.create_project('Project 1')
        self.project2 = self.create_project('Project 2')
        self.make_partner(self.project1, self.org1)
        self.make_partner(self.project2, self.org2)

        self.report1 = self.create_report('report-1', organisation=self.org1)
        self.report2 = self.create_report('report-2', organisation=self.org2)

    def test_merge_organisations_works(self):
        """Test that command merges organisations correctly."""

        # When
        management.call_command('merge_organisations', self.org1.id, self.org2.id, '--no-prompt')

        # Then
        with self.assertRaises(Organisation.DoesNotExist):
            Organisation.objects.get(id=self.org2.id)

        self.assertIn(self.org1, self.user1.approved_organisations())
        self.assertIn(self.org1, self.user2.approved_organisations())

        self.assertIn(self.org1, self.project1.partners.all())
        self.assertIn(self.org1, self.project2.partners.all())

        self.assertIn(self.org1, self.report1.organisations.all())
        self.assertIn(self.org1, self.report2.organisations.all())
