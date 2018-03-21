# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys
import re

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _


def string_validator(value):
    # Based on http://stackoverflow.com/questions/1707890/fast-way-to-filter-illegal-xml-unicode-chars-in-python
    # Example of non-allowed character: ﷐
    _illegal_unichrs = [(0x00, 0x08), (0x0B, 0x0C), (0x0E, 0x1F), (0x7F, 0x84), (0x86, 0x9F), (0xFDD0, 0xFDDF),
                        (0xFFFE, 0xFFFF)]

    if sys.maxunicode >= 0x10000:  # not narrow build
        _illegal_unichrs.extend([(0x1FFFE, 0x1FFFF), (0x2FFFE, 0x2FFFF), (0x3FFFE, 0x3FFFF), (0x4FFFE, 0x4FFFF),
                                 (0x5FFFE, 0x5FFFF), (0x6FFFE, 0x6FFFF), (0x7FFFE, 0x7FFFF), (0x8FFFE, 0x8FFFF),
                                 (0x9FFFE, 0x9FFFF), (0xAFFFE, 0xAFFFF), (0xBFFFE, 0xBFFFF), (0xCFFFE, 0xCFFFF),
                                 (0xDFFFE, 0xDFFFF), (0xEFFFE, 0xEFFFF), (0xFFFFE, 0xFFFFF), (0x10FFFE, 0x10FFFF)])

    _illegal_ranges = ["%s-%s" % (unichr(low), unichr(high)) for (low, high) in _illegal_unichrs]

    RESTRICTED_CHARACTERS = re.compile(u'[%s]' % u''.join(_illegal_ranges))

    match = re.search(RESTRICTED_CHARACTERS, value)
    if match:
        raise ValidationError(match.group(0) + ' ' + _(u'is not an allowed character'))


def hostname_validator(value):
    if re.search(u'[^a-zA-Z0-9-]', value) is not None or value[0] == '-' or value[-1] == '-':
        # https://tools.ietf.org/html/rfc1035
        raise ValidationError(
            'Only alpha numeric characters and hyphen are allowed. '
            'Hostnames cannot start or end with a hyphen')
