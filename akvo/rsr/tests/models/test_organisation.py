# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Organisation, Partnership
from akvo.rsr.tests.base import BaseTestCase


class OrganisationModelTestCase(BaseTestCase):
    """Tests for the project model"""

    def setUp(self):
        r"""Sanity checks for content_owned_organisations and content_owned_by.

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

        * indicates organisations which can_create_projects

        """

        self.projects = {}
        self.orgs = {}

        for title in 'ABCDEF':
            self.projects[title] = self.create_project(title)

        for name in 'ACBDFEG':
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
                self.make_partner(project, self.orgs['A'], Partnership.IATI_REPORTING_ORGANISATION)
                self.make_partner(project, self.orgs['D'], Partnership.IATI_IMPLEMENTING_PARTNER)
            elif project_title == 'B':
                self.make_partner(project, self.orgs['A'], Partnership.IATI_REPORTING_ORGANISATION)
                self.make_partner(project, self.orgs['E'], Partnership.IATI_IMPLEMENTING_PARTNER)
            elif project_title == 'C':
                self.make_partner(project, self.orgs['E'], Partnership.IATI_REPORTING_ORGANISATION)
                self.make_partner(project, self.orgs['F'], Partnership.IATI_IMPLEMENTING_PARTNER)
                self.make_partner(project, self.orgs['B'], Partnership.IATI_FUNDING_PARTNER)
            elif project_title == 'D':
                self.make_partner(project, self.orgs['B'], Partnership.IATI_REPORTING_ORGANISATION)
                self.make_partner(project, self.orgs['F'], Partnership.IATI_IMPLEMENTING_PARTNER)
            elif project_title == 'E':
                self.make_partner(project, self.orgs['C'], Partnership.IATI_REPORTING_ORGANISATION)
                self.make_partner(project, self.orgs['F'], Partnership.IATI_IMPLEMENTING_PARTNER)
            elif project_title == 'F':
                self.make_partner(project, self.orgs['C'], Partnership.IATI_REPORTING_ORGANISATION)
                self.make_partner(project, self.orgs['G'], Partnership.IATI_IMPLEMENTING_PARTNER)
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

    def test_project_content_ownership_sanity_for_org_pair(self):
        org_names = 'ABCDEFG'
        for i, first_org in enumerate(org_names):
            for second_org in org_names[i + 1:]:
                # Given
                names = {first_org, second_org}
                orgs = Organisation.objects.filter(name__in=names)

                # When/Then
                for org in orgs.content_owned_organisations():
                    content_owners = org.content_owned_by().values_list('name', flat=True)
                    msg = 'Content owners for {} - {} not in {}'.format(
                        org.name, content_owners, names
                    )
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
        self.assertIn(F.pk, G.content_owned_organisations().values_list('pk', flat=True))

    def test_chaining_managers(self):
        qs = Organisation.objects.all()
        self.assertQuerysetEqual(
            qs.fieldpartners().reportingpartners().order_by('id'),
            [repr(org) for org in (
                Organisation.objects.all().filter(pk=self.orgs['E'].pk).order_by('id')
            )]
        )

    def test_order_queryset_by_lower_name(self):
        org_ids = [org.id for org in self.orgs.values()]
        for name in 'ACE':
            self.orgs[name].name = name.lower()
            self.orgs[name].save()
        qs = Organisation.objects.filter(id__in=org_ids)
        self.assertEqual(
            "aBcDeFG",
            "".join([org.name for org in qs])
        )
        self.orgs['B'].name = 'K'
        self.orgs['B'].save()
        self.orgs['G'].name = 'h'
        self.orgs['G'].save()
        qs = Organisation.objects.filter(id__in=org_ids)
        self.assertEqual(
            "acDeFhK",
            "".join([org.name for org in qs])
        )
