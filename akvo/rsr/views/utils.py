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


def check_project_viewing_permissions(request, project):
    """Checks if the current user can view a project, otherwise raises PermissionDenied.

    A user can view any public project, but when a project is private or not
    published the user should be logged in and able to make changes to the
    project (e.g. be an admin of the project).

    """
    user = request.user
    site = request.rsr_page
    # If site has a valid password, and we arrive here, RSRLockdownMiddleware
    # has already ensured that the user entered the site's password correctly.
    if not ((site and site.password and project.is_published()) or
            (project.is_public and project.is_published()) or
            user.has_perm('rsr.view_project', project)):
        raise PermissionDenied


def get_hierarchy_grid(project, include_private=False):
    """Return a hierarchy grid for a project"""

    parents = project.parents() if not include_private else project.parents_all()
    siblings = project.siblings() if not include_private else project.siblings_all()
    children = project.children() if not include_private else project.children_all()

    # Create the lay-out of the grid
    max_rows = max(parents.count(), siblings.count() + 1, children.count())
    parent_rows = _get_hierarchy_row(max_rows, parents)
    siblings_rows = _get_hierarchy_row(max_rows - 1, siblings)
    siblings_rows.insert((max_rows - 1) / 2, 'project')
    children_rows = _get_hierarchy_row(max_rows, children)

    grid = []
    project_added = False
    for row in range(max_rows):
        grid.append([])

        grid[row].append([parent_rows[row], 'parent']) if parent_rows[row] \
            else grid[row].append(None)

        if siblings_rows[row] == 'project':
            grid[row].append([project, 'project'])
            project_added = True
        elif not project_added:
            grid[row].append([siblings_rows[row], 'sibling-top']) if siblings_rows[row] \
                else grid[row].append(None)
        else:
            grid[row].append([siblings_rows[row], 'sibling-bottom']) if siblings_rows[row] \
                else grid[row].append(None)

        grid[row].append([children_rows[row], 'child']) if children_rows[row] \
            else grid[row].append(None)

    return grid


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


def _get_hierarchy_row(max_rows, projects):
    """Return a column for the project hierarchy with a division.

    E.g. with a max_rows of 4 and one project, it will return [False,
    <Project>, False, False].
    """
    project_count = projects.count()
    if max_rows == project_count:
        return [project for project in projects]
    empty_begin = (max_rows - project_count) / 2
    empty_end = (max_rows - project_count) / 2 + ((max_rows - project_count) % 2)
    rows = []
    for row in range(empty_begin):
        rows.append(False)
    for project in projects:
        rows.append(project)
    for row in range(empty_end):
        rows.append(False)
    return rows
