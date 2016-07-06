# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.utils import right_now_in_akvo

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET', ])
def right_now_in_akvo_view(request):
    """
    Returns the following statistics:

    - Number of organisations in RSR;
    - Number of published projects in RSR;
    - Number of people served in RSR (legacy, should be removed);
    - Total project budget (in millions);
    - Number of project updates in RSR.
    """
    return Response(right_now_in_akvo())
