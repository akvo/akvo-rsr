# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import ProjectUpdate

from ..fields import Base64ImageField

from .rsr_serializer import BaseRSRSerializer
from .project_update_location import ProjectUpdateLocationSerializer, ProjectUpdateLocationExtraSerializer
from .user import UserSerializer


class ProjectUpdateSerializer(BaseRSRSerializer):

    locations = ProjectUpdateLocationSerializer(source='locations', many=True)
    photo = Base64ImageField(required=False, allow_empty_file=True)

    class Meta:
        model = ProjectUpdate


class ProjectUpdateExtraSerializer(BaseRSRSerializer):
    """ This serializer includes User data and data about the Organisation the user is connected to
    """
    photo = Base64ImageField(required=False, allow_empty_file=True)
    primary_location = ProjectUpdateLocationExtraSerializer()
    # Limit project data to its PK, this is needed because of Meta.depth = 2
    project = serializers.Field(source='project.pk')
    user = UserSerializer()

    class Meta:
        model = ProjectUpdate
        depth = 2
