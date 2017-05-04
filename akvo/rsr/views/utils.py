# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""


def apply_keywords(page, project_qs):
    """Apply keywords.

    If keywords exist, check if they should be used for filtering or exclusion.
    """
    if not page.keywords.all():
        return project_qs

    if page.exclude_keywords:
        return project_qs.exclude(keywords__in=page.keywords.all())
    else:
        return project_qs.filter(keywords__in=page.keywords.all())


def org_projects(organisation):
    """."""
    return organisation.published_projects().select_related(
        'partners',
        'categories',
        'primary_location',
        'primary_location__country',
    ).prefetch_related(
        'categories',
        'partners'
    ).order_by('-id')


def show_filter_class(qs, filters):
    """To simplify template, instead of bool adhere to bootstrap class name."""
    return "" if frozenset(qs.keys()).isdisjoint(filters) else "in"
