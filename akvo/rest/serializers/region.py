# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import RecipientRegion

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class RecipientRegionRawSerializer(BaseRSRSerializer):

    class Meta:
        model = RecipientRegion


class RecipientRegionSerializer(RecipientRegionRawSerializer):

    region_label = serializers.ReadOnlyField(source='iati_region_unicode')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary_unicode')
