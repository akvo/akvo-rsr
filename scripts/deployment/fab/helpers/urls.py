# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, urllib2

import fabric.contrib.files as files


class URLHelper():

    def url_file_exists_at_path(self, url, path):
        return files.exists(os.path.join(path, self.file_name_at_url(url)))

    def file_name_at_url(self, url):
        # we use geturl() to get the final file name after any redirects
        return urllib2.urlopen(url).geturl().split('/')[-1]
