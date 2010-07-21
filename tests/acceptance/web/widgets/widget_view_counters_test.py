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

    def test_01_cobranded_narrow_widget_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  1. Cobranded narrow widget has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("cobranded-narrow")

    def test_02_cobranded_short_widget_has_view_counter_in_footer(self):
        """web.widgets.WidgetViewCountersTest  2. Cobranded short widget has view counter in footer"""

        self.verify_widget_has_standard_view_counter_in_footer("cobranded-short")

    def test_03_cobranded_banner_widget_has_view_counter_in_header(self):
        """web.widgets.WidgetViewCountersTest  3. Cobranded banner widget has view counter in header"""

        self.verify_widget_has_standard_view_counter_in_header("cobranded-banner")

    def test_04_cobranded_leader_widget_has_view_counter_in_header(self):
        """web.widgets.WidgetViewCountersTest  4. Cobranded leader widget has view counter in header"""

        self.verify_widget_has_standard_view_counter_in_header("cobranded-leader")

    def verify_widget_has_standard_view_counter_in_footer(self, widget_type):
        self.verify_widget_has_standard_view_counter_at_xpath(widget_type, "//div[@id='footer']/div/span")

    def verify_widget_has_standard_view_counter_in_header(self, widget_type):
        self.verify_widget_has_standard_view_counter_at_xpath(widget_type, "//div[@id='header']/span")

    def verify_widget_has_standard_view_counter_at_xpath(self, widget_type, view_count_xpath):
        self.count_verifier.verify_standard_view_counters_on_page(widget_path_for_project(108, widget_type), 1, view_count_xpath)


def suite():
    return load_tests_from(WidgetViewCountersTest)

if __name__ == "__main__":
    run_test_suite(suite())
