#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.security.crypto import FileCrypter


class FileCrypterTest(unittest2.TestCase):

    test_file_path = os.path.realpath(__file__)

    def setUp(self):
        super(FileCrypterTest, self).setUp()

        self.file_crypter = FileCrypter()

    def test_can_encrypt_and_decrypt_file(self):
        """fab.tests.security.file_crypter_test  Can encrypt and decrypt a specified file"""

        password = "c4tn1p"
        self.file_crypter.encrypt(password, self.test_file_path)
        self.file_crypter.decrypt(password, self.test_file_path + '.enc', self.test_file_path + '.dec')

        self.assertEqual(self._file_contents(self.test_file_path), self._file_contents(self.test_file_path + '.dec'))

    def _file_contents(self, file_path):
        with open(file_path, 'r') as a_file:
            return a_file.readlines()

    def tearDown(self):
        self._delete_file(self.test_file_path + '.enc')
        self._delete_file(self.test_file_path + '.dec')

    def _delete_file(self, file_path):
        if os.path.exists(file_path):
            os.remove(file_path)


def suite():
    return TestSuiteLoader().load_tests_from(FileCrypterTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
