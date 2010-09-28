#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.rsrpath import *
from helpers.testexecution import *

from testcases.elementparsingtestcase import ElementParsingTestCase
from verifiers.viewcountverifier import ViewCountVerifier


class WidgetViewCountersTest(ElementParsingTestCase):

    def setUp(self):
        self.count_verifier = ViewCountVerifier(self)

    def test_01_narrow_cobranded_widget_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  1. Narrow cobranded widget has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("cobranded-narrow")

    def test_02_short_cobranded_widget_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  2. Short cobranded widget has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("cobranded-short")

    def test_03_cobranded_banner_widget_has_view_counter_in_header(self):
        """web.widgets.WidgetViewCountersTest  3. Cobranded banner widget has view counter in header"""

        self.verify_widget_has_standard_view_counter_in_header("cobranded-banner")

    def test_04_cobranded_leader_widget_has_view_counter_in_header(self):
        """web.widgets.WidgetViewCountersTest  4. Cobranded leader widget has view counter in header"""

        self.verify_widget_has_standard_view_counter_in_header("cobranded-leader")

    def test_05_narrow_project_widget_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  5. Narrow project widget has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("project-narrow")

    def test_06_project_updates_widget_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  6. Project updates widget has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("project-updates")

    def test_07_project_widget_with_donation_link_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  7. Project widget with donation link has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("project-contribute")

    def test_08_small_project_widget_has_view_counter_in_header(self):
        """web.widgets.WidgetViewCountersTest  8. Small project widget has view counter in header"""

        self.verify_widget_has_standard_view_counter_at_xpath("project-small", "//div[@id='header']/div/span")

    def test_09_side_feature_project_widget_with_donation_link_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  9. Side feature project widget with donation link has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("feature-side")

    def verify_widget_has_standard_view_counter_in_footer(self, widget_type):
        self.verify_widget_has_standard_view_counter_at_xpath(widget_type, "//div[@id='footer']/div/span")

    def verify_widget_has_standard_view_counter_in_header(self, widget_type):
        self.verify_widget_has_standard_view_counter_at_xpath(widget_type, "//div[@id='header']/span")

    def verify_widget_has_standard_view_counter_at_xpath(self, widget_type, view_count_xpath):
        self.count_verifier.open_page(project_widget_path(108, widget_type))
        self.count_verifier.expect_exactly(1).view_counter_on_page()
        self.count_verifier.expect_exactly(1).standard_view_counter_at_xpath(view_count_xpath)

    def test_10_project_listing_widget_has_view_counter_images_for_each_listed_project(self):
        """web.widgets.WidgetViewCountersTest 10. Project listing widget has view counter images for each listed project"""

        self.count_verifier.open_page(project_listing_widget_path_for_organisation(15))
        self.count_verifier.expect_exactly(12).view_counts_on_page()
        self.count_verifier.expect_exactly(0).view_counter_images_on_page()
        self.count_verifier.expect_exactly(12).view_counters_and_counter_identifiers_with_xpaths("//table[1]/tr/td[1]/div/span",
                                                                                                 "//table[1]/tr/td[1]/div/a/@href")


def suite():
    return load_tests_from(WidgetViewCountersTest)

if __name__ == "__main__":
    run_test_suite(suite())
