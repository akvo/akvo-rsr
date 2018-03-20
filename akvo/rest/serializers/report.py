# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Report, ReportFormat

from rest_framework import serializers

from .rsr_serializer import BaseRSRSerializer


class ReportFormatSerializer(BaseRSRSerializer):

    class Meta:
        model = ReportFormat
        fields = (
            'name',
            'display_name',
            'icon',
        )


class ReportSerializer(BaseRSRSerializer):

    parameters = serializers.ReadOnlyField()
    formats = ReportFormatSerializer(many=True)

    class Meta:
        model = Report
        fields = (
            'id',
            'name',
            'title',
            'description',
            'url',
            'parameters',
            'formats',
        )
