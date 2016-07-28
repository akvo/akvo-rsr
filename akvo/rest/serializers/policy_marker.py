# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import PolicyMarker

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class PolicyMarkerRawSerializer(BaseRSRSerializer):

    class Meta:
        model = PolicyMarker


class PolicyMarkerSerializer(PolicyMarkerRawSerializer):

    policy_marker_label = serializers.ReadOnlyField(source='iati_policy_marker_unicode')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary_unicode')
    significance_label = serializers.ReadOnlyField(source='iati_significance_unicode')
