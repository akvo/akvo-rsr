# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

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
            checks.append(('error', json.dumps({
               'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) has no type'})))

        if not transaction.transaction_date:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) has no date'})))
        elif transaction.transaction_date > date.today():
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) has a date in the future'})))

        if transaction.value is None:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) has no value'})))

        if not transaction.value_date:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) has no value date'})))

        if not (transaction.currency or project.currency):
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) has no currency and no default currency specified'})))

        if transaction.receiver_organisation and not transaction.receiver_organisation.iati_org_id:
            checks.append(('warning', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'receiver organisation of transaction (id: {transaction.id}) has no IATI identifier'})))

        if transaction.provider_organisation and not transaction.provider_organisation.iati_org_id:
            checks.append(('warning', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'provider organisation of transaction (id: {transaction.id}) has no IATI identifier'})))

        if (transaction.recipient_region_vocabulary
                or transaction.recipient_region_vocabulary_uri) and not transaction.recipient_region:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'transaction', 'id': transaction.id, 'message': f'transaction (id: {transaction.id}) is missing a recipient region'})))

        if transaction.recipient_region_vocabulary == '99' and \
                not transaction.recipient_region_vocabulary_uri:
            checks.append(('warning', json.dumps({
                'model': 'transaction', 
                'id': transaction.id,
                'message': f'transaction (id: {transaction.id}) recipient region has vocabulary 99 (reporting organisation), but no vocabulary URI specified'
            })))

    if project.transactions.all() and all_checks_passed:
        checks.append(('success', 'has valid transaction(s)'))

    return all_checks_passed, checks
