#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.rsrapi import *
from helpers.testexecution import *

from expectedelements import *

class AllProjectsTest(XMLTestCase):

    @classmethod
    def setup_class(cls):
        cls.all_projects_root = element_root_from(api_path("projects.xml"))

    def test_01_can_get_xml_data_for_all_projects(self):
        """api.xml.AllProjectsTest  1. Can get XML data for all projects"""

        self.assert_element(self.all_projects_root).is_not_none_and_has_tag("response")

        expected_total_projects = 159 # to be retrieved from RSR Admin

        self.assert_element(self.all_projects_root).has_at_least(2).children()
        self.assert_element(self.all_projects_root).has_exactly(expected_total_projects).children_with_tag("resource")

    def test_02_first_project_element_has_expected_xml_structure(self):
        """api.xml.AllProjectsTest  2. First project element has expected XML structure"""

        first_project_element = self.all_projects_root.find("resource") # each <resource> element represents a project

        self.assert_element(first_project_element).has_exactly(len(PROJECT_CHILDREN)).children()
        self.assert_element(first_project_element).has_single_children_in_list(PROJECT_CHILDREN)

        project_country_element = first_project_element.find("country")

        self.assert_element(project_country_element).has_at_least(len(COUNTRY_CHILDREN)).children()
        self.assert_element(project_country_element).has_single_children_in_list(COUNTRY_CHILDREN)


def suite():
    return load_tests_from(AllProjectsTest)

if __name__ == "__main__":
    run_test_suite(suite())
