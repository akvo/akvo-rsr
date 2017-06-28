# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

from django.conf import settings
from django.test import TransactionTestCase, Client

from akvo.codelists.models import Country, Version
from akvo.rsr.models import Employment, Organisation, User
from akvo.utils import check_auth_groups


# NOTE: Since these tests actually trigger some integrity errors and we want to
# see if they are handled correctly, we use a TransactionTestCase instead of
# TestCase, since wrapping the tests in a transaction isn't desirable.

class UserTestCase(TransactionTestCase):
    """Tests REST endpoints in views/user.py."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.org = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.user_password = 'password'
        self.user = self._create_user('abc@example.com', self.user_password)
        self.c.login(username=self.user.username, password=self.user_password)

        version = Version.objects.create(code=settings.IATI_VERSION)
        self.country = Country.objects.create(
            code='CI',
            name=u'CI - C\xc3\xb4te Divoire',
            version=version
        )

    def test_request_organisation_simple(self):
        # Given
        data = {'organisation': self.org.id}
        pk = self.user.id

        # When
        response = self.c.post(
            '/rest/v1/user/{}/request_organisation/?format=json'.format(pk), data
        )

        # Then
        self.assertEqual(response.status_code, 200)
        employment = Employment.objects.get(user=self.user, organisation_id=self.org.id)
        self.assertEqual(employment.group.name, 'Users')

    def test_request_organisation_once(self):
        # Given
        data = {'organisation': self.org.id, 'country': 'CI', 'job_title': ''}
        pk = self.user.id

        # When
        response = self.c.post(
            '/rest/v1/user/{}/request_organisation/?format=json'.format(pk), data
        )

        # Then
        self.assertEqual(response.status_code, 200)
        employment = Employment.objects.get(user=self.user, organisation_id=self.org.id)
        self.assertEqual(employment.group.name, 'Users')

    def test_request_organisation_twice(self):
        # Given
        data = {'organisation': self.org.id, 'country': '', 'job_title': ''}
        pk = self.user.id
        self.c.post('/rest/v1/user/{}/request_organisation/?format=json'.format(pk), data)

        # When
        response = self.c.post(
            '/rest/v1/user/{}/request_organisation/?format=json'.format(pk), data
        )

        # Then
        self.assertEqual(response.status_code, 409)
        employment = Employment.objects.get(user=self.user, organisation_id=self.org.id)
        self.assertEqual(employment.group.name, 'Users')

    def _create_user(self, email, password, is_active=True):
        """Create a user with the given email and password."""

        user = User.objects.create(email=email, username=email, is_active=is_active)
        user.set_password(password)
        user.save()

        return user
