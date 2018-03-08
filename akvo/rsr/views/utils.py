# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

from django.core.exceptions import PermissionDenied


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


def check_project_viewing_permissions(user, project):
    """Checks if the user can view a project, otherwise raises PermissionDenied.

    A user can view any public project, but when a project is private or not
    published the user should be logged in and able to make changes to the
    project (e.g. be an admin of the project).

    """

    if not ((project.is_public and project.is_published()) or
            user.has_perm('rsr.view_project', project)):
        raise PermissionDenied


def org_projects(organisation):
    """Published projects of an organisation."""
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


def toJSBoolean(bool):
    return 'true' if bool else 'false'
