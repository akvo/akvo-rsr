# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings


def get_qs_elements_for_page(qs, request, count):
    """Return queryset elements to be shown on the current page"""
    limit = int_or_none(request.GET.get('limit')) or settings.PROJECT_DIRECTORY_PAGE_SIZES[0]
    limit = min(limit, settings.PROJECT_DIRECTORY_PAGE_SIZES[-1])
    max_page_number = 1 + int(count / limit)
    page_number = min(max_page_number, int_or_none(request.GET.get('page')) or 1)
    start = (page_number - 1) * limit
    end = page_number * limit
    return qs[start:end]


def int_or_none(value):
    """Return int or None given a value."""
    try:
        return int(value)
    except Exception:
        return None
