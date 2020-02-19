# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import ProjectRole


class ProjectRoleSerializer(BaseRSRSerializer):

    role = serializers.ReadOnlyField(source="group.name")
    email = serializers.ReadOnlyField(source="user.email")
    name = serializers.ReadOnlyField(source="user.get_full_name")

    class Meta:
        model = ProjectRole
        fields = ("id", "project", "email", "role", "name")
