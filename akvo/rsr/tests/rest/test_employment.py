# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.tests.base import BaseTestCase


class RestEmploymentTestCase(BaseTestCase):
    """Tests the Employment REST endpoints."""

    def setUp(self):
        super(RestEmploymentTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_superuser=True)
        self.c.login(username=self.user.username, password="password")

    def test_delete_employment(self):
        # Given
        org = self.create_organisation('Organisation')
        user = self.create_user('foo@example.com')
        employment = self.make_employment(user, org, 'Users')

        # When
        response = self.c.delete('/rest/v1/employment/{}/?format=json'.format(employment.id))

        # Then
        self.assertEqual(response.status_code, 204)
