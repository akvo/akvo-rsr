#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.app.django_admin_test import DjangoAdminTest
from fab.tests.app.django_settings_reader_test import DjangoSettingsReaderTest
from fab.tests.app.rsr_app_deployer_test import RSRAppDeployerTest


def app_suite():
    return TestSuiteLoader().create_suite_from_classes([DjangoAdminTest, DjangoSettingsReaderTest, RSRAppDeployerTest])

if __name__ == '__main__':
    TestRunner().run_test_suite(app_suite())
