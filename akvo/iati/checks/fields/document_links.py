# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def document_links(project):
    """
    Check if document link has an url, format, title and category.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for doc in project.documents.all():
        if not (doc.url or doc.document):
            all_checks_passed = False
            checks.append(('error', 'document link (id: %s) has no url or document specified' %
                           str(doc.pk)))

        if not doc.format:
            all_checks_passed = False
            checks.append(('error', 'document link (id: %s) has no format specified' %
                           str(doc.pk)))

        if not doc.title:
            all_checks_passed = False
            checks.append(('error', 'document link (id: %s) has no title specified' %
                           str(doc.pk)))

        if not doc.categories.all():
            all_checks_passed = False
            checks.append(('error', 'document link (id: %s) needs to have at least one category '
                           'specified' % str(doc.pk)))

    if project.documents.all() and all_checks_passed:
        checks.append(('success', 'has valid document(s)'))

    return all_checks_passed, checks
