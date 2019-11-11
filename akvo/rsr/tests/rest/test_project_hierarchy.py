# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth.models import Group
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import RelatedProject


class ProjectHierarchyTestCase(BaseTestCase):

    def setUp(self):
        super(ProjectHierarchyTestCase, self).setUp()

        p1 = self.create_project('Project 1')
        p2 = self.create_project('Project 2')
        p3 = self.create_project('Project 3')
        p4 = self.create_project('Project 4')
        p5 = self.create_project('Project 5')
        p6 = self.create_project('Project 6')

        self.make_parent(p1, p2)
        self.make_parent(p2, p3)
        self.make_child(p5, p4)

        email = password = 'user@example.com'
        user = self.create_user(email, password)
        org1 = self.create_organisation('Org 1')
        org2 = self.create_organisation('Org 2')

        group = Group.objects.get(name='Users')

        self.make_employment(user, org1, group)

        self.make_partner(p1, org1)
        self.make_partner(p2, org1)
        self.make_partner(p3, org1)
        self.make_partner(p4, org1)
        self.make_partner(p5, org1)

        self.make_partner(p6, org2)

        self.p1 = p1
        self.p2 = p2
        self.p3 = p3
        self.p4 = p4
        self.p5 = p5
        self.p6 = p6
        self.user = user
        self.org1 = org1
        self.org2 = org2

        self.c.login(username=email, password=password)

    def test_hierarchy_check(self):
        # roots
        self.assertEqual(self.p1.parents_all().count(), 0)
        self.assertEqual(self.p4.parents_all().count(), 0)
        self.assertEqual(self.p6.parents_all().count(), 0)

        # hierarchy
        self.assertEqual(self.p2.parents_all().first(), self.p1)
        self.assertEqual(self.p3.parents_all().first(), self.p2)
        self.assertEqual(self.p5.parents_all().first(), self.p4)

    def test_project_access_check(self):
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p1))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p2))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p3))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p4))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p5))
        self.assertFalse(self.user.has_perm('rsr.view_project', self.p6))

    def test_fetch_root_projects(self):
        response = self.c.get('/rest/v1/project_hierarchy/?format=json')
        results = response.data['results']
        titles = [p['title'] for p in results]

        self.assertEqual(2, len(results))
        self.assertIn(self.p1.title, titles)
        self.assertIn(self.p4.title, titles)

    def test_fetch_leaf_project_hierarchy(self):
        response = self.c.get('/rest/v1/project_hierarchy/{}/?format=json'.format(self.p3.id))
        result = response.data

        self.assertEqual(self.p1.id, result['id'])
        self.assertEqual(self.p2.id, result['children'][0]['id'])
        self.assertEqual(self.p3.id, result['children'][0]['children'][0]['id'])

    @staticmethod
    def make_child(child, project):
        RelatedProject.objects.create(
            project=child,
            related_project=project,
            relation=RelatedProject.PROJECT_RELATION_PARENT
        )
