# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def related_activities(project):
    """
    Check if related project has an IATI identifier and relation.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    related_projects_count = project.related_projects.count()

    for rp in project.related_projects.prefetch_related('related_project').all():
        if not (rp.related_project or rp.related_iati_id):
            all_checks_passed = False
            checks.append((u'error', u'related project or IATI identifier not specified'))

        elif rp.related_project and not rp.related_project.iati_activity_id:
            all_checks_passed = False
            checks.append((u'error', u'related project (id: %s) has no IATI identifier specified' %
                           str(rp.related_project.pk)))

        if not rp.relation:
            all_checks_passed = False
            checks.append((u'error', u'relation missing for related project'))

    if related_projects_count > 0 and all_checks_passed:
        checks.append((u'success', u'has valid related project(s)'))

    return all_checks_passed, checks
