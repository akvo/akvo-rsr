# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import Client

from akvo.rsr.models import UserProjects, Project, Organisation, Partnership, Employment
from akvo.rsr.models.user_projects import restrict_projects

from akvo.rsr.tests.test_project_access import RestrictedUserProjects

User = get_user_model()


class RestrictedUserProjectsEndpoint(RestrictedUserProjects):

    def setUp(self):
        self.tearDown()

        super(RestrictedUserProjectsEndpoint, self).setUp()

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

        self.password_m = 'password_m'
        self.user_m.set_password(self.password_m)
        self.user_m.save()

        self.password_n = 'password_n'
        self.user_n.set_password(self.password_n)
        self.user_n.save()

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()
        Organisation.objects.all().delete()
        Group.objects.all().delete()

    @staticmethod
    def _create_user_projects(user, is_restricted=True, projects=None):
        user_projects = UserProjects.objects.create(
            user=user,
            is_restricted=is_restricted,
        )
        if projects is not None:
            for project in projects:
                user_projects.projects.add(project)

    def test_initial_call_to_endpoint_for_user(self):
        """
        User M      User N      User O
        Admin       Admin       User
           \       /    \      /
            \     /      \    /
              Org A       Org B
            /      \     /    \
           /        \   /      \
        Project X   Project Y   Project Z

        Test that a UserProjects object is created on access and returns the organisation_groups
        structure for the objects above
        """
        #  When
        self.c.login(username=self.user_n.username, password=self.password_n)
        response = self.c.get('/rest/v1/user_projects_access/{}/'.format(self.user_o.pk),
                              {'format': 'json'})

        content = json.loads(response.content)

        is_restricted = content['user_projects']['is_restricted']
        org_groups = content['organisation_groups']

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(is_restricted)

        self.assertEqual(org_groups[0]['organisations'], "A, B")
        self.assertEqual(len(org_groups[0]['projects']), 1)
        self.assertEqual(org_groups[0]['projects'][0]['id'], self.projects['Y'].pk)
        self.assertTrue(org_groups[0]['projects'][0]['access'])

        self.assertEqual(org_groups[1]['organisations'], "B")
        self.assertEqual(len(org_groups[1]['projects']), 1)
        self.assertEqual(org_groups[1]['projects'][0]['id'], self.projects['Z'].pk)
        self.assertTrue(org_groups[1]['projects'][0]['access'])


    def test_endpoint_for_admin_and_user_having_same_org(self):
        """
        /̶ o and \̶ o = project with restricted access for user_o

        User M      User N      User O
        Admin       Admin       User
           \            \      /
            \            \    /
              Org A       Org B
            /      \      /̶ o  \
           /        \    /̶ o    \
        Project X   Project Y   Project Z
        """
        # When
        # Remove User N's employment with A
        self.user_n.employers.filter(organisation=self.org_a).delete()
        restrict_projects(self.user_n, self.user_o, [self.projects['Y']])
        self.c.login(username=self.user_n.username, password=self.password_n)

        response = self.c.get('/rest/v1/user_projects_access/{}/'.format(self.user_o.pk),
                              {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        # organisation_groups = [
        #     {
        #         organisations: "B",
        #         projects: [
        #             {
        #                 id: <self.projects['Z'].pk>,
        #                 title: "Z",
        #                 subtitle: "Z subtitle",
        #                 access: True
        #             },
        #             {
        #                 id: <self.projects['Y'].pk>,
        #                 title: "Y",
        #                 subtitle: "Y subtitle",
        #                 access: False
        #             }
        #         ]
        #     }
        # ]
        org_groups = content['organisation_groups']

        # Then
        self.assertEqual(len(org_groups), 1)
        self.assertEqual(org_groups[0]['organisations'], "B")
        self.assertEqual(len(org_groups[0]['projects']), 2)

        self.assertEqual(org_groups[0]['projects'][0]['id'], self.projects['Z'].pk)
        self.assertTrue(org_groups[0]['projects'][0]['access'])

        self.assertEqual(org_groups[0]['projects'][1]['id'], self.projects['Y'].pk)
        self.assertFalse(org_groups[0]['projects'][1]['access'])

    def test_endpoint_for_admin_n_user_o(self):
        """
        Test where admin is employed by two organisations
        /̶ o and \̶ o = project with restricted access for user_o

        User M      User N      User O
        Admin       Admin       User
           \        /   \      /
            \      /     \    /
              Org A       Org B
            /      \      /̶ o  \
           /        \    /̶ o    \
        Project X   Project Y   Project Z
        """
        # When
        restrict_projects(self.user_n, self.user_o, [self.projects['Y']])
        self.c.login(username=self.user_n.username, password=self.password_n)

        response = self.c.get('/rest/v1/user_projects_access/{}/'.format(self.user_o.pk),
                              {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        # [
        #     {
        #         organisations: "A, B",
        #         projects: [
        #             {
        #                 id: <self.projects['Y'].pk>,
        #                 title: "Y",
        #                 subtitle: "Y subtitle",
        #                 access: False
        #             }
        #         ]
        #     },
        #     {
        #         organisations: "B",
        #         projects: [
        #             {
        #                 id: <self.projects['Z'].pk>,
        #                 title: "Z",
        #                 subtitle: "Z subtitle",
        #                 access: True
        #             }
        #         ]
        #     }
        # ]
        org_groups = content['organisation_groups']

        # Then
        self.assertEqual(len(org_groups), 2)

        self.assertEqual(org_groups[0]['organisations'], "A, B")
        self.assertEqual(len(org_groups[0]['projects']), 1)
        self.assertEqual(org_groups[0]['projects'][0]['id'], self.projects['Y'].pk)
        self.assertFalse(org_groups[0]['projects'][0]['access'])

        self.assertEqual(org_groups[1]['organisations'], "B")
        self.assertEqual(len(org_groups[1]['projects']), 1)
        self.assertEqual(org_groups[1]['projects'][0]['id'], self.projects['Z'].pk)
        self.assertTrue(org_groups[1]['projects'][0]['access'])


    def test_endpoint_for_admin_n_user_o_with_extra_employment(self):
        """
        Test where user o has an employment in C too
        /̶ o and \̶ o = project with restricted access for user_o

        User M      User N      User O
        Admin       Admin       User
           \        /   \      /    \
            \      /     \    /      \
              Org A       Org B      Org C
            /      \      /̶ o  \     /
           /        \    /̶ o    \   /
        Project X   Project Y   Project Z
        """
        # When
        self.org_c = Organisation.objects.create(name='C', long_name='C', can_create_projects=True)
        Partnership.objects.create(organisation=self.org_c, project=self.projects['Z'])
        Employment.objects.create(
            user=self.user_o, organisation=self.org_c, group=self.users, is_approved=True
        )

        restrict_projects(self.user_n, self.user_o, [self.projects['Y']])
        self.c.login(username=self.user_n.username, password=self.password_n)

        response = self.c.get('/rest/v1/user_projects_access/{}/'.format(self.user_o.pk),
                              {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        # [
        #     {
        #         organisations: "A, B",
        #         projects: [
        #             {
        #                 id: <self.projects['Y'].pk>,
        #                 title: "Y",
        #                 subtitle: "Y subtitle",
        #                 access: False
        #             }
        #         ]
        #     },
        #     {
        #         organisations: "B, C",
        #         projects: [
        #             {
        #                 id: <self.projects['Z'].pk>,
        #                 title: "Z",
        #                 subtitle: "Z subtitle",
        #                 access: True
        #             }
        #         ]
        #     }
        # ]

        # Then
        org_groups = content['organisation_groups']
        self.assertEqual(len(org_groups), 2)

        self.assertEqual(org_groups[0]['organisations'], "A, B")
        self.assertEqual(len(org_groups[0]['projects']), 1)
        self.assertEqual(org_groups[0]['projects'][0]['id'], self.projects['Y'].pk)
        self.assertFalse(org_groups[0]['projects'][0]['access'])

        self.assertEqual(org_groups[1]['organisations'], "B, C")
        self.assertEqual(len(org_groups[1]['projects']), 1)
        self.assertEqual(org_groups[1]['projects'][0]['id'], self.projects['Z'].pk)
        self.assertTrue(org_groups[1]['projects'][0]['access'])

    def test_set_restrictions_for_user_o(self):
        """
        User M      User N      User O
        Admin       Admin       User
           \       /    \      /
            \     /      \    /
              Org A       Org B
            /      \     /    \
           /        \   /      \
        Project X   Project Y   Project Z

        Test to PATCH a restriction
        """
        #  When
        self.c.login(username=self.user_n.username, password=self.password_n)
        # Visit the endpoint to instantiate a UserProjects object
        self.c.get('/rest/v1/user_projects_access/{}/'.format(self.user_o.pk),
                              {'format': 'json'})
        response = self.c.patch('/rest/v1/user_projects_access/{}/'.format(self.user_o.pk),
                                data=json.dumps({'user_projects': {'is_restricted': True}}),
                                content_type='application/json')

        is_restricted = response.data['user_projects']['is_restricted']

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(is_restricted)
