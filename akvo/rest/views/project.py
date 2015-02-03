# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Project

from ..serializers import ProjectSerializer, ProjectExtraSerializer
from ..viewsets import BaseRSRViewSet


class ProjectViewSet(BaseRSRViewSet):
    """
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_fields = {
        'title': ['exact', 'icontains'],
        'subtitle': ['exact', 'icontains'],
        'status': ['exact', ],
        'language': ['exact', ],
        'currency': ['exact', ],
        'date_start_planned': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'date_start_actual': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'date_end_planned': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'date_end_actual': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'created_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'last_modified_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'sync_owner': ['exact', ],
        'iati_activity_id': ['exact', 'icontains', ],
        'hierarchy': ['exact', ],
        'project_scope': ['exact', ],
        'collaboration_type': ['exact', ],
        'default_aid_type': ['exact', ],
        'default_finance_type': ['exact', ],
        'default_flow_type': ['exact', ],
        'default_tied_status': ['exact', ],
        'budget': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'funds': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'funds_needed': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'categories': ['exact', 'in', ],
        'partners': ['exact', 'in', ],
        'keywords': ['exact', 'in', ],
    }


class ProjectExtraViewSet(ProjectViewSet):
    """
    """
    serializer_class = ProjectExtraSerializer
