#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.hosts import RemoteHost
from fab.helpers.internet import Internet


class StubbedInternet(Internet):
    """Stubbed implementation of the Internet class so that we don't need actual internet access for the tests to run."""

    def _redirected_url(self, initial_url):
        # stub the actual network call for getting a redirected URL
        return self.redirected_url

    def _http_response_info_for(self, url):
        return self.response_info


class FakeHttpResponseInfo(object):

    def __init__(self, headers):
        self.headers = headers

    def keys(self):
        return map(lambda key: key.lower(), self.headers.keys())

    def getheader(self, header_name):
        return self.headers[header_name]


class InternetTest(mox.MoxTestBase):

    def setUp(self):
        super(InternetTest, self).setUp()
        self.mock_remote_host = self.mox.CreateMock(RemoteHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_remote_host.feedback = self.mock_feedback

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

    def test_can_get_file_name_from_url_headers(self):
        """fab.tests.helpers.internet_test  Can get file name from URL headers"""

        file_url = "http://some.server.org/code/archives/dev"
        expected_file_name = "rsr_v1.0.10.zip"

        headers_with_file_name = {"Server": "nginx/1.0.4",
                                  "Content-Type": "application/octet-stream",
                                  "Content-Disposition": "attachment; filename=%s" % expected_file_name}

        self.internet.response_info = FakeHttpResponseInfo(headers_with_file_name)
        self.mox.ReplayAll()

        self.assertEqual(expected_file_name, self.internet.file_name_from_url_headers(file_url))

    def test_will_abort_if_file_name_cannot_be_retrieved_from_url_headers(self):
        """fab.tests.helpers.internet_test  Will abort if file name cannot be retrieved from URL headers"""

        file_url = "http://some.server.org/code/archives/dev"
        expected_file_name = "rsr_v1.0.10.zip"

        headers_without_file_name = {"Server": "nginx/1.0.4",
                                     "Content-Type": "application/octet-stream"}

        self.internet.response_info = FakeHttpResponseInfo(headers_without_file_name)
        header_not_available_message = "Content-Disposition header not available for parsing file name"
        self.mock_feedback.abort(header_not_available_message).AndRaise(SystemExit(header_not_available_message))
        self.mox.ReplayAll()

        try:
            self.internet.file_name_from_url_headers(file_url)
            self.fail("Should have raised a SystemExit exception if the file name could not be read from the HTTP response headers")
        except SystemExit: # expected
            pass

    def test_can_download_file_at_url_and_save_it_with_specified_file_name(self):
        """fab.tests.helpers.internet_test  Can download the file at a URL and save it with a specified file name"""

        file_url = "http://some.server.org/file.zip"
        downloaded_file_path = "/var/tmp/archives/rsr_archive.zip"
        self.mock_remote_host.run("wget -nv -O %s %s" % (downloaded_file_path, file_url))
        self.mox.ReplayAll()

        self.internet.download_file_at_url_as(downloaded_file_path, file_url)


def suite():
    return TestSuiteLoader().load_tests_from(InternetTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
