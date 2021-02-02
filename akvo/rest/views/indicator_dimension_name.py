# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.shortcuts import get_object_or_404
from akvo.rsr.models import IndicatorDimensionName
from akvo.rsr.models.result import utils

from ..serializers import IndicatorDimensionNameSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorDimensionNameViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorDimensionName.objects.prefetch_related('dimension_values')
    serializer_class = IndicatorDimensionNameSerializer
    project_relation = 'project__'

    def destroy(self, request, *args, **kwargs):
        dn = get_object_or_404(IndicatorDimensionName, pk=kwargs['pk'])
        utils.purge_dimension_name_relations(dn)
        return super().destroy(request, *args, **kwargs)
