# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, urllib2


class Internet(object):

    def __init__(self, host_controller):
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    def file_name_at_url(self, url):
        return self._redirected_url(url).split('/')[-1]

    def _redirected_url(self, initial_url):
        # we use geturl() to get the final URL and file name after any redirects
        return urllib2.urlopen(initial_url).geturl()

    def file_name_from_url_headers(self, url):
        response_info = self._http_response_info_for(url)
        content_disposition_header = "Content-Disposition"

        if content_disposition_header.lower() in response_info.keys():
            return response_info.getheader(content_disposition_header).split("=")[1]
        else:
            self.feedback.abort("%s header not available for parsing file name" % content_disposition_header)

    def _http_response_info_for(self, url):
        return urllib2.urlopen(url).info()

    def download_file_to_directory(self, download_dir, file_url):
        with self.host_controller.cd(download_dir):
            self.host_controller.run("wget -nv %s" % file_url)

    def download_file_at_url_as(self, downloaded_file_path, file_url):
        # When we have a more recent version of wget on our servers we can enable parsing the download
        # file name from the HTTP response headers with the --content-disposition option
        self.host_controller.run("wget -nv -O %s %s" % (downloaded_file_path, file_url))
