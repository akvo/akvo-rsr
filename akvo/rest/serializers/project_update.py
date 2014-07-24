# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectUpdate

from ..fields import Base64ImageField

from .rsr_serializer import BaseRSRSerializer
from .project_update_location import ProjectUpdateLocationSerializer


class ProjectUpdateSerializer(BaseRSRSerializer):

    locations = ProjectUpdateLocationSerializer(source='locations', many=True)
    photo = Base64ImageField(required=False, allow_empty_file=True)

    class Meta:
        model = ProjectUpdate
        fields = (
        )
