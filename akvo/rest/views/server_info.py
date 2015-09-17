# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET',])
def server_info(request):
    """ Info about the server. Currently setting for update edit timeout.
        Extend the server_setting tuple to expose other settings.
        Used by Up.
    """
    # tuple with settings we want exposed in the endpoint
    server_settings = (
        "PROJECT_UPDATE_TIMEOUT",
    )
    settings_dict = {}
    for setting in server_settings:
        settings_dict[setting] = getattr(settings, setting, "")
    return Response(settings_dict)