# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ValidationError
from django.test import TestCase

from akvo.rsr.validators import hostname_validator

INVALID_HOSTNAMES = [
    '-9gag',
    '9gag-',
    '9.gag',
    '9,gag',
]


VALID_HOSTNAMES = [
    '9gag',
    '9-gag',
    'gag9',
    'www',
    '999',
]


class ValidatorTestCase(TestCase):
    """Testing that validators work correctly."""

    def test_invalid_hostnames_should_raise_error(self):
        for hostname in INVALID_HOSTNAMES:
            with self.assertRaises(ValidationError):
                hostname_validator(hostname)

    def test_valid_hostnames_should_get_validated(self):
        for hostname in VALID_HOSTNAMES:
            hostname_validator(hostname)
