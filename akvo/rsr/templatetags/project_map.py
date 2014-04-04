# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
from django import template
from django.conf import settings

from akvo.rsr.models import ProjectLocation

register = template.Library()

PROJECT_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')


# TODO: this should be fixed so partner sites use their own domain
HOST = 'http://%s' % getattr(settings, 'RSR_DOMAIN', 'akvo.org')

@register.inclusion_tag('inclusion_tags/project_map.html')
def project_map(project, width, height):
    """
    Project google map
    
    params:
        project: a Project object
        width, height: the dimensions of the map
    """

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []
    for location in ProjectLocation.objects.filter(location_target=project.pk):
        locations.append([location.latitude, location.longitude])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': PROJECT_MARKER_ICON,
        'locations': locations
    }

    return template_context
