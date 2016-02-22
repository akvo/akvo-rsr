# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.indicator import IndicatorFrameworkSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Result

from rest_framework import serializers


class ResultSerializer(BaseRSRSerializer):

    project_title = serializers.Field(source='project.title')

    class Meta:
        model = Result


class ResultsFrameworkSerializer(BaseRSRSerializer):

    indicators = IndicatorFrameworkSerializer(many=True, required=False, allow_add_remove=True)
    project_title = serializers.Field(source='project.title')

    class Meta:
        model = Result
