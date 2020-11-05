# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from io import StringIO
from unittest.mock import patch

from akvo.rsr.models import IatiExport
from akvo.rsr.tests.base import BaseTestCase


def random_file_data(text):
    def _(*args, **kwargs):
        return StringIO(text)
    return _


class OrganisationTestCase(BaseTestCase):

    email = 'foo@example.com'
    password = 'passwdpasswdA1$'

    def test_iati(self):
        # No valid exports for the organisation
        org = self.create_organisation('Org 1')

        response = self.c.get(f'/organisation/{org.id}/iati/', follow=True)

        self.assertEqual(404, response.status_code)

        # One valid export
        user = self.create_user(self.email, self.password)
        IatiExport.objects.create(
            reporting_organisation=org, latest=True, status=3, iati_file='foo.xml', user=user)
        text = 'foo bar'

        with patch('django.core.files.storage.FileSystemStorage._open', new=random_file_data(text)):
            response = self.c.get(f'/organisation/{org.id}/iati/', follow=True)

        self.assertEqual(200, response.status_code)
        self.assertEqual(response.content.decode('utf8'), text)
