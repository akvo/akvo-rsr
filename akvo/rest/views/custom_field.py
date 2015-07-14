# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import CustomField

from ..serializers import CustomFieldSerializer
from ..viewsets import BaseRSRViewSet


class CustomFieldViewSet(BaseRSRViewSet):
    """
    """
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer
    filter_fields = ('project', 'name', )
