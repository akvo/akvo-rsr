# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from os.path import abspath, dirname, join

from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test.client import BOUNDARY, MULTIPART_CONTENT, encode_multipart
from akvo.rsr.models import Organisation, Partnership, Project, ProjectRole, ProjectUpdate, ProjectUpdatePhoto
from akvo.rsr.permissions import GROUP_NAME_ENUMERATORS
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


class RestProjectUpdateTestCase(BaseTestCase):
    """Tests the project update REST endpoints."""

    def setUp(self):
        """
        For all tests, we at least need two projects and an update in the database. And a client.
        """

        super(RestProjectUpdateTestCase, self).setUp()
        # Create active user
        self.user = self.create_user("user@test.akvo.org", "password")
        self.org = Organisation.objects.create(name='org', long_name='org')
        self.make_employment(self.user, self.org, 'Users')

        # Create admin user
        self.admin = self.create_user("admin@test.akvo.org", "password")
        self.make_org_admin(self.admin, self.org)

        # Create projects
        self.orphan_project = Project.objects.create(title="REST test project")
        self.orphan_project.publish()
        self.project = Project.objects.create(title="REST test project 2")
        self.project.publish()
        Partnership.objects.create(organisation=self.org, project=self.project)

        # Create update
        ProjectUpdate.objects.create(
            project=self.project,
            user=self.user,
            title="Update title",
        )

    def test_rest_project_update_project_filter(self):
        """
        Checks the REST project update endpoint with a project filter.
        """
        response = self.c.get('/rest/v1/project_update/', {'format': 'json', 'project__gte': 1})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

        response = self.c.get('/rest/v1/project_update/',
                              {'format': 'json', 'project__title__exact': 'REST test project'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 0)

        response = self.c.get('/rest/v1/project_update/',
                              {'format': 'json', 'project__partners': 1})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 0)

    def test_rest_project_update_title_filter(self):
        """
        Checks the REST project update endpoint with a title filter.
        """
        response = self.c.get('/rest/v1/project_update/', {'format': 'json',
                                                           'title__exact': 'Update title'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

    def test_rest_post_project_update(self):
        """
        Checks the REST project update endpoint POST functions.
        """
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.project.pk,
                                   'title': 'Not allowed'
                               })
        self.assertEqual(response.status_code, 403)

        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.project.pk,
                                   'title': 'Allowed'
                               })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.user.id, response.data['user'])

    def test_rest_patch_project_update(self):
        """Checks the REST project update endpoint PATCH."""
        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.project.pk,
                                   'title': 'Project Update Title'
                               })
        update_id = response.data['id']
        updated_title = 'Updated Title'

        # When
        response = self.c.patch(
            '/rest/v1/project_update/{}/?format=json'.format(update_id),
            json.dumps({'title': updated_title}),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.data['title'], updated_title)
        self.assertEqual(response.status_code, 200)

    def test_rest_delete_project_update(self):
        """Checks that user can delete their own project update."""
        # Given
        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.project.pk,
                                   'title': 'Allowed'
                               })
        self.assertEqual(response.status_code, 201)
        update_id = response.data['id']

        # When
        response = self.c.delete(
            '/rest/v1/project_update/{}/?format=json'.format(update_id),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 204)
        with self.assertRaises(ProjectUpdate.DoesNotExist):
            ProjectUpdate.objects.get(id=update_id)

    def test_rest_cannot_post_project_update_to_random_projects(self):
        """
        Checks the REST project update endpoint POST functions.
        """
        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.orphan_project.pk,
                                   'title': 'Not Allowed'
                               })
        self.assertEqual(response.status_code, 403)

    def test_admin_can_delete_user_project_update(self):
        # Given
        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/?format=json',
                               {
                                   'project': self.project.pk,
                                   'title': 'Delete by Admin Allowed'
                               })
        update_id = json.loads(response.content)['id']
        self.c.logout()

        # When
        self.c.login(username=self.admin.username, password='password')
        response = self.c.delete(
            '/rest/v1/project_update/{}/?format=json'.format(update_id),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 204)
        with self.assertRaises(ProjectUpdate.DoesNotExist):
            ProjectUpdate.objects.get(id=update_id)

    def test_rest_post_project_update_photo_none(self):
        """
        Checks posting a project update with photo being None
        """

        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/?format=json',
                               json.dumps({
                                   'project': self.project.pk,
                                   'title': 'Allowed',
                                   'photo': None,
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)


class RestProjectUpdateEnumeratorTestCase(BaseTestCase):
    """Tests the project update REST endpoints from the perspective of an enumerator"""

    def setUp(self):
        """
        Creates a project update made by an enumerator
        """

        super().setUp()
        # Create active enumerator
        self.enumerator = self.create_user("enumerator@test.akvo.org", "password")
        self.org = Organisation.objects.create(name='org', long_name='org')
        self.make_employment(self.enumerator, self.org, GROUP_NAME_ENUMERATORS)

        # Create second enumerator
        self.enumerator_steve = self.create_user("enumerator_steve@test.akvo.org", "password")
        self.make_employment(self.enumerator_steve, self.org, GROUP_NAME_ENUMERATORS)

        # Create projects
        self.project = Project.objects.create(title="REST test project 2")
        self.project.publish()
        Partnership.objects.create(organisation=self.org, project=self.project)

        # Create update
        self.update_enum = ProjectUpdate.objects.create(
            project=self.project,
            user=self.enumerator,
            title="My simple title",
        )
        self.update_steve = ProjectUpdate.objects.create(
            project=self.project,
            user=self.enumerator_steve,
            title="My second simple title",
        )

        self.c.force_login(self.enumerator)

    def test_view_all_updates(self):
        """Ensure all updates can still be read"""

        response = self.c.get("/rest/v1/project_update/?format=json")
        self.assertEqual(response.status_code, 200, msg=response.content)
        data = response.json()
        self.assertEqual(data["count"], 2)

    def test_own_update(self):
        """Ensure the owned update has certain properties"""

        response = self.c.get(f"/rest/v1/project_update/{self.update_enum.id}/?format=json")
        self.assertEqual(response.status_code, 200, msg=response.content)
        data = response.json()
        self.assertEqual(data["editable"], True)
        self.assertEqual(data["deletable"], True)

    def test_other_update(self):
        """Ensure the update owned by the other enumerator has certain properties"""

        response = self.c.get(f"/rest/v1/project_update/{self.update_steve.id}/?format=json")
        self.assertEqual(response.status_code, 200, msg=response.content)
        data = response.json()

        self.assertEqual(data["editable"], False)
        self.assertEqual(data["deletable"], False)

    def test_fail_modify_updates_by_other_enumerators(self):
        """Modifying updates made by others should fail"""

        response = self.c.patch(
            f"/rest/v1/project_update/{self.update_steve.id}/?format=json",
            json.dumps({"title": "new title"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 403, msg=response.content)

    def test_fail_delete_updates_by_other_enumerators(self):
        """Deleting updates made by others should fail"""
        response = self.c.delete(
            f"/rest/v1/project_update/{self.update_steve.id}/?format=json",
        )
        self.assertEqual(response.status_code, 403, msg=response.content)

    def test_modify_own_update(self):
        """Modifying owned updates should succeed"""
        response = self.c.patch(

            f"/rest/v1/project_update/{self.update_enum.id}/?format=json",
            json.dumps({"title": "new title"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200, msg=response.content)

    def test_delete_own_update(self):
        """Deleting owned updates should succeed"""

        response = self.c.delete(
            f"/rest/v1/project_update/{self.update_enum.id}/?format=json",
        )
        self.assertEqual(response.status_code, 204, msg=response.content)


class RestProjectRoleUpdateEnumeratorTestCase(RestProjectUpdateEnumeratorTestCase):
    def setUp(self):
        super().setUp()

        self.project.use_project_roles = True
        self.project.save(update_fields=['use_project_roles'])
        ProjectRole.objects.create(
            project=self.project,
            user=self.enumerator,
            group=Group.objects.get(name=GROUP_NAME_ENUMERATORS)
        )


def get_mock_image():
    image_path = join(dirname(dirname(abspath(__file__))), 'iati_export', 'test_image.jpg')
    with open(image_path, 'r+b') as f:
        return f.read()


class ProjectUpdatePhotoTestCase(BaseTestCase):
    username = 'test@example.com'
    password = 'password'

    def create_org_user(self, username, password, org='Acme Org'):
        user = self.create_user(username, password)
        org = self.create_organisation(org)
        self.make_org_project_editor(user, org)
        return org, user

    def test_add_new_photos_to_an_update(self):
        # Given
        org, user = self.create_org_user(self.username, self.password)
        project = ProjectFixtureBuilder()\
            .with_partner(org)\
            .build()\
            .object

        update = ProjectUpdate.objects.create(project=project, user=user, title='Test')

        # When
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/project_update/{}/photos/?format=json'.format(update.id)
        data = {
            'photo': SimpleUploadedFile('test_image.jpg', get_mock_image()),
        }
        response = self.c.post(url, data)

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, ProjectUpdatePhoto.objects.count())

    def test_remove_photo_from_an_update(self):
        # Given
        org, user = self.create_org_user(self.username, self.password)
        project = ProjectFixtureBuilder()\
            .with_partner(org)\
            .build()\
            .object

        update = ProjectUpdate.objects.create(project=project, user=user, title='Test')
        photo = ProjectUpdatePhoto.objects.create(
            update=update,
            photo=SimpleUploadedFile('test_image.jpg', get_mock_image())
        )

        # When
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/project_update/{}/photos/{}/?format=json'.format(update.id, photo.id)
        response = self.c.delete(url)

        # Then
        self.assertEqual(204, response.status_code)
        self.assertEqual(0, ProjectUpdatePhoto.objects.count())

    def test_patch_to_change_the_photo(self):
        # Given
        org, user = self.create_org_user(self.username, self.password)
        project = ProjectFixtureBuilder()\
            .with_partner(org)\
            .build()\
            .object

        update = ProjectUpdate.objects.create(project=project, user=user, title='Test')
        photo = ProjectUpdatePhoto.objects.create(
            update=update,
            photo=SimpleUploadedFile('test_image.jpg', get_mock_image())
        )

        # When
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/project_update/{}/photos/{}/?format=json'.format(update.id, photo.id)
        data = encode_multipart(BOUNDARY, {
            'photo': SimpleUploadedFile('changed_image.jpg', get_mock_image()),
        })
        response = self.c.patch(url, data, content_type=MULTIPART_CONTENT)

        # Then
        self.assertEqual(200, response.status_code)
        actual = ProjectUpdatePhoto.objects.get(id=photo.id)
        self.assertTrue('changed_image' in actual.photo.name)

    def test_patch_to_change_photo_credit_and_caption(self):
        # Given
        org, user = self.create_org_user(self.username, self.password)
        project = ProjectFixtureBuilder()\
            .with_partner(org)\
            .build()\
            .object

        update = ProjectUpdate.objects.create(project=project, user=user, title='Test')
        photo = ProjectUpdatePhoto.objects.create(
            update=update,
            photo=SimpleUploadedFile('test_image.jpg', get_mock_image())
        )

        # When
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/project_update/{}/photos/{}/?format=json'.format(update.id, photo.id)
        data = {'credit': 'test credit', 'caption': 'test caption'}
        response = self.c.patch(url, json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        actual = ProjectUpdatePhoto.objects.get(id=photo.id)
        self.assertEqual('test credit', actual.credit)
        self.assertEqual('test caption', actual.caption)
