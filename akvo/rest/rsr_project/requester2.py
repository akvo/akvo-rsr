# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# NOTE: this is a modified version of the Requester used for the Cordaid upload scripts
# TODO: Consolidate the two versions, possibly creating an external python library

import requests
from requests import codes

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
            self, method='get', url_template='', url_args={}, headers=None,
            data=None, accept_codes=[codes.ok], kwargs={},
    ):
        self.method = method
        self.url = url_template.format(**url_args)
        self.headers = headers
        self.data = data
        self.error = None

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
