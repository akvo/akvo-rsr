# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# NOTE: this is a modified version of the Requester used for the Cordaid upload scripts
# TODO: Consolidate the two versions, possibly creating an external python library

import os
import requests

from rest_framework.status import HTTP_200_OK


class Requester():
    """
    wrapper class for requests
    __init__ params:
        method: HTTP method used in the request
        url_template: string used as basis for construction of the URL when combined with
        url_args: dict with arguments to url_template.format()
        headers: HTTP headers to include in the request
        data: the request payload
        accept_codes: HTTP status codes that signify success, any other response status code is considered an error and
        raises an exception with error info
    """
    def __init__(
            self, method='get', url_template='', url_args=None, headers=None,
            data=None, accept_codes=None, kwargs=None,
    ):
        self.method = method
        self.url = url_template.format(**url_args or {})
        self.headers = headers
        self.data = data
        self.error = None
        if accept_codes is None:
            accept_codes = [requests.codes.ok]
        if kwargs is None:
            kwargs = {}

        if self.headers:
            kwargs.update(headers=self.headers)
        if self.data:
            kwargs.update(data=self.data)
        try:
            self.response = getattr(requests, self.method)(self.url, **kwargs)
        except Exception, e:
            raise Exception("Error in request. Error msg:\n {message}".format(message=e.message))
        if not (self.response.status_code in accept_codes):
            error_msg = "Non-OK response. Status: {status}\nMethod: {method}\nURL:{url}{message}".format(
                status=self.response.status_code,
                method=self.method,
                url=self.url,
                message="\nResponse text: {text}".format(text=self.response.text) if self.response.text else ""
            )
            raise Exception(error_msg)


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
        _, extension = os.path.splitext(self.path_or_uri)
        # get the image if the extension is in ALLOWED_EXTENSIONS
        if extension.lower() in self.ALLOWED_EXTENSIONS:
            self.filename = "temp{}".format(extension.lower())
            try:
                request = Requester(url_template=self.path_or_uri, **{'kwargs': {'stream': True}})
            except Exception, e:
                error_msg = "Error when fetching image at {img_url}\nError message: {message}".format(
                    img_url=self.path_or_uri,
                    message=e.message
                )
                raise Exception(error_msg)
            else:
                for chunk in request.response.iter_content(1024):
                    self.image += chunk

    def get_from_path(self):
        _, extension = os.path.splitext(self.path_or_uri)
        # get the image if the extension is in ALLOWED_EXTENSIONS
        if extension.lower() in self.ALLOWED_EXTENSIONS:
            self.filename = "temp{}".format(extension.lower())
            with open(self.path_or_uri, "rb") as f:
                self.image = f.read()

    def get_image(self):
        if self._method == self.METHOD_HTTP:
            self.get_from_url()
        else:
            self.get_from_path()

    def to_base64(self):
        return self.image.encode("base64")
