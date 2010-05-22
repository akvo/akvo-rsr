#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.nosetestloaders import *
from helpers.rsrapi import *

from expectedelements import *

class AllProjectUpdatesForGivenProjectTest(XMLTestCase):

    @classmethod
    def setup_class(cls):
        cls.all_updates_for_project_23 = element_root_from(api_path("project/23/updates.xml"))

    def test_01_can_get_xml_data_for_all_project_updates_for_given_project(self):
        """api.xml.AllProjectUpdatesForGivenProjectTest  1. Can get XML data for all project updates for a given project"""

        self.assert_element(self.all_updates_for_project_23).is_not_none_and_has_tag("response")

        expected_total_project_updates = 8 # to be retrieved from RSR Admin

        self.assert_element(self.all_updates_for_project_23).has_at_least(2).children()
        self.assert_element(self.all_updates_for_project_23).has_exactly(expected_total_project_updates).children_with_tag("resource")

    def test_02_first_project_update_element_has_expected_xml_structure(self):
        """api.xml.AllProjectUpdatesForGivenProjectTest  2. First project update element has expected XML structure"""

        first_project_update_element = self.all_updates_for_project_23.find("resource") # each <resource> element represents a project update

        self.assert_element(first_project_update_element).has_exactly(len(PROJECT_UPDATE_CHILDREN)).children()
        self.assert_element(first_project_update_element).has_single_children_in_list(PROJECT_UPDATE_CHILDREN)

        project_element = first_project_update_element.find("project")

        self.assert_element(project_element).has_exactly(len(PROJECT_UPDATE_PROJECT_CHILDREN)).children()
        self.assert_element(project_element).has_single_children_in_list(PROJECT_UPDATE_PROJECT_CHILDREN)


def suite():
    return load_tests_from(AllProjectUpdatesForGivenProjectTest)

if __name__ == "__main__":
    run_test_suite(suite())
