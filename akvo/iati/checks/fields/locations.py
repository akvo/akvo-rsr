# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def locations(project):
    """
    If a(n administrative) code is specified, a vocabulary needs to be specified as well.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for location in project.locations.all():
        if location.location_code and not location.vocabulary:
            all_checks_passed = False
            checks.append(('error', 'location (id: %s) has code, but no vocabulary' %
                           str(location.pk)))

        for administrative in location.administratives.all():
            if (administrative.code and not administrative.vocabulary) or \
                    (administrative.code and not administrative.vocabulary):
                all_checks_passed = False
                checks.append(('error', 'administrative location (id: %s) code or vocabulary is '
                               'missing' % str(administrative.pk)))

    if project.locations.all() and all_checks_passed:
        checks.append(('success', 'has valid location(s)'))

    return all_checks_passed, checks
