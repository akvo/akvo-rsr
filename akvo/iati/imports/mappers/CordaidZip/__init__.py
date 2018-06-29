# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.utils import get_sha1_hash

from .financials import BudgetItems
from .links import CurrentImage
from .partnerships import Partnerships

__all__ = [
    'BudgetItems',
    'CurrentImage',
    'Partnerships',
]

CORDAID = 'Cordaid'
CORDAID_ORG_ID = 273
OTHERS = 'Others'
OTHERS_ORG_ID = 1653


def same_data(f1, f2):
    """ Compare two file like objects for sameness by comparing sha1 hashes of them """
    if not f1 or f2:
        return False
    f1.seek(0)
    f1_hash = get_sha1_hash(f1.read())
    f2.seek(0)
    f2_hash = get_sha1_hash(f2.read())
    return f1_hash == f2_hash
