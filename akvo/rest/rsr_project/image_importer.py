# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import glob
import os
from os.path import basename, splitext

from rest_framework.status import HTTP_200_OK

from requester2 import Requester


class ImageImporter():
    """ fetch an image from either a path or a full URL
"""
    ALLOWED_EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif")
    METHOD_HTTP = 1
    METHOD_FILE = 2

    def __init__(self, path_or_uri):
        # TODO: do we really need the path? Shouldn't path_or_uri be the full path including file name if we load local files?
        # If the image is in a directory self.name is set to /path/to/images/<name>.*
        if path_or_uri[:4] == "http":
            self.path_or_uri = path_or_uri
            self._method = self.METHOD_HTTP
        else:
            if os.path.isabs(path_or_uri):
                path = path_or_uri
            else:
                path = os.path.join(os.path.dirname(os.path.realpath(__file__)), path_or_uri)
            self.path_or_uri = path
            self._method = self.METHOD_FILE
        self.image = b''

    def get_from_url(self):
        try:
            request = Requester(url_template=self.path_or_uri, **{'kwargs': {'stream': True}})
        except Exception, e:
            print "*** Error getting image from da Indertubes: *** \n{}".format(e.message)
        else:
            if request.response.status_code is HTTP_200_OK:
                for chunk in request.response.iter_content(1024):
                    self.image += chunk
            else:
                print "*** Error getting image from da Indertubes ***"

    def get_from_path(self):
        _, extension = splitext(self.path_or_uri)
        # and get the image if the extension is in ALLOWED_EXTENSIONS
        if extension.lower() in self.ALLOWED_EXTENSIONS:
            with open(self.path_or_uri, "rb") as f:
                self.image = f.read()

    def get_image(self):
        if self._method == self.METHOD_HTTP:
            self.get_from_url()
        else:
            self.get_from_path()

    def to_base64(self):
        return self.image.encode("base64")
