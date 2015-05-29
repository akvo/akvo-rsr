# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


def contains_template_errors(markup):
    """Itterate over the markup looking for common errors."""
    common_errors = ['{%', '%}', '{{', '}}']
    return any(x in markup for x in common_errors)
