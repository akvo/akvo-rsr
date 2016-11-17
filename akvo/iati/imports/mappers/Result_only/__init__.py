# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# Custom mapper that only imports Result.
# Note we're importing the regular Result here, this mapper is special in that it __only__ uses the
# Result mapper class.

from ..results import Results

__all__ = [
    'Results',
]
