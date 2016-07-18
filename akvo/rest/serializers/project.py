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

    budget_items = BudgetItemRawSerializer(source='budget_items', many=True, required=False,
                                           allow_add_remove=True)
    legacy_data = LegacyDataSerializer(source='legacy_data', many=True, required=False,
                                       allow_add_remove=True)
    links = LinkSerializer(source='links', many=True, required=False, allow_add_remove=True)
    locations = ProjectLocationExtraSerializer(source='locations', many=True, required=False,
                                               allow_add_remove=True)
    planned_disbursements = PlannedDisbursementRawSerializer(
        source='planned_disbursements', many=True, required=False, allow_add_remove=True
    )
    policy_markers = PolicyMarkerRawSerializer(source='policy_markers', many=True, required=False,
                                               allow_add_remove=True)
    documents = ProjectDocumentRawSerializer(source='documents', many=True, required=False,
                                             allow_add_remove=True)
    comments = ProjectCommentSerializer(source='comments', many=True, required=False,
                                        allow_add_remove=True)
    conditions = ProjectConditionRawSerializer(source='conditions', many=True, required=False,
                                               allow_add_remove=True)
    contacts = ProjectContactRawSerializer(source='contacts', many=True, required=False,
                                           allow_add_remove=True)
    project_updates = ProjectUpdateSerializer(source='project_updates', many=True, required=False,
                                              allow_add_remove=True)
    recipient_countries = RecipientCountryRawSerializer(source='recipient_countries', many=True,
                                                        required=False, allow_add_remove=True)
    recipient_regions = RecipientRegionRawSerializer(source='recipient_regions', many=True,
                                                     required=False, allow_add_remove=True)
    related_projects = RelatedProjectRawSerializer(source='related_projects', many=True,
                                                   required=False, allow_add_remove=True)
    results = ResultRawSerializer(source='results', many=True, required=False,
                                  allow_add_remove=True)
    sectors = SectorRawSerializer(source='sectors', many=True, required=False,
                                  allow_add_remove=True)
    transactions = TransactionRawSerializer(source='transactions', many=True, required=False,
                                            allow_add_remove=True)
    partnerships = PartnershipRawSerializer(source='partnerships', many=True)

    class Meta(ProjectSerializer.Meta):
        pass


class ProjectExtraDeepSerializer(ProjectSerializer):

    budget_items = BudgetItemRawDeepSerializer(source='budget_items', many=True, required=False,
                                           allow_add_remove=True)
    legacy_data = LegacyDataSerializer(source='legacy_data', many=True, required=False,
                                       allow_add_remove=True)
    links = LinkSerializer(source='links', many=True, required=False, allow_add_remove=True)
    locations = ProjectLocationExtraSerializer(source='locations', many=True, required=False,
                                               allow_add_remove=True)
    planned_disbursements = PlannedDisbursementRawDeepSerializer(
        source='planned_disbursements', many=True, required=False, allow_add_remove=True
    )
    policy_markers = PolicyMarkerRawSerializer(source='policy_markers', many=True, required=False,
                                               allow_add_remove=True)
    documents = ProjectDocumentRawSerializer(source='documents', many=True, required=False,
                                             allow_add_remove=True)
    comments = ProjectCommentSerializer(source='comments', many=True, required=False,
                                        allow_add_remove=True)
    conditions = ProjectConditionRawSerializer(source='conditions', many=True, required=False,
                                               allow_add_remove=True)
    contacts = ProjectContactRawDeepSerializer(source='contacts', many=True, required=False,
                                               allow_add_remove=True)
    project_updates = ProjectUpdateDeepSerializer(source='project_updates', many=True,
                                                   required=False, allow_add_remove=True)
    recipient_countries = RecipientCountryRawSerializer(source='recipient_countries', many=True,
                                                        required=False, allow_add_remove=True)
    recipient_regions = RecipientRegionRawSerializer(source='recipient_regions', many=True,
                                                     required=False, allow_add_remove=True)
    related_projects = RelatedProjectRawSerializer(source='related_projects', many=True,
                                                   required=False, allow_add_remove=True)
    results = ResultRawSerializer(source='results', many=True, required=False,
                                  allow_add_remove=True)
    sectors = SectorRawSerializer(source='sectors', many=True, required=False,
                                  allow_add_remove=True)
    transactions = TransactionRawDeepSerializer(source='transactions', many=True, required=False,
                                                allow_add_remove=True)
    partnerships = PartnershipRawDeepSerializer(source='partnerships', many=True)

    class Meta(ProjectSerializer.Meta):
        pass


class ProjectUpSerializer(ProjectSerializer):
    """ Custom endpoint for RSR Up
    """
    primary_location = ProjectLocationSerializer(source='primary_location', many=False, required=False)

    class Meta(ProjectSerializer.Meta):
        pass
