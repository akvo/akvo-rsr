# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import requests
from typing import Dict, Any, Optional
from dataclasses import dataclass

IATI_VALIDATOR_URL = "https://api.iatistandard.org/validator/validate?group=true&details=false"


class IATIValidatorException(Exception):
    pass


class IATIValidatorTimeoutException(IATIValidatorException):
    pass


class IATIValidatorResponseException(IATIValidatorException):

    def __init__(self, status_code: int, content: str):
        self.status_code = status_code
        self.content = content
        super().__init__(f"Error response {status_code=}, {content=}")


@dataclass(frozen=True)
class IATIValidationResult:
    error_count: int
    warning_count: int
    data: Dict[str, Any]

    @classmethod
    def make(cls, data: Dict[str, Any]):
        return cls(
            error_count=data['summary']['error'] + data['summary']['critical'],
            warning_count=data['summary']['warning'],
            data=data,
        )


class IATIValidatorAPI:
    ''' An abstraction class for IATI validator API service

    https://developer.iatistandard.org/api-details#api=iati-validator-v2&operation=post-pub-validate-post
    '''

    def __init__(self, subscription_key: str, timeout: Optional[float] = None):
        self.subscription_key = subscription_key
        self.timeout = timeout

    def validate(self, xml_doc: bytes) -> IATIValidationResult:
        headers = {
            'Content-Type': 'application/xml',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': self.subscription_key,
        }
        try:
            response = requests.post(IATI_VALIDATOR_URL, data=xml_doc, headers=headers, timeout=self.timeout)
        except requests.Timeout as te:
            # Caller could retry when connection timeout
            raise IATIValidatorTimeoutException() from te
        except requests.RequestException as re:
            # Could be caused by bad configuration
            raise IATIValidatorException() from re

        if response.status_code not in [200, 422]:
            # More likely caused by bad configuration
            raise IATIValidatorResponseException(response.status_code, str(response.content))

        return IATIValidationResult.make(response.json())
