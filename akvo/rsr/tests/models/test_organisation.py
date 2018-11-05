# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import expectedFailure

from akvo.rsr.models import Organisation, Partnership, Project
from akvo.rsr.tests.base import BaseTestCase


class OrganisationModelTestCase(BaseTestCase):
    """Tests for the project model"""

    def setUp(self):
        """Sanity checks for content_owned_organisations and content_owned_by.

          Project-A    Project-B    Project-C    Project-D    Project-E    Project-F
                 | (R)    (R)  \       (R)\ \    (R)    \         / (R)   (R)     |
                 |  \      |    \       |  \ \    |      \       /    \   /       |
                 |   \----Org-A* \      |   \ - Org-B*    \     /     Org-C*      |
                 |                \     |    \             \   /                  |
                 |                 \    |     \             \ /                   |
                 Org-D              \ Org-E    ----------- Org-F                Org-G
                                                             ^                    |
                                                             |                    |
                                                             |                    |
                                                             |    content-owner   |
                                                             +====================+

        """

        self.projects = {}
        self.orgs = {}

        for title in 'ABCDEF':
            project = Project.objects.create(title=title)
            self.projects[title] = project

        for name in 'ABCDEFG':
            org = Organisation.objects.create(
                name=name,
                long_name='Organisation {}'.format(name),
                can_create_projects=name in 'ABC'
            )
            self.orgs[name] = org

        G = self.orgs['G']
        G.content_owner = self.orgs['F']
        G.save()

        for project_title in 'ABCEDF':
            project = self.projects[project_title]
            if project_title == 'A':
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['A'],
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['D'],
                    iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
                )
            elif project_title == 'B':
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['A'],
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['E'],
                    iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
                )
            elif project_title == 'C':
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['E'],
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['F'],
                    iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['B'],
                    iati_organisation_role=Partnership.IATI_FUNDING_PARTNER
                )
            elif project_title == 'D':
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['B'],
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['F'],
                    iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
                )
            elif project_title == 'E':
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['C'],
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['F'],
                    iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
                )
            elif project_title == 'F':
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['C'],
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )
                Partnership.objects.create(
                    project=project,
                    organisation=self.orgs['G'],
                    iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
                )
            else:
                pass

    def test_project_content_ownership_sanity_per_org(self):
        for org_name in 'ABCDEFG':
            # Given
            org = self.orgs[org_name]

            # When/Then
            content_owned_orgs = org.content_owned_organisations()
            for content_owned_org in content_owned_orgs:
                content_owners = content_owned_org.content_owned_by()
                self.assertIn(org.pk, content_owners.values_list('pk', flat=True))

    @expectedFailure
    def test_project_content_ownership_sanity_for_org_pair(self):
        # Given
        names = set(('A', 'E'))
        orgs = Organisation.objects.filter(name__in=names)

        # When/Then
        for org in orgs.content_owned_organisations():
            content_owners = org.content_owned_by().values_list('name', flat=True)
            msg = 'Content owners for {} - {} not in {}'.format(org.name, content_owners, names)
            self.assertTrue(set(content_owners) & names, msg)

    def test_project_content_ownership_sanity_for_org_pair_with_new_code(self):
        # Given
        names = set(('A', 'E'))
        orgs = Organisation.objects.filter(name__in=names)

        # When/Then
        for org in orgs.new_content_owned_organisations():
            content_owners = org.content_owned_by().values_list('name', flat=True)
            msg = 'Content owners for {} - {} not in {}'.format(org.name, content_owners, names)
            self.assertTrue(set(content_owners) & names, msg)

    def test_mutual_content_ownership_works(self):
        # Given
        G = self.orgs['G']
        F = self.orgs['F']
        self.assertEqual(G.content_owner_id, F.pk)
        self.assertIn(G.pk, F.content_owned_organisations().values_list('pk', flat=True))

        # When
        F.content_owner_id = G.pk
        F.save()

        # Then
        F = Organisation.objects.get(name='F')
        self.assertIn(G.pk, F.content_owned_organisations().values_list('pk', flat=True))
        # self.assertIn(F.pk, G.content_owned_organisations().values_list('pk', flat=True))
