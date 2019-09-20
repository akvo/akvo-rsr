# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import logging

from django.conf import settings
from rest_framework import serializers

from akvo.rsr.models import Organisation

from ..fields import Base64ImageField

from .organisation_budget import (OrganisationCountryBudgetSerializer,
                                  OrganisationTotalBudgetSerializer,
                                  OrganisationRecipientOrgBudgetSerializer,
                                  OrganisationRegionBudgetSerializer,
                                  OrganisationTotalExpenditureSerializer)
from .organisation_document import OrganisationDocumentSerializer
from .organisation_location import (OrganisationLocationSerializer,
                                    OrganisationLocationExtraSerializer)
from .rsr_serializer import BaseRSRSerializer
from akvo.utils import get_thumbnail

logger = logging.getLogger(__name__)


class OrganisationSerializer(BaseRSRSerializer):

    total_budgets = OrganisationTotalBudgetSerializer(read_only=True, many=True, required=False)
    recipient_org_budgets = OrganisationRecipientOrgBudgetSerializer(
        read_only=True, many=True, required=False
    )
    region_budgets = OrganisationRegionBudgetSerializer(
        source='recipient_region_budgets', read_only=True, many=True, required=False
    )
    country_budgets = OrganisationCountryBudgetSerializer(
        source='recipient_country_budgets', read_only=True, many=True, required=False
    )
    total_expenditures = OrganisationTotalExpenditureSerializer(
        read_only=True, many=True, required=False
    )
    documents = OrganisationDocumentSerializer(read_only=True, many=True, required=False)
    locations = OrganisationLocationSerializer(read_only=True, many=True, required=False)
    logo = Base64ImageField(read_only=True, required=False, allow_empty_file=True, allow_null=True)

    latitude = serializers.CharField(source='primary_location.latitude', required=False)
    longitude = serializers.CharField(source='primary_location.longitude', required=False)
    city = serializers.CharField(source='primary_location.city', required=False)

    class Meta:
        model = Organisation
        fields = '__all__'

    def create(self, validated_data):
        if 'primary_location' in validated_data and isinstance(validated_data['primary_location'], dict):
            location = validated_data.pop('primary_location', {})
        else:
            location = None

        instance = super(OrganisationSerializer, self).create(validated_data)

        if location is not None:
            location['location_target'] = instance.pk
            serializer = OrganisationLocationSerializer(data=location)
            try:
                serializer.is_valid(raise_exception=True)
            except Exception:
                # Delete organisation if location could not be created
                instance.delete()
                raise
            else:
                serializer.save()
                instance.refresh_from_db()

        return instance


class OrganisationExtraSerializer(OrganisationSerializer):

    primary_location = OrganisationLocationExtraSerializer()

    class Meta(OrganisationSerializer.Meta):
        fields = (
            'id',
            'logo',
            'long_name',
            'name',
            'primary_location',
        )


class OrganisationBasicSerializer(BaseRSRSerializer):

    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'long_name',
            'logo'
        )


class OrganisationDirectorySerializer(BaseRSRSerializer):

    image = serializers.SerializerMethodField()
    url = serializers.ReadOnlyField(source='get_absolute_url')
    organisation_type = serializers.ReadOnlyField(source='iati_org_type')
    project_count = serializers.ReadOnlyField(source='published_projects.count')

    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'long_name',
            'image',
            'url',
            'organisation_type',
            'project_count',
        )

    def get_image(self, organisation):
        width = '191'
        try:
            image = get_thumbnail(organisation.logo, width, crop='smart', quality=99)
            url = image.url
        except Exception as e:
            logger.error(
                'Failed to get thumbnail for image %s with error: %s', organisation.logo, e
            )
            default_logo = '{}{}'.format(settings.STATIC_URL, 'rsr/images/default-org-logo.jpg')
            url = organisation.logo.url if organisation.logo.name else default_logo
        return url
