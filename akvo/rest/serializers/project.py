# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers

from akvo.rsr.models import Project

from ..fields import Base64ImageField

from .budget_item import BudgetItemSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .partnership import PartnershipSerializer
from .planned_disbursement import PlannedDisbursementSerializer
from .policy_marker import PolicyMarkerSerializer
from .project_comment import ProjectCommentSerializer
from .project_location import ProjectLocationSerializer, ProjectLocationExtraSerializer
from .project_condition import ProjectConditionSerializer
from .project_contact import ProjectContactSerializer
from .project_update import ProjectUpdateSerializer
from .publishing_status import PublishingStatusSerializer
from .recipient_country import RecipientCountrySerializer
from .region import RecipientRegionSerializer
from .related_project import RelatedProjectSerializer
from .result import ResultSerializer
from .sector import SectorSerializer
from .transaction import TransactionSerializer
from .rsr_serializer import BaseRSRSerializer


class ProjectSerializer(BaseRSRSerializer):

    publishing_status = serializers.Field(source='publishingstatus.status')
    current_image = Base64ImageField(required=False, allow_empty_file=True)

    class Meta:
        model = Project


class ProjectExtraSerializer(ProjectSerializer):

    publishing_status = serializers.Field(source='publishingstatus.status')
    budget_items = BudgetItemSerializer(source='budget_items', many=True, required=False, allow_add_remove=True)
    legacy_data = LegacyDataSerializer(source='legacy_data', many=True, required=False, allow_add_remove=True)
    links = LinkSerializer(source='links', many=True, required=False, allow_add_remove=True)
    locations = ProjectLocationExtraSerializer(source='locations', many=True, required=False, allow_add_remove=True)
    planned_disbursements = PlannedDisbursementSerializer(
        source='planned_disbursements', many=True, required=False, allow_add_remove=True
    )
    policy_markers = PolicyMarkerSerializer(source='policy_markers', many=True, required=False, allow_add_remove=True)
    comments = ProjectCommentSerializer(
        source='comments', many=True, required=False, allow_add_remove=True
    )
    conditions = ProjectConditionSerializer(
        source='conditions', many=True, required=False, allow_add_remove=True
    )
    contacts = ProjectContactSerializer(
        source='contacts', many=True, required=False, allow_add_remove=True
    )
    project_updates = ProjectUpdateSerializer(
        source='project_updates', many=True, required=False, allow_add_remove=True
    )
    recipient_countries = RecipientCountrySerializer(
        source='recipient_countries', many=True, required=False, allow_add_remove=True
    )
    recipient_regions = RecipientRegionSerializer(
        source='recipient_regions', many=True, required=False, allow_add_remove=True
    )
    related_projects = RelatedProjectSerializer(
        source='related_projects', many=True, required=False, allow_add_remove=True
    )
    results = ResultSerializer(source='results', many=True, required=False, allow_add_remove=True)
    sectors = SectorSerializer(source='sectors', many=True, required=False, allow_add_remove=True)
    transactions = TransactionSerializer(source='transactions', many=True, required=False, allow_add_remove=True)
    partnerships = PartnershipSerializer(source='partnerships', many=True)

    class Meta(ProjectSerializer.Meta):
        pass
