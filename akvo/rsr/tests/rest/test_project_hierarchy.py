# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth.models import Group

from akvo.rsr.tests.base import BaseTestCase


class ProjectHierarchyTestCase(BaseTestCase):

    def setUp(self):
        super(ProjectHierarchyTestCase, self).setUp()

        email = password = 'user@example.com'
        user = self.create_user(email, password)

        org1 = self.create_organisation('Org 1')
        org2 = self.create_organisation('Org 2')

        group = Group.objects.get(name='Users')
        self.make_employment(user, org1, group)

        p1 = self.create_project('Project 1')
        p2 = self.create_project('Project 2')
        p3 = self.create_project('Project 3')
        p4 = self.create_project('Project 4')
        p5 = self.create_project('Project 5')
        p6 = self.create_project('Project 6')

        # Tree
        # p1
        #   p2
        #     p3
        # p4
        # p5
        #   p6

        self.make_parent(p1, p2)
        self.make_parent(p2, p3)
        self.make_parent(p5, p6)

        self.make_partner(p1, org1)
        self.make_partner(p2, org1)
        self.make_partner(p3, org1)
        self.make_partner(p4, org1)

        self.make_partner(p5, org2)
        self.make_partner(p6, org2)

        self.create_project_hierarchy(org1, p1, 2)
        self.create_project_hierarchy(org2, p5, 2)

        self.c.login(username=email, password=password)

        self.user = user
        self.org1 = org1
        self.org2 = org2
        self.p1 = p1
        self.p2 = p2
        self.p3 = p3
        self.p4 = p4
        self.p5 = p5
        self.p6 = p6

    def test_project_tree_check(self):
        # roots
        self.assertEqual(self.p1.ancestors(with_self=False).count(), 0)
        self.assertEqual(self.p4.ancestors(with_self=False).count(), 0)
        self.assertEqual(self.p5.ancestors(with_self=False).count(), 0)

        # tree
        self.assertEqual(self.p5, self.p6.parent())

    def test_project_access_check(self):
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p1))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p2))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p3))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p4))

        self.assertFalse(self.user.has_perm('rsr.view_project', self.p5))
        self.assertFalse(self.user.has_perm('rsr.view_project', self.p6))

    def assertReturnsProjects(self, response, project_set):
        results = response.data["results"]
        self.assertEqual(len(project_set), response.data["count"])
        self.assertEqual(project_set, {p['id'] for p in results})
        self.assertFalse(results[0]['editable'])

    def test_fetch_root_projects(self):
        response = self.c.get('/rest/v1/program/?format=json', follow=True)
        self.assertReturnsProjects(response, {self.p1.id, self.p5.id})

    def test_get_program_children(self):
        response = self.c.get(f'/rest/v1/project/{self.p1.id}/children?format=json', follow=True)
        self.assertReturnsProjects(response, {self.p2.id})

    def test_get_project_children(self):
        response = self.c.get(f'/rest/v1/project/{self.p2.id}/children?format=json', follow=True)
        self.assertReturnsProjects(response, {self.p3.id})
