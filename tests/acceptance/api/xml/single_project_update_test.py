#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.rsrapi import *

from expectedelements import *

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


def suite():
    return nose.loader.TestLoader().loadTestsFromTestCase(SingleProjectUpdateTest)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
