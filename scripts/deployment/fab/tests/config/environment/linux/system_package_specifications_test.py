#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.environment.linux.systempackages import SystemPackageSpecifications


class SystemPackageSpecificationsTest(unittest2.TestCase):

    def test_has_expected_compilation_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected compilation package specifications"""

        expected_packages = ['linux-libc-dev', 'gcc-4.2-base', 'libgcc1', 'libc6', 'libc6-dev', 'binutils',
                             'libgomp1', 'cpp-4.2', 'cpp', 'gcc-4.2', 'gcc', 'libstdc++6', 'libstdc++6-4.2-dev',
                             'g++-4.2', 'g++', 'make']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.COMPILATION))

    def test_has_expected_core_utils_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected core utils package specifications"""

        expected_packages = ['libattr1', 'libacl1', 'libselinux1', 'coreutils']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.CORE_UTILS))

    def test_has_expected_package_tools_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected package tools specifications"""

        expected_packages = ['libbz2-1.0', 'bzip2', 'cpio', 'lzma', 'patch', 'libdb4.6', 'libgdbm3', 'perl-base',
                             'perl-modules', 'perl', 'libtimedate-perl', 'dpkg', 'dpkg-dev', 'build-essential']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.PACKAGE_TOOLS))

    def test_has_expected_locale_and_language_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected locale and language package specifications"""

        expected_packages = ['liblocale-gettext-perl', 'libtext-charwidth-perl', 'libtext-iconv-perl',
                             'libtext-wrapi18n-perl', 'debconf-i18n', 'debconf', 'tzdata', 'belocs-locales-bin',
                             'locales', 'language-pack-en-base', 'language-pack-en']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.LOCALES_AND_LANGUAGES))

    def test_has_expected_python_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected Python package specifications"""

        expected_packages = ['zlib1g', 'libncurses5', 'libncursesw5', 'readline-common', 'libreadline5',
                             'libsqlite3-0', 'libssl0.9.8', 'mime-support', 'python2.5-minimal', 'python2.5',
                             'python-minimal', 'python']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.PYTHON))

    def test_has_expected_database_authentication_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected database authentication package specifications"""

        expected_packages = ['mktemp', 'debianutils', 'libpam-runtime', 'libpam0g', 'libpam-modules',
                             'login', 'passwd', 'adduser']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.DATABASE_AUTHENTICATION))

    def test_has_expected_database_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected database package specifications"""

        expected_packages = ['mysql-common', 'libmysqlclient15off', 'libnet-daemon-perl', 'libplrpc-perl', 'libdbi-perl',
                             'libdbd-mysql-perl', 'libwrap0', 'mysql-client-5.0', 'ncurses-bin', 'sed', 'lsb-base',
                             'psmisc', 'mysql-server-5.0', 'python-support', 'python-mysqldb']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.DATABASE))

    def test_has_expected_python_package_dependency_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected Python package dependency package specifications"""

        expected_packages = ['libxml2']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.PYTHON_PACKAGE_DEPENDENCIES))

    def test_has_expected_additional_tools_package_specifications(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected additional tools package specifications"""

        expected_packages = ['libcomerr2', 'libidn11', 'libkeyutils1', 'libkrb53', 'libgpg-error0', 'libgcrypt11',
                             'liblzo2-2', 'libopencdk10', 'libtasn1-3', 'libgnutls13', 'libsasl2-modules', 'libsasl2-2',
                             'libldap-2.4-2', 'libcurl3', 'curl', 'wget']

        self.assertEqual(expected_packages, self._package_names_in(SystemPackageSpecifications.ADDITIONAL_TOOLS))

    def test_has_expected_package_specifications_in_all_packages_definition(self):
        """fab.tests.config.environment.linux.system_package_specifications_test  Has expected package specifications in the ALL_PACKAGES definition"""

        expected_packages = [SystemPackageSpecifications.COMPILATION,
                             SystemPackageSpecifications.CORE_UTILS,
                             SystemPackageSpecifications.PACKAGE_TOOLS,
                             SystemPackageSpecifications.LOCALES_AND_LANGUAGES,
                             SystemPackageSpecifications.PYTHON,
                             SystemPackageSpecifications.PYTHON_PACKAGE_DEPENDENCIES,
                             SystemPackageSpecifications.DATABASE_AUTHENTICATION,
                             SystemPackageSpecifications.DATABASE,
                             SystemPackageSpecifications.ADDITIONAL_TOOLS]

        self.assertEqual(expected_packages, SystemPackageSpecifications.ALL_PACKAGES)

    def _package_names_in(self, package_specifications):
        return map(lambda package_spec: package_spec['name'], package_specifications)


def suite():
    return TestSuiteLoader().load_tests_from(SystemPackageSpecificationsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
