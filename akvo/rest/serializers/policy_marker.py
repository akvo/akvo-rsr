# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import PolicyMarker

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class PolicyMarkerSerializer(BaseRSRSerializer):

    policy_marker_label = serializers.Field(source='iati_policy_marker')
    vocabulary_label = serializers.Field(source='iati_vocabulary')
    significance_label = serializers.Field(source='iati_significance')

    class Meta:
        model = PolicyMarker
