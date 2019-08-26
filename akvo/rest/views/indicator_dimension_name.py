# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType
from akvo.rsr.models import IndicatorDimensionName

from ..serializers import IndicatorDimensionNameSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorDimensionNameViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorDimensionName.objects.prefetch_related('dimension_values')
    serializer_class = IndicatorDimensionNameSerializer
    project_relation = 'project__'

    def create(self, request, *args, **kwargs):
        response = super(IndicatorDimensionNameViewSet, self).create(request, *args, **kwargs)
        self._log_action(ADDITION, response.data, str(request.data))
        return response

    def update(self, request, *args, **kwargs):
        response = super(IndicatorDimensionNameViewSet, self).update(request, *args, **kwargs)
        self._log_action(CHANGE, response.data, str(request.data))
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        data = {'id': instance.id, 'name': instance.name}
        response = super(IndicatorDimensionNameViewSet, self).destroy(request, *args, **kwargs)
        self._log_action(DELETION, data)
        return response

    def _log_action(self, action_flag, instance, message=''):
        user = self.request.user
        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(IndicatorDimensionName).pk,
            object_id=instance['id'],
            object_repr=str(instance),
            action_flag=action_flag,
            change_message=message
        )
