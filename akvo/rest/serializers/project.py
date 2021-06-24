# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import timedelta
from itertools import chain
import logging

from django.utils.timezone import now
from rest_framework import serializers

from akvo.rsr.models import Project, RelatedProject, ProjectUpdate, IndicatorPeriodData
from akvo.utils import get_thumbnail

from ..fields import Base64ImageField

from .budget_item import BudgetItemRawSerializer, BudgetItemRawDeepSerializer
from .custom_field import ProjectDirectoryProjectCustomFieldSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .partnership import PartnershipRawSerializer, PartnershipRawDeepSerializer
from .planned_disbursement import (PlannedDisbursementRawSerializer,
                                   PlannedDisbursementRawDeepSerializer)
from .policy_marker import PolicyMarkerRawSerializer
from .project_document import ProjectDocumentRawSerializer
from .project_location import (ProjectLocationExtraSerializer, ProjectLocationSerializer)
from .project_condition import ProjectConditionRawSerializer
from .project_contact import ProjectContactRawSerializer, ProjectContactRawDeepSerializer
from .project_role import ProjectRoleSerializer
from .project_update import ProjectUpdateSerializer, ProjectUpdateDeepSerializer
from .recipient_country import RecipientCountryRawSerializer
from .region import RecipientRegionRawSerializer
from .related_project import RelatedProjectRawSerializer
from .result import ResultRawSerializer
from .sector import SectorRawSerializer, SectorSerializer
from .transaction import TransactionRawSerializer, TransactionRawDeepSerializer
from .rsr_serializer import BaseRSRSerializer


logger = logging.getLogger(__name__)


class TargetsAtField(serializers.ChoiceField):

    def get_attribute(self, instance):
        return instance

    def to_representation(self, obj):
        program = obj.get_program()
        value = program.targets_at if program else obj.targets_at
        return super().to_representation(value)


