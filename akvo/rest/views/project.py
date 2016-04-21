# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project

from ..serializers import (ProjectSerializer, ProjectExtraSerializer, ProjectIatiExportSerializer,
                           ProjectUpSerializer)
from ..viewsets import PublicProjectViewSet


class ProjectViewSet(PublicProjectViewSet):

    """
    Viewset providing Project data.
    """
    queryset = Project.objects.select_related(
        'categories',
        'keywords',
        'partners',
    ).prefetch_related(
        'publishingstatus',
    )
    serializer_class = ProjectSerializer
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


class ProjectIatiExportViewSet(PublicProjectViewSet):
    """Lean viewset for project data, as used in the My IATI section of RSR."""
    queryset = Project.objects.only(
        'id',
        'title',
        'is_public',
        'status',
    ).select_related(
        'partners',
    ).prefetch_related(
        'iati_checks',
        'publishingstatus',
        'partnerships',
    )
    serializer_class = ProjectIatiExportSerializer
    project_relation = ''
    paginate_by_param = 'limit'
    max_paginate_by = 50

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
        return super(ProjectIatiExportViewSet, self).get_queryset()


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
