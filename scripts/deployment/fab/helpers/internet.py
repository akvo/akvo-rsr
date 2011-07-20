# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, urllib2


class Internet(object):

    def __init__(self, deployment_host):
        self.deployment_host = deployment_host

    def file_from_url_exists_in_directory(self, url, dir_path):
        return self.deployment_host.path_exists(os.path.join(dir_path, self.file_name_at_url(url)))

    def file_name_at_url(self, url):
        return self._redirected_url(url).split('/')[-1]

    def _redirected_url(self, initial_url):
        # we use geturl() to get the final URL and file name after any redirects
        return urllib2.urlopen(initial_url).geturl()
