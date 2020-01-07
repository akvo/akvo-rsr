# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def crs_add(project):
    """
    Check if crs add other flags have a code and significance.
    Check if loan status year is present if any of the other loan status fields
    is present.
    Check if loan status currency or default currency is present if any of
    the other loan status fields is present.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    crs = getattr(project, 'crsadd', None)

    if crs:
        for flag in crs.other_flags.all():
            if not flag.code:
                all_checks_passed = False
                checks.append((u'error', u'CRS other flag (id: %s) has no code specified' %
                               str(flag.pk)))

            if flag.significance is None:
                all_checks_passed = False
                checks.append((u'error', u'CRS other flag (id: %s) has no significance specified' %
                               str(flag.pk)))

        if not crs.loan_status_year and (crs.loan_status_currency or crs.loan_status_value_date
                                         or crs.interest_received is not None or crs.principal_outstanding is not None
                                         or crs.principal_arrears is not None or crs.interest_arrears is not None):
            all_checks_passed = False
            checks.append((u'error', u'CRS (id: %s) has no loan status year specified' %
                           str(crs.pk)))

        if not (crs.loan_status_currency or project.currency) and \
                (crs.loan_status_year or crs.loan_status_value_date
                 or crs.interest_received is not None or crs.principal_outstanding is not None
                 or crs.principal_arrears is not None or crs.interest_arrears is not None):
            checks.append((u'error', u'CRS (id: %s) has no loan status currency specified '
                                     u'and no default currency specified' % str(crs.pk)))

        if all_checks_passed:
            checks.append((u'success', u'has valid CRS'))

    return all_checks_passed, checks
