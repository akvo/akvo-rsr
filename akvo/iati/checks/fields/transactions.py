# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date


def transactions(project):
    """
    Check if transaction has a type, date (in the past or today) and value.
    Check if the transaction has a currency if there is not default currency.
    Check if provider and receiver org have a IATI identifier.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    prefetch_attributes = (
        'receiver_organisation',
        'provider_organisation',
    )
    for transaction in project.transactions.prefetch_related(*prefetch_attributes).all():
        if not transaction.transaction_type:
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) has no type' % str(transaction.pk)))

        if not transaction.transaction_date:
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) has no date' % str(transaction.pk)))
        elif transaction.transaction_date > date.today():
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) has a date in the future' %
                           str(transaction.pk)))

        if transaction.value is None:
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) has no value' % str(transaction.pk)))

        if not transaction.value_date:
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) has no value date' %
                           str(transaction.pk)))

        if not (transaction.currency or project.currency):
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) has no currency and no default '
                                     u'currency specified' % str(transaction.pk)))

        if transaction.receiver_organisation and not transaction.receiver_organisation.iati_org_id:
            checks.append((u'warning', u'receiver organisation of transaction (id: %s) has no '
                                       u'IATI identifier' % str(transaction.pk)))

        if transaction.provider_organisation and not transaction.provider_organisation.iati_org_id:
            checks.append((u'warning', u'provider organisation of transaction (id: %s) has no '
                                       u'IATI identifier' % str(transaction.pk)))

        if (transaction.recipient_region_vocabulary or
                transaction.recipient_region_vocabulary_uri) and not transaction.recipient_region:
            all_checks_passed = False
            checks.append((u'error', u'transaction (id: %s) is missing a recipient region' %
                           str(transaction.pk)))

        if transaction.recipient_region_vocabulary == '99' and \
                not transaction.recipient_region_vocabulary_uri:
            checks.append((u'warning', u'transaction (id: %s) recipient region has vocabulary 99 '
                                       u'(reporting organisation), but no vocabulary URI '
                                       u'specified' %
                           str(transaction.pk)))

    if project.transactions.all() and all_checks_passed:
        checks.append((u'success', u'has valid transaction(s)'))

    return all_checks_passed, checks
