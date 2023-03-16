# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django_q.tasks import async_task
from akvo.rest.serializers import IatiActivityExportSerializer, IatiExportSerializer
from akvo.rest.viewsets import BaseRSRViewSet
from akvo.rsr.models import IatiActivityExport, IatiExport


def create_iati_file(obj_id):
    try:
        obj = IatiExport.objects.get(id=obj_id)
        obj.create_iati_file()
    except IatiExport.DoesNotExist:
        pass


class IatiExportViewSet(BaseRSRViewSet):
    """
    """
    queryset = IatiExport.objects.all().select_related('user')\
                                       .prefetch_related('projects')
    serializer_class = IatiExportSerializer

    def perform_create(self, serializer):
        serializer.save()
        instance = serializer.instance
        async_task(create_iati_file, instance.id)


class IatiActivityExportViewSet(BaseRSRViewSet):
    """
    """
    queryset = IatiActivityExport.objects.all()
    serializer_class = IatiActivityExportSerializer
