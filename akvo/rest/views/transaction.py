# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Transaction, TransactionSector
from ..serializers import TransactionSerializer, TransactionSectorSerializer
from ..viewsets import BaseRSRViewSet, PublicRSRViewSet


class TransactionViewSet(PublicRSRViewSet):
    """Transaction resource."""

    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_fields = (
        'project', 'reference', 'transaction_type', 'currency', 'provider_organisation',
        'receiver_organisation')


class TransactionSectorViewSet(BaseRSRViewSet):
    """Transaction sector resource."""

    queryset = TransactionSector.objects.filter(transaction__project__is_private=False)
    serializer_class = TransactionSectorSerializer
    filter_fields = ('transaction', 'code')
