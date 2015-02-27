# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectUpdateLocation

from .rsr_serializer import BaseRSRSerializer


class ProjectUpdateLocationSerializer(BaseRSRSerializer):

    class Meta:
        model = ProjectUpdateLocation


class ProjectUpdateLocationExtraSerializer(ProjectUpdateLocationSerializer):

    class Meta(ProjectUpdateLocationSerializer.Meta):
        depth = 2
