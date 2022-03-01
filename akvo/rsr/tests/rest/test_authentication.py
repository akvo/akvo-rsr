# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIRequestFactory

from akvo.rest.authentication import JWTAuthentication
from akvo.rest.views.project_enumerators import _update_user_token
from akvo.rsr.tests.base import BaseTestCase


class JWTAuthenticationTest(BaseTestCase):
    """Tests RSR authentication with django-request-token"""

    def setUp(self):
        self.user = self.create_user("myuser@test.test")
        self.token = _update_user_token(self.user.id, 1)

        factory = APIRequestFactory()
        self.request = factory.get("/just/some/path")
        self.request.token = self.token

    def test_authentication(self):
        authentication = JWTAuthentication()
        response = authentication.authenticate(self.request)

        self.assertIsNotNone(response)
        authenticated_user, auth_token = response

        self.assertEqual(authenticated_user, self.user)
        self.assertEqual(auth_token, self.token)

    def test_bad_scope(self):
        self.token.scope = "VERY BAD SCOPE"
        self.token.save()

        with self.assertRaisesRegex(AuthenticationFailed, "Incorrect JWT token scope"):
            authentication = JWTAuthentication()
            authentication.authenticate(self.request)

    def test_too_many_uses(self):
        self.token.used_to_date = self.token.max_uses + 1
        self.token.save()

        with self.assertRaisesRegex(AuthenticationFailed, "Invalid JWT token."):
            authentication = JWTAuthentication()
            authentication.authenticate(self.request)
