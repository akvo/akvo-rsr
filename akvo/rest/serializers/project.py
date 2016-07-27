# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers

from akvo.rsr.models import Project

from ..fields import Base64ImageField

from .budget_item import BudgetItemRawSerializer, BudgetItemRawDeepSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .partnership import PartnershipRawSerializer, PartnershipRawDeepSerializer
from .planned_disbursement import (PlannedDisbursementRawSerializer,
                                   PlannedDisbursementRawDeepSerializer)
from .policy_marker import PolicyMarkerRawSerializer
from .project_comment import ProjectCommentSerializer
from .project_document import ProjectDocumentRawSerializer
from .project_location import ProjectLocationExtraSerializer, ProjectLocationSerializer
from .project_condition import ProjectConditionRawSerializer
from .project_contact import ProjectContactRawSerializer, ProjectContactRawDeepSerializer
from .project_update import ProjectUpdateSerializer, ProjectUpdateDeepSerializer
from .recipient_country import RecipientCountryRawSerializer
from .region import RecipientRegionRawSerializer
from .related_project import RelatedProjectRawSerializer
from .result import ResultRawSerializer
from .sector import SectorRawSerializer
from .transaction import TransactionRawSerializer, TransactionRawDeepSerializer
from .rsr_serializer import BaseRSRSerializer


class ProjectSerializer(BaseRSRSerializer):

    publishing_status = serializers.Field(source='publishingstatus.status')
    current_image = Base64ImageField(required=False, allow_empty_file=True)
    sync_owner = serializers.Field(source='reporting_org.id')
    sync_owner_secondary_reporter = serializers.Field(source='reporting_partner.is_secondary_reporter')
    status_label = serializers.Field(source='show_plain_status')
    keyword_labels = serializers.Field(source='keyword_labels')

    class Meta:
        model = Project


class ProjectIatiExportSerializer(BaseRSRSerializer):

    publishing_status = serializers.Field(source='publishingstatus.status')
    checks_errors = serializers.Field(source='iati_errors')
    checks_warnings = serializers.Field(source='iati_warnings')

    class Meta:
        model = Project
        fields = (
            'id',
            'title',
            'is_public',
            'publishing_status',
            'status',
            'checks_errors',
            'checks_warnings',
        )


class ProjectExtraSerializer(ProjectSerializer):

    budget_items = BudgetItemRawSerializer(many=True, required=False)
    legacy_data = LegacyDataSerializer(many=True, required=False)
    links = LinkSerializer(many=True, required=False)
    locations = ProjectLocationExtraSerializer(many=True, required=False)
    planned_disbursements = PlannedDisbursementRawSerializer(many=True, required=False)
    policy_markers = PolicyMarkerRawSerializer( many=True, required=False)
    documents = ProjectDocumentRawSerializer(many=True, required=False)
    comments = ProjectCommentSerializer(many=True, required=False)
    conditions = ProjectConditionRawSerializer(many=True, required=False)
    contacts = ProjectContactRawSerializer(many=True, required=False)
    project_updates = ProjectUpdateSerializer(many=True, required=False)
    recipient_countries = RecipientCountryRawSerializer(many=True, required=False)
    recipient_regions = RecipientRegionRawSerializer(many=True, required=False)
    related_projects = RelatedProjectRawSerializer(many=True, required=False)
    results = ResultRawSerializer(many=True, required=False)
    sectors = SectorRawSerializer(many=True, required=False)
    transactions = TransactionRawSerializer(many=True, required=False)
    partnerships = PartnershipRawSerializer(many=True)

    class Meta(ProjectSerializer.Meta):
        pass


class ProjectExtraDeepSerializer(ProjectSerializer):

    budget_items = BudgetItemRawDeepSerializer(many=True, required=False)
    legacy_data = LegacyDataSerializer(many=True, required=False)
    links = LinkSerializer(many=True, required=False)
    locations = ProjectLocationExtraSerializer(many=True, required=False)
    planned_disbursements = PlannedDisbursementRawDeepSerializer(many=True, required=False)
    policy_markers = PolicyMarkerRawSerializer(many=True, required=False)
    documents = ProjectDocumentRawSerializer(many=True, required=False)
    comments = ProjectCommentSerializer(many=True, required=False)
    conditions = ProjectConditionRawSerializer(many=True, required=False)
    contacts = ProjectContactRawDeepSerializer( many=True, required=False)
    project_updates = ProjectUpdateDeepSerializer(many=True, required=False)
    recipient_countries = RecipientCountryRawSerializer(many=True, required=False)
    recipient_regions = RecipientRegionRawSerializer(many=True, required=False)
    related_projects = RelatedProjectRawSerializer(many=True, required=False)
    results = ResultRawSerializer(many=True, required=False)
    sectors = SectorRawSerializer( many=True, required=False)
    transactions = TransactionRawDeepSerializer(many=True, required=False)
    partnerships = PartnershipRawDeepSerializer(many=True)

    class Meta(ProjectSerializer.Meta):
        pass


class ProjectUpSerializer(ProjectSerializer):
    """ Custom endpoint for RSR Up
    """
    primary_location = ProjectLocationSerializer(many=False, required=False)

    class Meta(ProjectSerializer.Meta):
        pass
