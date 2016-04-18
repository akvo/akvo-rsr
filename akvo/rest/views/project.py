# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.serializers.project import ProjectUpSerializer
from akvo.rsr.models import Project
from ..serializers import ProjectSerializer, ProjectExtraSerializer, ProjectLeanSerializer
from ..viewsets import PublicProjectViewSet


class ProjectViewSet(PublicProjectViewSet):

    """
    Viewset providing Project data.

    Allowed parameters are:
    __limit__ (default 30, max 100),
    __title__ (exact or icontains),
    __subtitle__ (exact or icontains),
    __status__,
    __language__,
    __currency__,
    __date_start_planned__ (exact, gt, gte, lt or lte),
    __date_start_actual__ (exact, gt, gte, lt or lte),
    __date_end_planned__ (exact, gt, gte, lt or lte),
    __date_end_actual__ (exact, gt, gte, lt or lte),
    __created_at__ (exact, gt, gte, lt or lte),
    __last_modified_at__ (exact, gt, gte, lt or lte),
    __sync_owner__,
    __iati_activity_id__ (exact or icontains),
    __hierarchy__,
    __project_scope__,
    __collaboration_type__,
    __default_aid_type__,
    __default_finance_type__,
    __default_flow_type__,
    __default_tied_status__,
    __budget__ (exact, gt, gte, lt or lte),
    __funds__ (exact, gt, gte, lt or lte),
    __funds_needed__ (exact, gt, gte, lt or lte),
    __categories__ (exact, in),
    __partners__ (exact, in),
    __keywords__ (exact, in), and
    __publishingstatus\__status__.
    """
    queryset = Project.objects.select_related(
        'categories',
        'keywords',
        'partners',
    ).prefetch_related(
        'publishingstatus',
    )

    serializer_class = ProjectSerializer
    filter_fields = {
        'id': ['exact', 'gt', 'gte', 'lt', 'lte', ],
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
        'publishingstatus__status': ['exact', ],
    }

    project_relation = ''

    def get_queryset(self):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """
        sync_owner = self.request.QUERY_PARAMS.get('sync_owner', None)
        reporting_org = self.request.QUERY_PARAMS.get('reporting_org', None)

        reporting_org = reporting_org or sync_owner
        if reporting_org:
            self.queryset = self.queryset.filter(
                partnerships__iati_organisation_role=101,
                partnerships__organisation__pk=reporting_org
            ).distinct()
        return super(ProjectViewSet, self).get_queryset()


class ProjectLeanViewSet(PublicProjectViewSet):
    """Lean viewset for project data, as used in the My IATI section of RSR."""
    queryset = Project.objects.only(
        'id',
        'title',
        'is_public',
        'status',
    ).select_related(
        'partners',
    ).prefetch_related(
        'publishingstatus',
        'partnerships',
    )
    serializer_class = ProjectLeanSerializer
    project_relation = ''
    paginate_by_param = 'limit'
    max_paginate_by = 500

    def get_queryset(self):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """
        reporting_org = self.request.QUERY_PARAMS.get('reporting_org', None)
        if reporting_org:
            self.queryset = self.queryset.filter(
                partnerships__iati_organisation_role=101,
                partnerships__organisation__pk=reporting_org
            ).distinct()
        return super(ProjectLeanViewSet, self).get_queryset()


class ProjectExtraViewSet(ProjectViewSet):

    """
    Viewset providing extra Project data.

    Allowed parameters are:
    __limit__ (default 30, max 100),
    __partnerships\__organisation__ (filter on organisation ID), and
    __publishingstatus\__status__ (filter on publishing status)
    """

    queryset = Project.objects.prefetch_related(
        'publishingstatus',
        'sectors',
        'partnerships',
    )
    serializer_class = ProjectExtraSerializer
    paginate_by_param = 'limit'
    filter_fields = ('partnerships__organisation', 'publishingstatus__status')


class ProjectUpViewSet(ProjectViewSet):

    """
    Viewset providing extra data and limited filtering for Up in one go.

    Allowed parameters are:
    __limit__ (default 30, max 100),
    __partnerships\__organisation__ (filter on organisation ID), and
    __publishingstatus\__status__ (filter on publishing status)
    """

    queryset = Project.objects.select_related(
        'primary_location',
        'categories',
        'keywords',
        'partners',
    ).prefetch_related(
        'publishingstatus',
        'project_updates',
    )
    serializer_class = ProjectUpSerializer
    paginate_by_param = 'limit'
    max_paginate_by = 100
    filter_fields = ('partnerships__organisation', 'publishingstatus__status')
