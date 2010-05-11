#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from extensions.xmlextensions import *
from extensions.xmltestcase import XMLTestCase
from helpers.rsrapi import *

class AllProjectsTest(XMLTestCase):

    @classmethod
    def setup_class(cls):
        cls.all_projects_root = element_root_from(api_path("projects.xml"))

    def test_01_can_get_xml_data_for_all_projects(self):
        """>>  1. Can get XML data for all projects"""

        self.assert_element(self.all_projects_root).is_not_none()

        expected_total_projects = 159 # to be retrieved from RSR Admin

        self.assert_element(self.all_projects_root).has_at_least(2).children()
        self.assert_element(self.all_projects_root).has_exactly(expected_total_projects).children_with_tag("resource")

    def test_02_first_project_element_has_expected_child_elements(self):
        """>>  2. First project element has expected child elements"""

        first_project_element = self.all_projects_root.find("resource") # each <resource> element represents a project

        self.assert_element(first_project_element).has_exactly(46).children()
        self.assert_element(first_project_element).has_single_children_in_list(["goal_2", "subtitle", "map",
            "date_complete", "current_status_detail", "location_1", "postcode", "id", "water_systems", "city",
            "project_plan_detail", "hygiene_facilities", "project_rating", "category_sanitation",
            "category_product_development", "sanitation_systems", "state", "location_2", "category_education",
            "latitude", "improved_water", "improved_water_years", "status", "goal_3", "goal_1", "goal_4",
            "goal_5", "project_plan_summary", "trainees", "category_water", "date_request_posted", "sustainability",
            "current_image_caption", "improved_sanitation", "category_other", "current_image", "category_maintenance",
            "name", "currency", "country", "notes", "category_training", "longitude", "context", "goals_overview",
            "improved_sanitation_years"])

def suite():
    return nose.loader.TestLoader().loadTestsFromTestCase(AllProjectsTest)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
