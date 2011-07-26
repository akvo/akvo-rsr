#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.helpers.codebase import Codebase
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import RemoteHost
from fab.helpers.internet import Internet
from fab.helpers.permissions import Permissions


class CodebaseTest(mox.MoxTestBase):

    def setUp(self):
        super(CodebaseTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_deployment_host = self.mox.CreateMock(RemoteHost)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_internet = self.mox.CreateMock(Internet)
        self.mock_permissions = self.mox.CreateMock(Permissions)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.codebase = Codebase(self.mock_config, self.mock_deployment_host, self.mock_file_system,
                                 self.mock_internet, self.mock_permissions, self.mock_feedback)

    def test_can_clean_deployment_directories(self):
        """fab.tests.helpers.codebase_test  Can clean deployment directories"""

        deployment_root_dir = "/var/some/path/akvo-rsr_root"
        self.mock_config.rsr_deployment_root = deployment_root_dir

        self.mock_feedback.comment(mox.StrContains("Clearing previous deployment directories"))
        self.mock_file_system.delete_directory_with_sudo(deployment_root_dir)
        self.mox.ReplayAll()

        self.codebase._clean_deployment_directories()

    def test_can_download_rsr_code_archive_to_deployment_host(self):
        """fab.tests.helpers.codebase_test  Can download RSR code archive to deployment host"""

        self._set_expected_deployment_configuration()

        self.mock_feedback.comment(mox.StrContains("Downloading RSR archive file"))
        self.mock_internet.file_from_url_exists_in_directory(self.rsr_archive_url, self.archives_dir_on_host).AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Fetching akvo-rsr archive for the [%s] branch from Github" % self.rsr_branch))
        self.mock_deployment_host.run("wget -nv -P %s %s" % (self.archives_dir_on_host, self.rsr_archive_url))
        self.mox.ReplayAll()

        self.codebase._download_rsr_archive()

    def test_does_not_download_rsr_code_archive_if_available_on_deployment_host(self):
        """fab.tests.helpers.codebase_test  Does not download RSR code archive if already available on deployment host"""

        self._set_expected_deployment_configuration()

        self.mock_feedback.comment(mox.StrContains("Downloading RSR archive file"))
        self.mock_internet.file_from_url_exists_in_directory(self.rsr_archive_url, self.archives_dir_on_host).AndReturn(True)
        self.mock_internet.file_name_at_url(self.rsr_archive_url).AndReturn(self.archive_file_name)
        existing_archive_file = os.path.join(self.archives_dir_on_host, self.archive_file_name)
        self.mock_feedback.comment(mox.StrContains("Latest archive already exists at: %s" % existing_archive_file))
        self.mox.ReplayAll()

        self.codebase._download_rsr_archive()

    def test_can_unpack_rsr_code_archive_on_host(self):
        """fab.tests.helpers.codebase_test  Can unpack RSR code archive on host"""

        self._set_expected_deployment_configuration()

        self.mock_feedback.comment(mox.StrContains("Unpacking RSR archive in %s" % self.rsr_deployment_root))
        self.mock_internet.file_name_at_url(self.rsr_archive_url).AndReturn(self.archive_file_name)
        self.mock_deployment_host.run("unzip -q %s -d %s -x */.gitignore" % (self.archive_file_name, self.repo_checkout_root))
        self.mock_deployment_host.run("mv %s %s" % (self.unpacked_archive_match, self.rsr_deployment_root))
        self.mock_permissions.set_akvo_ownership_on_path(self.rsr_deployment_root)
        self.mox.ReplayAll()

        self.codebase._unpack_rsr_archive()

    def _set_expected_deployment_configuration(self):
        self.repo_checkout_root = "/var/repo"
        self.rsr_deployment_root = "/var/repo/rsr"
        self.archives_dir_on_host = "/var/repo/archives"
        self.archive_file_name = "rsr-archive-1.0.9.zip"
        self.rsr_branch = "some_dev_branch"
        self.rsr_archive_url = "http://repo.server.org/archives/rsr/%s" % self.rsr_branch
        self.unpacked_archive_match = "/var/repo/rsr-archive-*"

        self.mock_config.repo_checkout_root = self.repo_checkout_root
        self.mock_config.rsr_deployment_root = self.rsr_deployment_root
        self.mock_config.repo_archives_dir = self.archives_dir_on_host
        self.mock_config.rsr_branch = self.rsr_branch
        self.mock_config.rsr_archive_url = self.rsr_archive_url
        self.mock_config.unpacked_rsr_archive_match = self.unpacked_archive_match


def suite():
    return TestSuiteLoader().load_tests_from(CodebaseTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
