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

from akvo.rsr.models import Project, Organisation, ProjectLocation, OrganisationLocation

register = template.Library()

PROJECT_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
ORGANISATION_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')


# TODO: this should be fixed so partner sites use their own domain
HOST = 'http://%s' % getattr(settings, 'RSR_DOMAIN', 'akvo.org')

@register.inclusion_tag('inclusion_tags/project_map.html')
def project_map(resource, width, height):
    """
    Google map
    
    params:
        resource: a Project object, Organisation object or integer.
                    The integer is 1 for the global projects overview and 0 for the global organisations overview.
        width, height: the dimensions of the map
    """

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')
    marker_icon = PROJECT_MARKER_ICON
    locations = []

    if isinstance(resource, (int,long)):
        if resource > 0:
            for location in ProjectLocation.objects.all():
                locations.append([location.latitude, location.longitude])
        else:
            for location in OrganisationLocation.objects.all():
                locations.append([location.latitude, location.longitude])
            marker_icon = ORGANISATION_MARKER_ICON
            
    else:
        is_project = isinstance(resource, Project)
        is_organisation = isinstance(resource, Organisation)
        if is_project:
            for location in ProjectLocation.objects.filter(location_target=resource.pk):
                locations.append([location.latitude, location.longitude])
        elif is_organisation:
            for location in OrganisationLocation.objects.filter(location_target_id=resource.pk):
                locations.append([location.latitude, location.longitude])
            marker_icon = ORGANISATION_MARKER_ICON

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': marker_icon,
        'locations': locations
    }

    return template_context
