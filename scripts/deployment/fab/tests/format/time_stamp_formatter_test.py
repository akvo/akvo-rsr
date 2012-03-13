#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.format.timestamp import TimeStampFormatter


class StubbedTimeStampFormatter(TimeStampFormatter):

    def __init__(self, utc_datetime_now):
        self.stubbed_utc_datetime_now = utc_datetime_now

    def _utc_datetime_now(self):
        # the utcnow() generation is stubbed to ensure we get repeatable test results
        return self.stubbed_utc_datetime_now


class TimeStampFormatterTest(unittest2.TestCase):

    def setUp(self):
        super(TimeStampFormatterTest, self).setUp()
        self.expected_utc_datetime_now = datetime.datetime.utcnow()
        self.expected_timestamp = self.expected_utc_datetime_now.strftime('%Y%m%d_%H%M%S') # e.g. 20110922_173806

        self.date_time_formatter = StubbedTimeStampFormatter(self.expected_utc_datetime_now)

    def test_can_append_timestamp_to_given_text(self):
        """fab.tests.format.time_stamp_formatter_test  Can append timestamp to given text"""

        self.assertEqual("some_text_%s" % self.expected_timestamp, self.date_time_formatter.append_timestamp("some_text"))

    def test_can_create_file_timestamp_with_current_date_and_time(self):
        """fab.tests.format.time_stamp_formatter_test  Can create a file timestamp with the current date and time"""

        self.assertEqual(self.expected_timestamp, self.date_time_formatter.file_timestamp())

    def test_can_call_timestamp_method_without_stubbing(self):
        """fab.tests.format.time_stamp_formatter_test  Can call actual timestamp method without stubbing"""

        self.assertTrue(TimeStampFormatter().file_timestamp().find("_") > 0)


def suite():
    return TestSuiteLoader().load_tests_from(TimeStampFormatterTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
