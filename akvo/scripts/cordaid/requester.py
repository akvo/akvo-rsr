# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import requests

from django.http import HttpResponse


class HttpOK(HttpResponse):
    status_code = 200


class Requester():
    """
    wrapper class for requests
    """
    def __init__(self, method='get', url_template=None, url_args=None, headers=None, data=None, accept_codes=[]):
        self.method = method
        self.url = url_template.format(**url_args)
        self.headers = headers
        self.data = data
        self.error = None

        kwargs = {}
        if self.headers:
            kwargs.update(headers=self.headers)
        if self.data:
            kwargs.update(data=self.data)
        try:
            self.response = getattr(requests, self.method)(self.url, **kwargs)
        except Exception, e:
            raise Exception("Error in request. Error msg:\n {message}".format(message=e.message))
        if not (self.response.status_code == HttpOK.status_code or self.response.status_code in accept_codes):
            error_msg = "Non-OK response. Status: {status}\nMethod: {method}\nURL:{url}{message}".format(
                status=self.response.status_code,
                method=self.method,
                url=self.url,
                message="\nResponse text: {text}".format(text=self.response.text) if self.response.text else ""
            )
            raise Exception(error_msg)
