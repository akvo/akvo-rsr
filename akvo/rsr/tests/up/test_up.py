# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import base64
import json
from os.path import abspath, dirname, join

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import Client, TestCase

from akvo.rsr.models import Employment, Organisation, Partnership, Project, ProjectUpdate

HERE = dirname(abspath(__file__))


class RsrUpTest(TestCase):
    """Testcases for RSR Up and the API calls used by RSR Up."""

    def setUp(self):
        """
        Requirements needed for setup:

        - User account.
        - User connected to an organisation with at least one published project.
        - At least one update posted for this project.
        """
        # Create new user account
        user = get_user_model().objects.create_user(
            username='TestUser', email='testuser@akvo.org'
        )
        user.set_password('TestPassword')
        user.is_active = True
        user.save()

        # Get or create all Employment Groups
        user_group, _created = Group.objects.get_or_create(name='Users')
        Group.objects.get_or_create(name='User Managers')
        Group.objects.get_or_create(name='Project Editors')
        Group.objects.get_or_create(name='M&E Managers')
        Group.objects.get_or_create(name='Admins')

        # Create new organisation and link user to organisation
        organisation = Organisation.objects.create(
            name='Test Org', long_name='Test Organisation', organisation_type='N'
        )
        Employment.objects.create(
            user=user, organisation=organisation, group=user_group, is_approved=True
        )

        # Create a new project
        self.project = Project.objects.create(title='Test title')

        # Link project to organisation
        Partnership.objects.create(
            project=self.project, organisation=organisation, iati_organisation_role=2
        )

        # Publish project (update_fields will force an update)
        self.project.publishingstatus.status = 'published'
        self.project.publishingstatus.save(update_fields=['status', ])

        # Add an update to the project
        ProjectUpdate.objects.create(project=self.project, user=user, title='Test update')

        # Create a test client
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_get_api_key(self):
        """
        - Test getting an API key by POSTing to /auth/token/ with username and password as POST data.
        - Test whether the response contains all needed information (username, user_id,
        organisations, allow_edit_projects, api_key and published_projects).
        - Test whether there is a published project available.
        """
        response = self.c.post('/auth/token/?format=json',
                               {'username': 'TestUser', 'password': 'TestPassword'})
        self.assertEqual(response.status_code, 200)

        contents = json.loads(response.content)
        self.assertEqual(sorted(contents),
                         sorted(['username', 'user_id', 'organisations',
                                 'allow_edit_projects', 'api_key',
                                 'published_projects']))
        self.assertGreater(len(contents['published_projects']), 0)

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

        self.c.login(username='TestUser', password='TestPassword')
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

        user = get_user_model().objects.get(username='TestUser')
        self.c.login(username='TestUser', password='TestPassword')

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
