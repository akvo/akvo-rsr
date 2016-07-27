# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import IatiActivityExport, IatiExport

from rest_framework import serializers


class IatiExportSerializer(BaseRSRSerializer):

    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    status_label = serializers.ReadOnlyField(source='show_status')
    processed_projects = serializers.ReadOnlyField(source='processed_projects')

    class Meta:
        model = IatiExport


class IatiActivityExportSerializer(BaseRSRSerializer):

    class Meta:
        model = IatiActivityExport
