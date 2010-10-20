#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.akvopaths import *
from helpers.testexecution import *


class AkvoPathsTest(TestCase):

    def test_can_get_home_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Home page"""
        self.verify_path("/", home_page())

    def test_can_get_projects_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Projects page"""
        self.verify_path("/rsr/projects", projects_page())

    def test_can_get_all_projects_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for All Projects page"""
        self.verify_path("/rsr/projects/all", all_projects_page())

    def test_can_get_focus_areas_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Focus Areas page"""
        self.verify_path("/web/focus-areas", focus_areas_page())

    def test_can_get_partners_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Partners page"""
        self.verify_path("/web/partners", partners_page())

    def test_can_get_akvopedia_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Akvopedia page"""
        self.verify_path("/wiki", akvopedia_page())

    def test_can_get_about_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for About page"""
        self.verify_path("/web/get_involved", about_page())

    def test_can_get_blog_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Blog page"""
        self.verify_path("/blog", blog_page())

    def test_can_get_register_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Register page"""
        self.verify_path("/rsr/accounts/register1", register_page())

    def test_can_get_sign_in_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Sign in page"""
        self.verify_path("/rsr/signin/?next=/rsr/projects/all", sign_in_page())

    def test_can_get_terms_of_use_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Terms of use page"""
        self.verify_path("/web/terms_of_use", terms_of_use_page())

    def test_can_get_donation_policy_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Donation policy page"""
        self.verify_path("/web/donation_policy", donation_policy_page())

    def test_can_get_partners_policy_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Partners policy page"""
        self.verify_path("/web/partners_and_projects_policy", partners_policy_page())

    def test_can_get_user_contribution_policy_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for User contribution policy page"""
        self.verify_path("/web/user_contribution_policy", user_contribution_policy_page())

    def test_can_get_open_license_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Open license page"""
        self.verify_path("/web/open_license", open_license_page())

    def test_can_get_privacy_policy_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Privacy policy page"""
        self.verify_path("/web/privacy_policy", privacy_policy_page())

    def test_can_get_api_code_of_conduct_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Akvo RSR API code of conduct page"""
        self.verify_path("/web/akvo-rsr-api-code-of-conduct", api_code_of_conduct_page())

    def test_can_get_what_we_do_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for What we do page"""
        self.verify_path("/web/what_we_do", what_we_do_page())

    def test_can_get_how_akvo_works_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for How Akvo works page"""
        self.verify_path("/web/how_akvo_works", how_akvo_works_page())

    def test_can_get_why_we_do_it_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Why we do it page"""
        self.verify_path("/web/why_we_do_it", why_we_do_it_page())

    def test_can_get_faq_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for FAQ page"""
        self.verify_path("/web/faq", faq_page())

    def test_can_get_partners_and_projects_maps_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Partners and Projects maps page"""
        self.verify_path("/web/map_partners_projects", global_maps_page())

    def test_can_get_akvo_team_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Akvo team page"""
        self.verify_path("/web/team", akvo_team_page())

    def test_can_get_working_at_akvo_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Working at Akvo page"""
        self.verify_path("/web/jobs", akvo_jobs_page())

    def test_can_get_press_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Press page"""
        self.verify_path("/web/press", press_page())

    def test_can_get_annual_reports_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Annual reports page"""
        self.verify_path("/web/annual_reports", annual_reports_page())

    def test_can_get_organisations_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Organisations page"""
        self.verify_path("/rsr/organisations", organisations_page())

    def test_can_get_commercial_partners_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Commercial partners page"""
        self.verify_path("/web/commercial_partners", commercial_partners_page())

    def test_can_get_knowledge_institute_partners_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Knowledge institute partners page"""
        self.verify_path("/web/knowledge_institute_partners", knowledge_institute_partners_page())

    def test_can_get_akvo_investors_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Akvo investors page"""
        self.verify_path("/web/akvo_investors", akvo_investors_page())

    def test_can_get_akvo_labs_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Akvo Labs page"""
        self.verify_path("/labs", akvo_labs_page())

    def test_can_get_contact_us_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Contact us page"""
        self.verify_path("/web/contact_us", contact_us_page())

    def test_can_get_rsr_admin_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for RSR admin page"""
        self.verify_path("/rsr/admin", rsr_admin_page())

    def test_can_get_blog_admin_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Blog admin page"""
        self.verify_path("/blog/wp-login.php", blog_admin_page())

    def test_can_get_cms_admin_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for CMS admin page"""
        self.verify_path("/web/?q=user", cms_admin_page())

    def verify_path(self, expected_path, actual_path):
        self.assertEqual(expected_path, actual_path, "\nExpected path: %s\n  Actual path: %s" % (expected_path, actual_path))


def suite():
    return load_tests_from(AkvoPathsTest)

if __name__ == "__main__":
    run_test_suite(suite())
