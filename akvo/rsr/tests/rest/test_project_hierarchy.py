# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.contrib.auth.models import Group

from akvo.rsr.models import Partnership
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
        self.assertIn(self.p1, self.p2.ancestors(with_self=False))
        self.assertIn(self.p2, self.p3.ancestors(with_self=False))
        self.assertIn(self.p5, self.p6.ancestors(with_self=False))

    def test_project_access_check(self):
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p1))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p2))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p3))
        self.assertTrue(self.user.has_perm('rsr.view_project', self.p4))

        self.assertFalse(self.user.has_perm('rsr.view_project', self.p5))
        self.assertFalse(self.user.has_perm('rsr.view_project', self.p6))

    def test_fetch_root_projects(self):
        response = self.c.get('/rest/v1/project_hierarchy/?format=json')
        results = response.data['results']

        self.assertEqual(1, len(results))
        self.assertIn(self.p1.id, [p['id'] for p in results])
        self.assertFalse(results[0]['editable'])

    def test_fetch_leaf_project_hierarchy(self):
        response = self.c.get('/rest/v1/project_hierarchy/{}/?format=json'.format(self.p2.id))
        result = response.data

        self.assertEqual(self.p1.id, result['id'])
        self.assertEqual(self.p2.id, result['children'][0]['id'])
        self.assertEqual(self.p3.id, result['children'][0]['children'][0]['id'])
        self.assertFalse(result['editable'])
        self.assertFalse(result['children'][0]['editable'])

    def test_fetch_leaf_project_hierarchy_rsr_admin(self):
        email = password = 'user@rsr.admin.com'
        self.create_user(email, password, is_admin=True)
        self.c.login(username=email, password=password)
        response = self.c.get('/rest/v1/project_hierarchy/{}/?format=json'.format(self.p2.id))
        result = response.data

        self.assertEqual(self.p1.id, result['id'])
        self.assertEqual(self.p2.id, result['children'][0]['id'])
        self.assertEqual(self.p3.id, result['children'][0]['children'][0]['id'])
        self.assertTrue(result['editable'])
        self.assertTrue(result['children'][0]['editable'])


class RawProjectHierarchyTestCase(BaseTestCase):

    def test_get(self):
        # Given
        project = self.create_project('Project 1')
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, project, 2)

        # When
        response = self.c.get('/rest/v1/raw_project_hierarchy/?format=json')

        # Then
        result = response.data
        self.assertEqual(1, len(result['results']))
        hierarchy = result['results'][0]
        self.assertEqual(hierarchy['root_project'], project.pk)
        self.assertEqual(hierarchy['organisation'], org.pk)

    def test_get_private_hierarchies_as_enumerator(self):
        # Given
        project = self.create_project('Project 1', public=False)
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, project, 2)
        user = self.create_user('foo@bar.com', 'password')
        self.make_employment(user, org, 'Enumerators')
        self.c.login(username=user.email, password='password')

        # When
        response = self.c.get('/rest/v1/raw_project_hierarchy/?format=json')

        # Then
        result = response.data
        self.assertEqual(1, len(result['results']))
        hierarchy = result['results'][0]
        self.assertEqual(hierarchy['root_project'], project.pk)
        self.assertEqual(hierarchy['organisation'], org.pk)

    def test_get_private_hierarchies_anonymous(self):
        # Given
        project = self.create_project('Project 1', public=False)
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, project, 2)

        # When
        response = self.c.get('/rest/v1/raw_project_hierarchy/?format=json')

        # Then
        result = response.data
        self.assertEqual(0, len(result['results']))

    def test_post(self):
        # Given
        project = self.create_project('Project 1')
        org = self.create_organisation('Org')
        self.make_partner(project, org, Partnership.IATI_REPORTING_ORGANISATION)
        data = {
            'root_project': project.pk,
            'max_depth': 2,
        }
        user = self.create_user('foo@bar.com', 'password')
        self.make_org_admin(user, org)
        self.c.login(username=user.email, password='password')

        # When
        response = self.c.post('/rest/v1/raw_project_hierarchy/?format=json', data)

        # Then
        content = response.data
        self.assertEqual(content['root_project'], project.pk)
        self.assertEqual(content['organisation'], org.pk)

    def test_edit_private_hierarchy_as_org_admin(self):
        # Given
        project = self.create_project('Project 1', public=False)
        org = self.create_organisation('Org')
        hierarchy = self.create_project_hierarchy(org, project, 2)
        user = self.create_user('foo@bar.com', 'password')
        self.make_org_admin(user, org)
        self.c.login(username=user.email, password='password')
        data = {'max_depth': 3}

        # When
        response = self.c.patch(
            '/rest/v1/raw_project_hierarchy/{}/?format=json'.format(hierarchy.pk),
            json.dumps(data),
            content_type='application/json')

        # Then
        content = response.data
        self.assertEqual(content['root_project'], project.pk)
        self.assertEqual(content['organisation'], org.pk)
        self.assertEqual(content['max_depth'], data['max_depth'])

    def test_edit_private_hierarchy_as_project_editor(self):
        # Given
        project = self.create_project('Project 1', public=False)
        org = self.create_organisation('Org')
        hierarchy = self.create_project_hierarchy(org, project, 2)
        user = self.create_user('foo@bar.com', 'password')
        self.make_org_project_editor(user, org)
        self.c.login(username=user.email, password='password')
        data = {'max_depth': 3}

        # When
        response = self.c.patch(
            '/rest/v1/raw_project_hierarchy/{}/?format=json'.format(hierarchy.pk),
            json.dumps(data),
            content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 403)
