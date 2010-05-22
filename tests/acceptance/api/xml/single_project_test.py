#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.nosetestloaders import *
from helpers.rsrapi import *

from expectedelements import *

class SingleProjectTest(XMLTestCase):

    @classmethod
    def setup_class(cls):
        cls.project_23_root = element_root_from(api_path("project.xml/23"))

    def test_01_can_get_xml_data_for_single_project(self):
        """api.xml.SingleProjectTest  1. Can get XML data for a single project"""

        self.assert_element(self.project_23_root).is_not_none_and_has_tag("response")
        self.assert_element(self.project_23_root).has_exactly(1).child()
        self.assert_element(self.project_23_root).has_exactly(1).child_with_tag("resource")

    def test_02_project_element_has_expected_xml_structure(self):
        """api.xml.SingleProjectTest  2. Project element has expected XML structure"""

        project_element = self.project_23_root.find("resource") # the <resource> element represents a project

        self.assert_element(project_element).has_exactly(len(PROJECT_CHILDREN)).children()
        self.assert_element(project_element).has_single_children_in_list(PROJECT_CHILDREN)

        project_country_element = project_element.find("country")

        self.assert_element(project_country_element).has_exactly(len(COUNTRY_CHILDREN)).children()
        self.assert_element(project_country_element).has_single_children_in_list(COUNTRY_CHILDREN)


def suite():
    return load_tests_from(SingleProjectTest)

if __name__ == "__main__":
    run_test_suite(suite())
