# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def humanitarian_scope(project):
    """
    Check if all humanitarian scopes have a code, type and vocabulary.

    In case the the vocabulary is '99', check if the vocabulary URI is filled in.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for scope in project.humanitarian_scopes.all():
        if not scope.code:
            all_checks_passed = False
            checks.append(('error', 'humanitarian scope (id: %s) is missing code' %
                           str(scope.pk)))

        if not scope.type:
            all_checks_passed = False
            checks.append(('error', 'humanitarian scope (id: %s) is missing type' %
                           str(scope.pk)))

        if not scope.vocabulary:
            all_checks_passed = False
            checks.append(('error', 'humanitarian scope (id: %s) is missing vocabulary' %
                           str(scope.pk)))

        if not scope.vocabulary == '99' and not scope.vocabulary_uri:
            checks.append(('warning', 'humanitarian scope (id: %s) has vocabulary 99 (reporting '
                           'organisation), but no vocabulary URI specified' %
                           str(scope.pk)))

    return all_checks_passed, checks
