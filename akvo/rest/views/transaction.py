# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Transaction

from ..serializers import TransactionSerializer
from ..viewsets import BaseRSRViewSet


class TransactionViewSet(BaseRSRViewSet):
    """
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_fields = (
        'project', 'reference', 'transaction_type', 'currency', 'provider_organisation', 'receiver_organisation',
        'provider_organisation_ref', 'receiver_organisation_ref'
    )
