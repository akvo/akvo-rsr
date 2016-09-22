# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import Client, TestCase
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from akvo.rsr.models import Country, Project, ProjectLocation, User


class ProjectMapLocationTest(TestCase):

    """."""

    def setUp(self):
        """Setup test cast.

        1. Create user
        2. Create auth group for REST API access
        3. Add the user to the created group
        4. Save a test Client with the correct HOST(needed because of our dispatch middleware)
        """
        u = User.objects.create(username="testuser", password="password", is_staff=True,
                                is_active=True, is_superuser=True)
        u.save()
        API_users = Group.objects.create(id=8, name="Full REST API access")
        API_users.save()
        API_users.user_set.add(u)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_one(self):
        """Test the name & the unicode method."""
        self.c.login(username='testuser', password='password')
        resp = self.c.get('/rest/v1/project_map_location/', {'format': 'json'})
        self.assertEqual(resp.status_code, 200)
