# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Fss, FssForecast

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class FssForecastSerializer(BaseRSRSerializer):

    currency_label = serializers.ReadOnlyField(source='iati_currency_unicode')

    class Meta:
        model = FssForecast
        fields = '__all__'


class FssSerializer(BaseRSRSerializer):

    id = serializers.ReadOnlyField(source='project_id')
    forecasts = FssForecastSerializer(many=True, read_only=True)

    class Meta:
        model = Fss
        fields = '__all__'
