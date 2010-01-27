#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose, os, sys

from seleniumextensions import SeleniumTestCase
from test_settings import *

class RSRProjectAdminTest(SeleniumTestCase):

    KAGISO_PROJECT_NAME = "Kagiso Water Aid [UAT]"

    @classmethod
    def setup_class(cls):
        SeleniumTestCase.setup_class()

        # unfortunately we need to use class variables (rather than instance variables) since
        # the nose framework requires class-level setup methods to be class methods... :-/
        cls.expected_project_number = 0

    def test_01_admin_page_has_expected_project_sections(self):
        """>>  1. Admin page has expected project sections"""
        self.open_admin_page()
        self.assert_title_starts_with("Site administration")
        self.assert_page_contains_text_items(["Project comments", "Project payment gateway configurations",
                                              "Project updates", "Projects"])

    def test_02_can_add_project(self):
        """>>  2. Can add project"""
        self.open_project_admin_page()
        self.click_link("Add project")
        self.assert_title_starts_with("Add project")

        project_map_path = os.path.join(TEST_IMAGES_DIR, 'kagiso_map.jpg')
        project_photo_path = os.path.join(TEST_IMAGES_DIR, 'project_photo_spring.jpg')

        sel = self.selenium
        sel.type("id_name", self.KAGISO_PROJECT_NAME)
        sel.type("id_subtitle", "Kagiso Water Aid - project used for user acceptance testing purposes only")
        sel.select("id_status", "label=Active")
        sel.click("id_category_water")
        sel.click("id_category_sanitation")
        sel.click("id_category_education")
        sel.type("id_city", "Johannesburg")
        sel.type("id_state", "Gauteng")
        sel.select("id_country", "label=South Africa")
        sel.type("id_location_1", "14 Tugela Street")
        sel.type("id_location_2", "Kagiso")
        sel.type("id_postcode", "1754")
        sel.type("id_map", project_map_path)
        sel.type("id_project_plan_summary", "Provide water and sanitation aid and education for Kagiso residents.")
        sel.type("id_current_image", project_photo_path)
        sel.type("id_current_image_caption", "Spring being constructed near Kagiso")
        sel.type("id_goals_overview", "To improve sanitation and water availability in Kagiso.")
        sel.type("id_goal_1", "Provide local Kagiso community with improved water sources")
        sel.type("id_goal_2", "Provide sanitation education for Kagiso residents")
        sel.type("id_goal_3", "Help Kagiso residents build a larger water reservoir")
        sel.type("id_goal_4", "Provide eco-friendly water sanitation options")
        sel.type("id_goal_5", "Provide water preservation education")
        sel.type("id_water_systems", "4")
        sel.type("id_sanitation_systems", "2")
        sel.type("id_hygiene_facilities", "3")
        sel.type("id_improved_water", "1600")
        sel.type("id_improved_water_years", "10")
        sel.type("id_improved_sanitation", "2000")
        sel.type("id_improved_sanitation_years", "15")
        sel.type("id_trainees", "4")
        sel.type("id_context", "Help complement ongoing improvements of Kagiso water and sanitation infrastructure.")
        sel.type("id_project_plan_detail", "Use funding from foreign and local donors to implement goals.")
        sel.type("id_current_status_detail", "Project has received initial funding.")
        sel.type("id_sustainability", "Trained workers will maintain implemented projects.")
        sel.select("id_currency", "label=$")
        sel.select("id_budgetitem_set-0-item", "label=training")
        sel.type("id_budgetitem_set-0-amount", "800")
        sel.select("id_budgetitem_set-1-item", "label=building")
        sel.type("id_budgetitem_set-1-amount", "2600")
        sel.select("id_budgetitem_set-2-item", "label=maintenance")
        sel.type("id_budgetitem_set-2-amount", "1700")
        sel.select("id_budgetitem_set-3-item", "label=management")
        sel.type("id_budgetitem_set-3-amount", "300")
        sel.select("id_fundingpartner_set-0-funding_organisation", "label=Akvo")
        sel.type("id_fundingpartner_set-0-funding_amount", "400")
        sel.select("id_fieldpartner_set-0-field_organisation", "label=Water for People")
        sel.select("id_supportpartner_set-0-support_organisation", "label=Aqua for All")
        sel.click("_save")
        sel.wait_for_page_to_load(PAGE_LOAD_TIMEOUT)
        self.verify_project_admin_page_has_loaded()

        try:
            self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        except AssertionError as error:
            self.fail("Expected '%s' project to appear in project listing after being added:\n%s" %
                      (self.KAGISO_PROJECT_NAME, error))

    def test_03_can_navigate_to_project_page_from_project_admin(self):
        """>>  3. Can navigate to project page from project admin"""
        self.open_project_admin_page()

        try:
            self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        except AssertionError as error:
            self.fail("Expected '%s' project to exist (added earlier) for verifying project content:\n%s" %
                      (self.KAGISO_PROJECT_NAME, error))

        RSRProjectAdminTest.expected_project_number = self.kagiso_project_number()
        
        self.click_link(RSRProjectAdminTest.expected_project_number)
        self.assert_title_starts_with("Change project")
        self.click_link("View on site")
        self.assert_title_is("Akvo RSR - Project no. %i, %s" %
                             (RSRProjectAdminTest.expected_project_number, self.KAGISO_PROJECT_NAME))

    def test_04_project_page_has_expected_project_name_and_subtitle(self):
        """>>  4. Project page has expected project name and subtitle"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_title_is("Akvo RSR - Project no. %i, %s" %
                             (RSRProjectAdminTest.expected_project_number, self.KAGISO_PROJECT_NAME))
        self.verify_text_at_path(self.KAGISO_PROJECT_NAME, "//div[@id='outer_leftwing']/div[1]/h1")
        self.verify_text_at_path("Kagiso Water Aid - project used for user acceptance testing purposes only",
                                 "//div[@id='outer_leftwing']/div[1]/p")

    def test_05_project_page_has_expected_status_focus_area_icons_and_location(self):
        """>>  5. Project page has expected status, focus area icons and location"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        self.verify_text_at_path("Active", "//div[@id='project_details_leftwing']/p[1]/span")
        self.verify_attribute_value_at_path("Water", "//div[@id='project_details_leftwing']/p[2]/img[1]/@title")
        self.verify_attribute_value_at_path("Sanitation", "//div[@id='project_details_leftwing']/p[2]/img[2]/@title")
        self.verify_attribute_value_at_path("Education", "//div[@id='project_details_leftwing']/p[2]/img[3]/@title")
        self.verify_text_at_path("Johannesburg\nGauteng, South Africa", "//div[@id='project_details_leftwing']/p[3]")

    def test_06_project_page_has_appropriately_resized_location_map(self):
        """>>  6. Project page has appropriately resized location map"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        self.verify_element_size_at_path(140, 140, "//div[@id='project_details']/div[1]/div[1]")

    def test_07_project_description_tab_has_expected_project_plan_summary_and_target_benchmarks(self):
        """>>  7. Project description tab has expected project plan summary and target benchmarks"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        self.assert_page_contains_text_items(["Provide water and sanitation aid and education for Kagiso residents.",
                                              "4 functioning water systems",
                                              "2 functioning sanitation systems",
                                              "3 functioning hygiene facilities",
                                              "1600 persons with access to improved water for 10 years",
                                              "2000 persons with access to improved sanitation for 15 years",
                                              "4 persons who receive training / education per year"])

    def test_08_project_description_tab_has_appropriately_resized_project_image_with_caption(self):
        """>>  8. Project description tab has appropriately resized project image with caption"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        self.verify_text_at_path("Spring being constructed near Kagiso", "//div[@id='tab_description']/div[1]/div[1]")
        self.verify_element_size_at_path(220, 165, "//div[@id='tab_description']/div[1]/div[2]")

    def test_09_project_goals_tab_has_expected_goals_overview_target_benchmarks_and_goals(self):
        """>>  9. Project goals tab has expected goals overview, target benchmarks and goals"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        self.click_javascript_tab("//div[@id='container-1']/ul/li[2]/a/span")
        self.assert_page_contains_text_items(["To improve sanitation and water availability in Kagiso.",
                                              "4 functioning water systems",
                                              "2 functioning sanitation systems",
                                              "3 functioning hygiene facilities",
                                              "1600 persons with access to improved water for 10 years",
                                              "2000 persons with access to improved sanitation for 15 years",
                                              "4 persons who receive training / education per year",
                                              "Provide local Kagiso community with improved water sources",
                                              "Provide sanitation education for Kagiso residents",
                                              "Help Kagiso residents build a larger water reservoir",
                                              "Provide eco-friendly water sanitation options",
                                              "Provide water preservation education"])

    def test_10_project_sustainability_tab_has_expected_sustainability_text(self):
        """>> 10. Project sustainability tab has expected sustainability text"""
        self.open_project_page(RSRProjectAdminTest.expected_project_number)
        self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        self.click_javascript_tab("//div[@id='container-1']/ul/li[3]/a/span")
        self.assert_page_contains_text("Trained workers will maintain implemented projects.")

    def test_11_can_delete_project(self):
        """>> 11. Can delete project"""
        self.open_project_admin_page()

        try:
            self.assert_page_contains_text(self.KAGISO_PROJECT_NAME)
        except AssertionError as error:
            self.fail("Expected '%s' project to exist (added earlier) for testing deletion:\n%s" %
                      (self.KAGISO_PROJECT_NAME, error))

        self.selenium.click("//input[@name='_selected_action' and @value='%i']" % (self.kagiso_project_number()))
        self.selenium.select("action", "label=Delete selected projects")
        self.click_button("index") # element name for the 'Go' button
        self.assert_title_starts_with("Are you sure")
        self.click_submit_button_with_text("Yes, I'm sure")
        self.verify_project_admin_page_has_loaded()

        try:
            self.assert_page_does_not_contain_text(self.KAGISO_PROJECT_NAME)
        except AssertionError as error:
            self.fail("The '%s' project should not appear in project listing after deletion:\n%s" %
                      (self.KAGISO_PROJECT_NAME, error))

    def kagiso_project_number(self):
        project_number = 0
        project_name = ""
        row_number = 1

        while project_name != self.KAGISO_PROJECT_NAME and row_number <= 5:
            # table query is of form table.row.column
            project_number = int(self.selenium.get_table("//div[@id='changelist']/form/table.%i.1" % (row_number)))
            project_name = self.selenium.get_table("//div[@id='changelist']/form/table.%i.2" % (row_number))
            row_number += 1

        if project_name == self.KAGISO_PROJECT_NAME:
            return project_number
        else:
            fail("Unable to find added project in first 5 rows: %s" % (self.KAGISO_PROJECT_NAME))

    def open_project_admin_page(self):
        try:
            self.open_admin_page()
            self.click_link("Projects")
            self.verify_project_admin_page_has_loaded()
        except Exception as exception:
            self.fail("Unable to open project admin page: %s" % (exception))

    def verify_project_admin_page_has_loaded(self):
        self.assert_title_starts_with("Select project to change")
        self.assert_page_contains_text_items(["Project listing", "Select project to change"])

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "RSR project admin test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(RSRProjectAdminTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
