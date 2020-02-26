# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import base64
from os.path import abspath, dirname, join

from django.contrib.auth import get_user_model

from akvo.rsr.models import ProjectUpdate
from akvo.rsr.tests.base import BaseTestCase

HERE = dirname(abspath(__file__))


class RsrUpTest(BaseTestCase):
    """Testcases for RSR Up and the API calls used by RSR Up."""

    def setUp(self):
        """
        Requirements needed for setup:

        - User account.
        - User connected to an organisation with at least one published project.
        - At least one update posted for this project.
        """
        super(RsrUpTest, self).setUp()

        # Create new user account
        self.user = user = self.create_user('testuser@akvo.org', 'TestPassword')

        # Create new organisation and link user to organisation
        self.org = organisation = self.create_organisation('Test Org')
        self.make_employment(user, organisation, 'Users')

        # Create a new project
        self.project = self.create_project('Test title')

        # Link project to organisation
        self.make_partner(self.project, organisation, 2)

        # Add an update to the project
        ProjectUpdate.objects.create(project=self.project, user=user, title='Test update')

    def test_get_api_key(self):
        """
        - Test getting an API key by POSTing to /auth/token/ with username and password as POST data.
        - Test whether the response contains all needed information (username, user_id,
        organisations, allow_edit_projects, api_key and published_projects).
        - Test whether there is a published project available.
        """
        response = self.c.post('/auth/token/?format=json',
                               {'username': 'testuser@akvo.org', 'password': 'TestPassword'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(sorted(data),
                         sorted(['username', 'user_id', 'organisations',
                                 'allow_edit_projects', 'api_key',
                                 'published_projects']))
        self.assertEqual(data['published_projects'], [self.project.id])
        self.assertEqual(data['organisations'], [self.org.id])

    def test_get_api_key_excludes_unapproved_employment_projects(self):
        # Given
        # New unapproved employment for user
        org = self.create_organisation('Foo Bar')
        employment = self.make_employment(self.user, org, 'Users')
        employment.is_approved = False
        employment.save(update_fields=['is_approved'])
        project = self.create_project('Test Foo Bar Project')
        self.make_partner(project, org, 2)

        # When
        response = self.c.post('/auth/token/?format=json',
                               {'username': 'testuser@akvo.org', 'password': 'TestPassword'})

        # Then
        data = response.json()
        self.assertEqual(sorted(data),
                         sorted(['username', 'user_id', 'organisations',
                                 'allow_edit_projects', 'api_key',
                                 'published_projects']))
        self.assertEqual(data['published_projects'], [self.project.id])
        self.assertEqual(data['organisations'], [self.org.id])

    def test_get_project_information(self):
        """
        Test getting project information needed by Up.
        """
        response = self.c.get(
            '/rest/v1/project_up/{0}/'.format(str(self.project.pk)),
            {'format': 'xml', 'image_thumb_name': 'up', 'image_thumb_up_width': '100'}
        )
        self.assertEqual(response.status_code, 200)

    def test_get_updates_information(self):
        """
        - Test getting updates information needed by Up.
        - Test getting user id from update.
        - Test getting user information per retrieved update.
        """
        response = self.c.get(
            '/rest/v1/project_update/',
            {'format': 'xml', 'project': str(self.project.pk),
             'last_modified_at__gt': '1970-01-01T00:00:00'}
        )
        self.assertEqual(response.status_code, 200)

        # Retrieve user information per update
        all_updates = response.data['results']
        self.assertEqual(len(all_updates), 1)

        self.c.login(username='testuser@akvo.org', password='TestPassword')
        for update in all_updates:
            user_id = update['user']
            user_response = self.c.get('/rest/v1/user/{0}/'.format(user_id),
                                       {'format': 'json'})
            self.assertEqual(user_response.status_code, 200)

        response = self.c.get(
            '/rest/v1/project_update/',
            {'format': 'xml', 'project': str(self.project.pk),
             'last_modified_at__gt': '2030-01-01T00:00:00'}
        )
        self.assertEqual(response.status_code, 200)
        # Retrieve user information per update
        all_updates = response.data['results']
        self.assertEqual(len(all_updates), 0)

    def test_get_country_information(self):
        """
        Test getting country information needed by Up.
        """
        # Retrieve countries
        country_response = self.c.get('/rest/v1/country/', {'format': 'json', 'limit': '50'})
        self.assertEqual(country_response.status_code, 200)

    def test_post_update(self):
        """Test that posting an update works from the app

        - Also, tests that photo_caption, photo_credit, etc. can be left empty
          when posting an update.

        """

        user = get_user_model().objects.get(username='testuser@akvo.org')
        self.c.login(username='testuser@akvo.org', password='TestPassword')

        XML_TEMPLATE = """\
        <root>
        <update_method>M</update_method>
        <project>{project}</project>"
        <photo_location>E</photo_location>
        <uuid>xxxx-yyyy-zzzz</uuid>
        <user>{user}</user>
        <title>{title}</title>
        <user_agent>Android 6.0</user_agent>
        <text>{text}</text>
        <photo>{photo}</photo>
        <photo_caption></photo_caption>
        <photo_credit></photo_credit>
        <video>{video}</video>
        <video_caption></video_caption>
        <video_credit></video_credit>
        </root>
        """
        with open(join(HERE, '../../front-end/static/rsr/images/default-org-logo.jpg'), 'r+b') as f:
            data = f.read()
        photo = base64.standard_b64encode(data).decode()
        data = XML_TEMPLATE.format(
            project=self.project.pk,
            user=user.id,
            title="Title update",
            text="this is a text message",
            photo=photo,
            video='https://vimeo.com/2341212',
        )
        response = self.c.post('/rest/v1/project_update/',
                               data,
                               content_type='application/xml')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ProjectUpdate.objects.count(), 2)
