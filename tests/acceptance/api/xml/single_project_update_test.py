#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose, urllib

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.rsrapi import *

from expectedelements import *
from test_settings import RSR_MEDIA_PATH

class SingleProjectUpdateTest(XMLTestCase):

    @classmethod
    def setup_class(cls):
        cls.project_update_200_root = element_root_from(api_path("update.xml/200"))

    def test_01_can_get_xml_data_for_single_project_update(self):
        """>>  1. Can get XML data for a single project update"""

        self.assert_element(self.project_update_200_root).is_not_none_and_has_tag("response")
        self.assert_element(self.project_update_200_root).has_at_least(2).children()

    def test_02_project_update_element_has_expected_children(self):
        """>>  2. Project update element has expected children"""

        self.assert_element(self.project_update_200_root).has_exactly(len(PROJECT_UPDATE_CHILDREN)).children()
        self.assert_element(self.project_update_200_root).has_single_children_in_list(PROJECT_UPDATE_CHILDREN)

        project_element = self.project_update_200_root.find("project")

        self.assert_element(project_element).has_exactly(len(PROJECT_UPDATE_PROJECT_CHILDREN)).children()
        self.assert_element(project_element).has_single_children_in_list(PROJECT_UPDATE_PROJECT_CHILDREN)

    def test_03_can_get_photo_path_for_given_project_update(self):
        """>>  3. Can get photo path for given project update"""

        photo_element = self.project_update_200_root.find("photo")

        self.assert_element(photo_element).has_text()

    def test_04_can_view_photo_at_media_path_for_given_project_update(self):
        """>>  4. Can view photo at media path for given project update"""

        photo_url = media_path(self.project_update_200_root.find("photo").text)

        self.failUnless(photo_url.startswith(RSR_MEDIA_PATH),
                        "Expected photo URL to start with media path: %s.\nActual URL: %s" % (RSR_MEDIA_PATH, photo_url))

        photo_file = urllib.urlopen(photo_url)
        OK_STATUS_CODE = 200

        self.failUnlessEqual(OK_STATUS_CODE, photo_file.getcode(),
                             "Expected HTTP OK status code (200) when retrieving photo at: %s\nActual code: %i" %
                                (photo_url, photo_file.getcode()))

        photo_file_content_type = photo_file.info().getheader('Content-Type')

        self.failUnless(photo_file_content_type.startswith('image'),
                        "Expected photo content type to be image/*.  Actual content type: %s" % (photo_file_content_type))


def suite():
    return nose.loader.TestLoader().loadTestsFromTestCase(SingleProjectUpdateTest)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
