#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.os.path import PathType
from fab.os.system import SystemType


class PathTypeTest(unittest.TestCase):

    def setUp(self):
        super(PathTypeTest, self).setUp()

    def test_has_expected_path_types(self):
        """fab.tests.os.path_type_test  Has expected path types"""

        self.assertEqual("directory", PathType.DIRECTORY)
        self.assertEqual("file", PathType.FILE)
        self.assertEqual("symbolic link", PathType.SYMLINK)


def suite():
    return TestSuiteLoader().load_tests_from(PathTypeTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
