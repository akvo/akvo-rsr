# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from os.path import abspath, dirname, join

from akvo.rsr.tests.base import BaseTestCase

HERE = abspath(dirname(__file__))


class MyDetailsTestCase(BaseTestCase):
    """Test my details page."""

    email = 'foo@example.com'
    password = 'passwdpasswdA1$'

    def setUp(self):
        super().setUp()
        self.user = self.create_user(email=self.email, password=self.password)
        self.c.login(username=self.email, password=self.password)

    def test_upload_file(self):
        url = '/en/myrsr/details/'
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        data = {'avatar': open(image_path, 'r+b'),
                'type': 'photo'}

        response = self.c.post(url, data)

        self.assertEqual(302, response.status_code)
        self.user.refresh_from_db()
        self.assertRegex(self.user.avatar.name, r'test_image.*\.jpg')
