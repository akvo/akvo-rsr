#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.app.admin import DjangoAdmin
from fab.app.settings import DjangoSettingsReader


class DjangoSettingsReaderTest(mox.MoxTestBase):

    def setUp(self):
        super(DjangoSettingsReaderTest, self).setUp()
        self.mock_django_admin = self.mox.CreateMock(DjangoAdmin)

        self.settings_reader = DjangoSettingsReader(self.mock_django_admin)

    def test_can_read_rsr_database_name(self):
        """fab.tests.app.settings.django_settings_reader_test  Can read RSR database name"""

        deployed_database_settings = { 'default': { 'NAME': 'some_rsrdb' } }

        self.mock_django_admin.read_setting('DATABASES').AndReturn(deployed_database_settings)
        self.mox.ReplayAll()

        self.assertEqual('some_rsrdb', self.settings_reader.rsr_database_name())


def suite():
    return TestSuiteLoader().load_tests_from(DjangoSettingsReaderTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
