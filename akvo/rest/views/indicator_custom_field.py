# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorCustomField, IndicatorCustomValue
from ..serializers import IndicatorCustomFieldSerializer, IndicatorCustomValueSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorCustomFieldViewSet(PublicProjectViewSet):
    project_relation = 'project__'
    queryset = IndicatorCustomField.objects.all()
    serializer_class = IndicatorCustomFieldSerializer


class IndicatorCustomValueViewSet(PublicProjectViewSet):
    project_relation = 'custom_field__project__'
    queryset = IndicatorCustomValue.objects.all()
    serializer_class = IndicatorCustomValueSerializer
