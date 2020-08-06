# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from akvo.rsr.models import ProjectRole, Result
from akvo.rsr.tests.base import BaseTestCase

User = get_user_model()


class ProjectAccessTestCase(BaseTestCase):

    def test_unauthenticated_api_access_for_projects_with_roles(self):
        # GET on Project
        project = self.create_project('Project')
        url = '/rest/v1/project/{}/?format=json'.format(project.id)

        project.use_project_roles = True
        project.save(update_fields=['use_project_roles'])

        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        # GET on Project List
        url = '/rest/v1/project/?format=json'

        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.data['results']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], project.id)

        # POST and create new project
        url = '/rest/v1/project/?format=json'

        response = self.c.post(url)
        self.assertEqual(response.status_code, 403)

        # POST and create new project update
        url = '/rest/v1/project_update/?format=json'

        response = self.c.post(url)
        self.assertEqual(response.status_code, 403)

    def test_api_access_for_user_without_assigned_project_roles(self):
        # GET on Project
        project = self.create_project('Project')
        email = 'test@example.org'
        password = 'password'
        user = self.create_user(email, password)
        self.c.login(username=user.email, password=password)
        url = '/rest/v1/project/{}/?format=json'.format(project.id)

        project.use_project_roles = True
        project.save(update_fields=['use_project_roles'])

        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        # GET on Project List
        url = '/rest/v1/project/?format=json'
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.data['results']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], project.id)

        # POST and create new project
        url = '/rest/v1/project/?format=json'
        response = self.c.post(url)
        self.assertEqual(response.status_code, 403)

        # POST and create new project update
        url = '/rest/v1/project_update/?format=json'
        data = {'project': project.id, 'user': user.id, 'title': 'Update'}
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type="application/json")
        self.assertEqual(response.status_code, 403)

    def test_api_access_for_user_with_roles(self):
        # GET on Project
        project = self.create_project('Project')
        email = 'test@example.org'
        password = 'password'
        user = self.create_user(email, password)
        group = Group.objects.get(name='Project Editors')
        self.c.login(username=user.email, password=password)
        url = '/rest/v1/project/{}/?format=json'.format(project.id)

        project.use_project_roles = True
        project.save(update_fields=['use_project_roles'])
        ProjectRole.objects.create(project=project, user=user, group=group)

        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        # GET on Project List
        url = '/rest/v1/project/?format=json'
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.data['results']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], project.id)

        # POST and create new project
        url = '/rest/v1/project/?format=json'
        response = self.c.post(url)
        self.assertEqual(response.status_code, 403)

        # POST and create new project update
        url = '/rest/v1/project_update/?format=json'
        data = {'project': project.id, 'user': user.id, 'title': 'Update'}
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['project'], project.id)

        # POST and create new project update on project without access
        url = '/rest/v1/project_update/?format=json'
        project2 = self.create_project('Project 2')
        data = {'project': project2.id, 'user': user.id, 'title': 'Update'}
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type="application/json")
        self.assertEqual(response.status_code, 403)

        # POST and create indicator on project with access
        url = '/rest/v1/indicator/?format=json'
        result = Result.objects.create(project=project)
        data = {'result': result.id, 'dimension_names': []}
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['result'], result.id)

        # POST and create indicator on project without access
        url = '/rest/v1/indicator/?format=json'
        result = Result.objects.create(project=project2)
        data = {'result': result.id, 'dimension_names': []}
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type="application/json")
        self.assertEqual(response.status_code, 403)

    def test_prevent_creation_through_api_without_access(self):
        project = self.create_project('Project')
        email = 'test@example.org'
        password = 'password'
        user = self.create_user(email, password)
        org = self.create_organisation('Test Organisation')
        self.make_employment(user, org, 'Project Editors')
        self.c.login(username=user.email, password=password)
        url = '/rest/v1/project/{}/?format=json'.format(project.id)

        # POST and create indicator on project without access
        url = '/rest/v1/indicator/?format=json'
        result = Result.objects.create(project=project)
        data = {'result': result.id, 'dimension_names': []}
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type="application/json")
        self.assertEqual(response.status_code, 403)
