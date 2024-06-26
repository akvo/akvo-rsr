# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import functools
from datetime import timedelta
import logging
from typing import List, Optional

from django.conf import settings
from django.utils.timezone import now
from rest_framework import serializers
from timeout_decorator import timeout

from akvo.rsr.models import Project, ProjectUpdate, IndicatorPeriodData
from akvo.utils import get_thumbnail, make_safe_timezone_aware_date
from akvo.rsr.models.project_thumbnail import get_cached_thumbnail
from akvo.rsr.usecases.iati_validation import schedule_iati_activity_validation
from . import OrganisationBasicSerializer

from ..fields import Base64ImageField

from .budget_item import BudgetItemRawSerializer
from .custom_field import ProjectDirectoryProjectCustomFieldSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .partnership import PartnershipRawSerializer
from .planned_disbursement import PlannedDisbursementRawSerializer
from .policy_marker import PolicyMarkerRawSerializer
from .project_document import ProjectDocumentRawSerializer
from .project_location import ProjectLocationExtraSerializer, ProjectLocationSerializer
from .project_condition import ProjectConditionRawSerializer
from .project_contact import ProjectContactRawSerializer
from .project_role import ProjectRoleSerializer
from .project_update import ProjectUpdateSerializer
from .recipient_country import RecipientCountryRawSerializer
from .region import RecipientRegionRawSerializer
from .related_project import RelatedProjectRawSerializer
from .result import ResultRawSerializer
from .sector import SectorRawSerializer, SectorSerializer
from .transaction import TransactionRawSerializer
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
    can_edit_enumerator_access = serializers.SerializerMethodField()
    program = serializers.SerializerMethodField()
    targets_at = TargetsAtField(choices=Project.TARGETS_AT_OPTION, required=False)
    iati_profile_url = serializers.SerializerMethodField()
    path = serializers.SerializerMethodField()
    uuid = serializers.ReadOnlyField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_editable(self, obj):
        """Method used by the editable SerializerMethodField"""
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        return user.can_edit_project(obj)

    def create(self, validated_data):
        project = super(ProjectSerializer, self).create(validated_data)
        user = self.context['request'].user
        Project.new_project_created(project.id, user)
        schedule_iati_activity_validation(project)
        project.refresh_from_db()
        return project

    def get_can_publish(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        return user.can_publish_project(obj)

    def get_can_edit_settings(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        return user.can_edit_settings(obj)

    def get_can_edit_access(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        return user.can_edit_access(obj)

    def get_can_edit_enumerator_access(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        return user.can_edit_enumerator_access(obj)

    def get_program(self, obj):
        program = obj.get_program()
        if not program:
            return None
        return {'id': program.id, 'title': program.title}

    def get_iati_profile_url(self, obj):
        return obj.get_iati_profile_url()

    def get_path(self, project: Project):
        return str(project.path)

    def get_created_at(self, project: Project):
        """
        This is a work around to silence the "Invalid datetime for the timezone
        Europe/Stockholm" which has appeared several times and not yet known
        why.

        TODO: This may no longer necessary as of Django 4.2
        """
        return make_safe_timezone_aware_date(project.created_at)

    def update(self, project: Project, validated_data: dict):
        if "contributes_to_project" in validated_data:
            parent = validated_data['contributes_to_project']
            if parent:
                project.set_parent(validated_data['contributes_to_project'])
            else:
                project.delete_parent()
            validated_data["external_parent_iati_activity_id"] = None
        elif "external_parent_iati_activity_id" in validated_data and validated_data['external_parent_iati_activity_id']:
            project.delete_parent()

        validated_data["contributes_to_project"] = None

        return super().update(project, validated_data)


class ProjectDirectorySerializer(serializers.ModelSerializer):

    id = serializers.ReadOnlyField()
    title = serializers.ReadOnlyField()
    subtitle = serializers.ReadOnlyField()
    summary = serializers.ReadOnlyField(source='project_plan_summary')
    latitude = serializers.ReadOnlyField(source='primary_location.latitude', default=None)
    longitude = serializers.ReadOnlyField(source='primary_location.longitude', default=None)
    image = serializers.SerializerMethodField()
    countries = serializers.SerializerMethodField()
    organisation = serializers.ReadOnlyField(source='primary_organisation.name')
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
            'organisation',
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

        @timeout(1)
        def get_thumbnail_with_timeout():
            return get_thumbnail(project.current_image, geometry, crop='smart', quality=99)

        try:
            image = get_thumbnail_with_timeout()
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


class ProjectDirectoryDynamicFieldsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    partners = serializers.SerializerMethodField()
    countries = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        if not fields:
            fields = {'id', 'title'}
        super().__init__(*args, **kwargs)
        # Make sure the id is always included even if the client doesn't specify it
        selected_field_names = set(fields | {'id'})
        existing_field_names = set(self.fields.keys())
        unselected_field_names = existing_field_names - selected_field_names
        for field_name in unselected_field_names:
            self.fields.pop(field_name)

    def get_image(self, project: Project):
        # This method assumes the project's thumbnails were prefetched
        try:
            thumb = get_cached_thumbnail(project, settings.THUMBNAIL_GEO_DIRECTORY, prefetched=True)
            if thumb:
                return thumb.url
        except Exception as e:
            logger.error("Cannot retrieve cached_thumbnail for %s: %s: %s", project.id, project, e)

    def get_partners(self, project):
        return [org.id for org in project.partners.distinct()]

    def get_countries(self, project):
        recipient_countries = {c.country.upper() for c in project.recipient_countries.all() if c.country}
        location_countries = {loc.country.iso_code.upper() for loc in project.locations.all() if loc.country and loc.country.iso_code}
        return sorted(recipient_countries | location_countries)

    class Meta:
        model = Project
        fields = '__all__'


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
            'iati_status',
            'date_start_actual',
            'date_end_actual',
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
    primary_organisation = OrganisationBasicSerializer()
    children_count = serializers.SerializerMethodField()

    def get_children_count(self, obj):
        if parents_to_children := self.context.get("parents_to_children"):
            return len(parents_to_children.get(obj.uuid, []))
        else:
            return obj.children().count()

    def get_locations(self, obj):
        countries = set()
        results = []
        for location in obj.locations.all():
            country = location.country
            if not country or country in countries:
                continue
            countries.add(country)
            results.append({
                "country": country.name,
                "iso_code": country.iso_code,
            })
        return results

    def get_parent(self, obj):
        if "parent" in self.context:
            p = self.context.get("parent")
        else:
            p = obj.parent()
            user = self.context['request'].user
            if not user.can_view_project(p):
                return None
        return self._parent_to_dict(p)

    @staticmethod
    @functools.lru_cache
    def _parent_to_dict(parent: Project) -> Optional[dict]:
        if parent is not None:
            return {
                'id': parent.id,
                'title': parent.title,
                'is_lead': parent.is_hierarchy_root()
            }

    def get_editable(self, obj):
        """Method used by the editable SerializerMethodField"""
        user = self.context['request'].user
        if not user.is_authenticated:
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
                  'restricted', 'roles', 'use_project_roles', 'is_program', 'primary_organisation',
                  'children_count')


def make_descendants_tree(descendants: List[dict], root: Project):
    tree = []
    lookup = {project["uuid"]: project for project in descendants}
    root_uuid = root.uuid

    for node in descendants:
        node.setdefault("children", [])  # Required by frontend
        parent_uuid = node["parent_uuid"]
        if not parent_uuid:
            continue

        if parent_uuid == root_uuid:
            tree.append(node)

        parent = lookup.get(parent_uuid)
        if parent:
            parent.setdefault("children", []).append(node)
            node["parent"] = {
                "id": parent["id"],
                "title": parent["title"],
            }

    return tree
