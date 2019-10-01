# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Partnership
from akvo.rsr.tests.base import BaseTestCase


class EUTFSignalsTestCase(BaseTestCase):
    """Tests for the EUTF model signals"""

    def setUp(self):
        super(EUTFSignalsTestCase, self).setUp()
        self.eutf = self.create_organisation('EUTF')
        self.delegation = self.create_organisation('EUTF Delegation')
        self.root_project = self.create_project('Root Project')
        self.create_project_hierarchy(
            root_project=self.root_project, organisation=self.eutf, max_depth=2)

    def test_adding_project_to_hierarchy_sets_reporting_org(self):
        # Given
        project = self.create_project('New Project')

        # When
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            self.make_parent(self.root_project, project)

        # Then
        self.assertEqual(project.reporting_partner.organisation, self.eutf)
        self.assertEqual(
            project.reporting_partner.iati_organisation_role,
            Partnership.IATI_REPORTING_ORGANISATION)

    def test_existing_reporting_org_made_implementing_partner(self):
        # Given
        project = self.create_project('New Project')
        Partnership.objects.create(
            project=project,
            organisation=self.delegation,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # When
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            self.make_parent(self.root_project, project)

        # Then
        self.assertEqual(project.reporting_partner.organisation, self.eutf)
        self.assertEqual(
            project.reporting_partner.iati_organisation_role,
            Partnership.IATI_REPORTING_ORGANISATION)
        implementing_partnership = project.partnerships.get(organisation=self.delegation)
        self.assertEqual(implementing_partnership.iati_organisation_role, Partnership.IATI_IMPLEMENTING_PARTNER)

    def test_adding_project_outside_hierarchy_does_not_set_reporting_org(self):
        # Given
        project = self.create_project('New Project')

        # When
        self.make_parent(self.root_project, project)

        # Then
        self.assertIsNone(project.reporting_partner)

    def test_reporting_organisation_cannot_be_deleted(self):
        # Given
        project = self.create_project('New Project')
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            self.make_parent(self.root_project, project)

        # When
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            project.reporting_partner.delete()

        # Then
        self.assertEqual(project.reporting_partner.organisation, self.eutf)
        self.assertEqual(
            project.reporting_partner.iati_organisation_role,
            Partnership.IATI_REPORTING_ORGANISATION)

    def test_reporting_organisation_deleted_for_non_hierarchy_projects(self):
        # Given
        project = self.create_project('New Project')
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            self.make_parent(self.root_project, project)

        # When
        # NOTE: The deletion happens when the project isn't considered a part of the hierarchy.
        project.reporting_partner.delete()

        # Then
        self.assertIsNone(project.reporting_partner)

    def test_another_reporting_organisation_cannot_be_set(self):
        # Given
        org = self.create_organisation('EU Delegation')
        project = self.create_project('New Project')
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            self.make_parent(self.root_project, project)

        # When
        with self.settings(EUTF_ROOT_PROJECT=self.root_project.id, EUTF_ORG_ID=self.eutf.id):
            partnership, created = Partnership.objects.get_or_create(
                project=project, iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
                defaults=dict(organisation=org))
            if not created:
                partnership.organisation = org
                partnership.save(update_fields=['organisation'])

        # Then
        self.assertNotEqual(project.reporting_partner.organisation, org)
        self.assertEqual(project.reporting_partner.organisation, self.eutf)
        self.assertEqual(
            project.reporting_partner.iati_organisation_role,
            Partnership.IATI_REPORTING_ORGANISATION)
