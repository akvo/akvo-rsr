# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType
from akvo.rsr.models import IndicatorDimensionValue

from ..serializers import IndicatorDimensionValueSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorDimensionValueViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorDimensionValue.objects.all()
    serializer_class = IndicatorDimensionValueSerializer
    project_relation = 'name__project__'

    def create(self, request, *args, **kwargs):
        response = super(IndicatorDimensionValueViewSet, self).create(request, *args, **kwargs)
        self._log_action(ADDITION, response.data, str(request.data))
        return response

    def update(self, request, *args, **kwargs):
        response = super(IndicatorDimensionValueViewSet, self).update(request, *args, **kwargs)
        self._log_action(CHANGE, response.data, str(request.data))
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        data = {'id': instance.id, 'value': instance.value}
        response = super(IndicatorDimensionValueViewSet, self).destroy(request, *args, **kwargs)
        self._log_action(DELETION, data)
        return response

    def _log_action(self, action_flag, instance, message=''):
        user = self.request.user
        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(IndicatorDimensionValue).pk,
            object_id=instance['id'],
            object_repr=str(instance),
            action_flag=action_flag,
            change_message=message
        )