class ProjectSerializer(BaseRSRSerializer):

    publishing_status = serializers.ReadOnlyField(source='publishingstatus.status')
    publishing_status_id = serializers.ReadOnlyField(source='publishingstatus.pk')
    current_image = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)
    sync_owner = serializers.ReadOnlyField(source='reporting_org.id')
    sync_owner_secondary_reporter = serializers.ReadOnlyField(source='reporting_partner.is_secondary_reporter')
    status_label = serializers.ReadOnlyField(source='show_plain_status')
    keyword_labels = serializers.ReadOnlyField()
    last_modified_by = serializers.ReadOnlyField(source='last_modified_by.user.get_full_name')
    allow_indicator_labels = serializers.ReadOnlyField(source='has_indicator_labels')
    last_modified_at = serializers.ReadOnlyField(source='last_modified_by.last_modified_at')
    has_imported_results = serializers.ReadOnlyField()
    editable = serializers.SerializerMethodField()
    can_publish = serializers.SerializerMethodField()
    can_edit_settings = serializers.SerializerMethodField()
    can_edit_access = serializers.SerializerMethodField()
    program = serializers.SerializerMethodField()
    targets_at = TargetsAtField(choices=Project.TARGETS_AT_OPTION, required=False)

    class Meta:
        model = Project
        fields = '__all__'

    def get_editable(self, obj):
        """Method used by the editable SerializerMethodField"""
        user = self.context['request'].user
        if not user.is_authenticated():
            return False
        return user.can_edit_project(obj)

    def create(self, validated_data):
        project = super(ProjectSerializer, self).create(validated_data)
        user = self.context['request'].user
        Project.new_project_created(project.id, user)
        project.refresh_from_db()
        return project

    def get_can_publish(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated():
            return False
        return user.can_publish_project(obj)

    def get_can_edit_settings(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated():
            return False
        return user.can_edit_settings(obj)

    def get_can_edit_access(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated():
            return False
        return user.can_edit_access(obj)

    def get_program(self, obj):
        program = obj.get_program()
        if not program:
            return None
        return {'id': program.id, 'title': program.title}


class ProjectDirectorySerializer(serializers.ModelSerializer):

    id = serializers.ReadOnlyField()
    title = serializers.ReadOnlyField()
    subtitle = serializers.ReadOnlyField()
    summary = serializers.ReadOnlyField(source='project_plan_summary')
    latitude = serializers.ReadOnlyField(source='primary_location.latitude', default=None)
    longitude = serializers.ReadOnlyField(source='primary_location.longitude', default=None)
    image = serializers.SerializerMethodField()
    countries = serializers.SerializerMethodField()
    url = serializers.ReadOnlyField(source='cacheable_url')
    organisation = serializers.ReadOnlyField(source='primary_organisation.name')
    organisation_url = serializers.ReadOnlyField(source='primary_organisation.get_absolute_url')
    organisations = serializers.SerializerMethodField()
    sectors = serializers.SerializerMethodField()
    dropdown_custom_fields = serializers.SerializerMethodField()
    order_score = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id',
            'title',
            'subtitle',
            'summary',
            'latitude',
            'longitude',
            'image',
            'countries',
            'url',
            'organisation',
            'organisation_url',
            'organisations',
            'sectors',
            'dropdown_custom_fields',
            'order_score',
        )

    def get_countries(self, project):
        country_codes = {
            getattr(country, 'iso_code', getattr(country, 'country', ''))
            for country in project.countries()
        }
        return sorted({code.upper() for code in country_codes if code})

    def get_image(self, project):
        geometry = '350x200'
        try:
            image = get_thumbnail(project.current_image, geometry, crop='smart', quality=99)
            url = image.url
        except Exception as e:
            logger.error(
                'Failed to get thumbnail for image %s with error: %s', project.current_image, e
            )
            url = project.current_image.url if project.current_image.name else ''
        return url

    def get_organisations(self, project):
        return [org.id for org in project.partners.distinct()]

    def get_sectors(self, project):
        return [sector.sector_code for sector in project.sectors.distinct()]

    def get_dropdown_custom_fields(self, project):
        custom_fields = project.custom_fields.filter(type='dropdown')
        return ProjectDirectoryProjectCustomFieldSerializer(custom_fields, many=True).data

    def get_order_score(self, project):
        nine_months = now() - timedelta(days=9 * 30)
        project_update_count = ProjectUpdate.objects.filter(
            project=project, created_at__gt=nine_months).count()
        result_update_count = IndicatorPeriodData.objects.filter(
            period__indicator__result__project=project, created_at__gt=nine_months).count()
        return project_update_count + result_update_count


class ProjectIatiExportSerializer(BaseRSRSerializer):

    publishing_status = serializers.ReadOnlyField(source='publishingstatus.status')
    checks_errors = serializers.ReadOnlyField(source='iati_errors')
    checks_warnings = serializers.ReadOnlyField(source='iati_warnings')

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
    policy_markers = PolicyMarkerRawSerializer(many=True, required=False)
    documents = ProjectDocumentRawSerializer(many=True, required=False)
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
    conditions = ProjectConditionRawSerializer(many=True, required=False)
    contacts = ProjectContactRawDeepSerializer(many=True, required=False)
    project_updates = ProjectUpdateDeepSerializer(many=True, required=False)
    recipient_countries = RecipientCountryRawSerializer(many=True, required=False)
    recipient_regions = RecipientRegionRawSerializer(many=True, required=False)
    related_projects = RelatedProjectRawSerializer(many=True, required=False)
    results = ResultRawSerializer(many=True, required=False)
    sectors = SectorRawSerializer(many=True, required=False)
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


class ProjectMetadataSerializer(BaseRSRSerializer):

    locations = serializers.SerializerMethodField()
    recipient_countries = RecipientCountryRawSerializer(many=True, required=False)
    status = serializers.ReadOnlyField(source='publishingstatus.status')
    sectors = SectorSerializer(many=True, read_only=True)
    parent = serializers.SerializerMethodField()
    editable = serializers.SerializerMethodField()
    restricted = serializers.SerializerMethodField()
    roles = ProjectRoleSerializer(source='projectrole_set', many=True)
    is_program = serializers.ReadOnlyField(source='is_hierarchy_root')

    def get_locations(self, obj):
        countries = {location.country for location in obj.locations.all() if location.country}
        return [
            {'country': c.name, 'iso_code': c.iso_code}
            for c
            in countries
        ]

    def get_parent(self, obj):
        p = obj.parents_all().first()
        user = self.context['request'].user
        if not user.can_view_project(p):
            return None
        return (
            {'id': p.id, 'title': p.title, 'is_lead': p.is_hierarchy_root()}
            if p is not None
            else None
        )

    def get_editable(self, obj):
        """Method used by the editable SerializerMethodField"""
        user = self.context['request'].user
        if not user.is_authenticated():
            return False
        return user.can_edit_project(obj, use_cached_attr=True)

    def get_restricted(self, project):
        """True if the project is restricted for the user"""
        user = self.context['request'].user
        if not project.use_project_roles:
            return False
        return not user.can_view_project(project)

    class Meta:
        model = Project
        fields = ('id', 'title', 'subtitle', 'date_end_actual', 'date_end_planned',
                  'date_start_actual', 'date_start_planned', 'locations', 'status',
                  'is_public', 'sectors', 'parent', 'editable', 'recipient_countries',
                  'restricted', 'roles', 'use_project_roles', 'is_program')


BASE_HIERARCHY_SERIALIZER_FIELDS = (
    'id', 'title', 'subtitle', 'date_end_actual', 'date_end_planned',
    'date_start_actual', 'date_start_planned', 'locations', 'status',
    'is_public', 'sectors', 'parent', 'editable',
)


class ProjectHierarchyNodeSerializer(ProjectMetadataSerializer):
    is_program = serializers.SerializerMethodField()

    def get_is_program(self, obj):
        return obj.is_hierarchy_root()

    def get_parent(self, obj):

        parent_relations = [
            r for r in chain(obj.related_projects.all(), obj.related_to_projects.all())
            if
            (r.project_id == obj.pk and r.relation == RelatedProject.PROJECT_RELATION_PARENT)
            or (r.related_project_id == obj.pk and r.relation == RelatedProject.PROJECT_RELATION_CHILD)
        ]
        if parent_relations:
            r = parent_relations[0]
            p = (r.related_project if r.relation == RelatedProject.PROJECT_RELATION_PARENT
                 else r.project)
        else:
            p = None
        return {'id': p.id, 'title': p.title} if p is not None else None

    class Meta:
        model = Project
        fields = BASE_HIERARCHY_SERIALIZER_FIELDS + ('recipient_countries', 'is_program')


class ProjectHierarchyRootSerializer(ProjectHierarchyNodeSerializer):

    children_count = serializers.SerializerMethodField()

    def get_children_count(self, obj):
        return obj.children_all().count()

    class Meta:
        model = Project
        fields = BASE_HIERARCHY_SERIALIZER_FIELDS + ('children_count', )


class ProjectHierarchyTreeSerializer(ProjectHierarchyNodeSerializer):

    children = serializers.SerializerMethodField()
    is_master_program = serializers.SerializerMethodField()

    def get_is_master_program(self, obj):
        return obj.is_master_program()

    def get_children(self, obj):
        descendants = obj.descendants().prefetch_related(
            'locations', 'locations__country', 'sectors', 'publishingstatus',
            'related_projects', 'related_projects__related_project',
            'related_to_projects', 'related_to_projects__project',
            'recipient_countries',
        )
        serializer = ProjectHierarchyNodeSerializer(descendants, many=True, context=self.context)
        descendants = serializer.data
        return make_descendants_tree(descendants, obj)

    class Meta:
        model = Project
        fields = BASE_HIERARCHY_SERIALIZER_FIELDS + ('children', 'is_master_program')


def make_descendants_tree(descendants, root):
    tree = []
    lookup = {}

    for item in descendants:
        if not item['parent']:
            continue

        item_id = item['id']
        parent_id = item['parent']['id']

        if item_id not in lookup:
            lookup[item_id] = {'children': []}

        lookup[item_id].update(item)
        node = lookup[item_id]

        if parent_id == root.id:
            tree.append(node)
        else:
            if parent_id not in lookup:
                lookup[parent_id] = {'children': []}

            lookup[parent_id]['children'].append(node)

    return tree
