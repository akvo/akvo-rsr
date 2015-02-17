# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Project, PublishingStatus

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
    """ Viewset providing extra data and limited filtering for Up in one go
    """
    serializer_class = ProjectExtraSerializer
    paginate_by_param = 'limit'
    max_paginate_by = 1000

    def get_queryset(self):
        """ Allow simple filtering on selected fields
            Note that the query string keys "mimic" the django ORM filtering syntax,
            but in reality are totally arbitrary. Some day we might get full filtering
            using the Django ORM and then it'd nice if those custom filters continue to work.
        """
        queryset = self.queryset
        organisation = self.request.QUERY_PARAMS.get('partnerships__organisation', None)
        if organisation is not None:
            queryset = queryset.filter(partnerships__organisation=organisation).distinct()
        published = self.request.QUERY_PARAMS.get('publishingstatus__status', None)
        if published in [PublishingStatus.STATUS_PUBLISHED, PublishingStatus.STATUS_UNPUBLISHED]:
            queryset = queryset.filter(publishingstatus__status=published)
        return queryset
