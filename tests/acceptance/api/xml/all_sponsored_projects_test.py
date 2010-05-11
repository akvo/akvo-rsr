#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.rsrapi import *

from expectedelements import *

class AllSponsoredProjectsTest(XMLTestCase):

    @classmethod
    def setup_class(cls):
        cls.all_LE_projects_root = element_root_from(api_path("projects.xml/live-earth"))

    def test_01_can_get_xml_data_for_all_LE_sponsored_projects(self):
        """>>  1. Can get XML data for all Live Earth sponsored projects"""

        self.assert_element(self.all_LE_projects_root).is_not_none()
        self.assert_element(self.all_LE_projects_root).has_tag("response")

        expected_total_LE_projects = 36 # to be retrieved from RSR Admin

        self.assert_element(self.all_LE_projects_root).has_at_least(2).children()
        self.assert_element(self.all_LE_projects_root).has_exactly(expected_total_LE_projects).children_with_tag("resource")

    def test_02_first_project_element_has_expected_child_elements(self):
        """>>  2. First project element has expected child elements"""

        first_project_element = self.all_LE_projects_root.find("resource") # each <resource> element represents a project

        self.assert_element(first_project_element).has_exactly(46).children()
        self.assert_element(first_project_element).has_single_children_in_list(EXPECTED_PROJECT_CHILD_ELEMENTS)

def suite():
    return nose.loader.TestLoader().loadTestsFromTestCase(AllSponsoredProjectsTest)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
