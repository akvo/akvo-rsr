#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.hosts import RemoteHost
from fab.helpers.internet import Internet


class StubbedInternet(Internet):
    """Stubbed implementation of the Internet class so that we don't need actual internet access for the tests to run."""

    def _redirected_url(self, initial_url):
        # stub the actual network call for getting a redirected URL
        return self.redirected_url


class InternetTest(mox.MoxTestBase):

    def setUp(self):
        super(InternetTest, self).setUp()
        self.mock_remote_host = self.mox.CreateMock(RemoteHost)

        self.internet = StubbedInternet(self.mock_remote_host)

    def test_can_get_file_name_at_specified_url(self):
        """fab.tests.helpers.internet_test  Can get file name at a specified URL"""

        url_without_redirection = "http://some.server.org/initial/page.html"
        self.internet.redirected_url = url_without_redirection

        self.assertEqual("page.html", self.internet.file_name_at_url(url_without_redirection))

    def test_can_get_file_name_at_specified_redirecting_url(self):
        """fab.tests.helpers.internet_test  Can get file name at a specified redirecting URL"""

        url_with_redirection = "http://some.server.org/initial/page.html"
        self.internet.redirected_url = "http://some.server.org/redirected/final_page"

        self.assertEqual("final_page", self.internet.file_name_at_url(url_with_redirection))

    def test_can_check_whether_file_at_url_exists_at_specified_host_path(self):
        """fab.tests.helpers.internet_test  Can check whether a file at a URL exists at a specified host path"""

        archive_info_url = "http://some.server.org/archive/info/download_archive108.html"
        self.internet.redirected_url = "http://some.server.org/archives/archive108.zip"
        self.mock_remote_host.path_exists("/var/host/archives/archive108.zip").AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.internet.file_at_url_exists_in_directory(archive_info_url, "/var/host/archives"))

    def test_can_fetch_file_at_url(self):
        """fab.tests.helpers.internet_test  Can fetch the file at a specified URL"""

        file_url = "http://some.server.org/file.zip"
        download_dir = "/var/tmp/archives"
        self.mock_remote_host.run("wget -nv -P %s %s" % (download_dir, file_url))
        self.mox.ReplayAll()

        self.internet.fetch_file_at_url(file_url, download_dir)


def suite():
    return TestSuiteLoader().load_tests_from(InternetTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
