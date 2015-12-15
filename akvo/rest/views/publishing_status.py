# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import PublishingStatus

from ..serializers import PublishingStatusSerializer
from ..viewsets import PublicProjectViewSet


class PublishingStatusViewSet(PublicProjectViewSet):
    """
    """
    queryset = PublishingStatus.objects.all()
    serializer_class = PublishingStatusSerializer
    filter_fields = ('project', 'status', )

    def get_queryset(self, related_to='project__'):
        return super(PublishingStatusViewSet, self).get_queryset(related_to)
