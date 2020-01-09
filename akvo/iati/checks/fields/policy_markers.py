# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def policy_markers(project):
    """
    Check if policy marker has a code and significance.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for policy_marker in project.policy_markers.all():
        if not policy_marker.policy_marker:
            all_checks_passed = False
            checks.append(('error', 'policy marker (id: %s) has no code' % str(policy_marker.pk)))

        if (not policy_marker.vocabulary or policy_marker.vocabulary == '1') and \
                not policy_marker.significance:
            all_checks_passed = False
            checks.append(('error', 'policy marker (id: %s) has no significance specified' %
                           str(policy_marker.pk)))

        if policy_marker.vocabulary == '99' and not policy_marker.vocabulary_uri:
            checks.append(('warning', 'policy marker (id: %s) has vocabulary 99 (reporting '
                           'organisation), but no vocabulary URI specified' %
                           str(policy_marker.pk)))

    if project.policy_markers.all() and all_checks_passed:
        checks.append(('success', 'has valid policy marker(s)'))

    return all_checks_passed, checks
