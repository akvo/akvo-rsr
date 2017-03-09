# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import socket

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET', ])
def server_info(request):
    """ Info about the server.
        Used by RSR Up.
    """
    # tuple with settings we want exposed in the endpoint
    server_settings = (
        "PROJECT_UPDATE_TIMEOUT",
        "DEPLOY_TAG",
        "DEPLOY_BRANCH",
        "DEPLOY_COMMIT_ID",
    )
    settings_dict = {'CANONICAL_HOST_NAME': socket.gethostname()}
    for setting in server_settings:
        settings_dict[setting] = getattr(settings, setting, "")
    return Response(settings_dict)
