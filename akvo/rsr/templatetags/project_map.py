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
def project_map(type, resource, id, width, height, project_list = []):
    """
    Google map
    
    params:
        type: integer, 0 for global maps and 1 for specific project or organisation
        resource: integer, 0 for projects and 1 for organisations
        id: integer, id of project or organisation. 0 is used for global maps of all organisations or projects.
        width, height: the dimensions of the map
    """

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    if resource == 0: marker_icon = PROJECT_MARKER_ICON
    else: marker_icon = ORGANISATION_MARKER_ICON

    locations = []

    # Global maps
    if type == 0:
        if id == 0:
            if resource == 0:
                for location in ProjectLocation.objects.all():
                    locations.append([location.latitude, location.longitude])
            else:
                for location in OrganisationLocation.objects.all():
                    locations.append([location.latitude, location.longitude])
        else:
            # Show all projects of an organisation
            if resource == 0:
                for project in project_list:
                    for location in ProjectLocation.objects.filter(location_target=project.pk):
                        locations.append([location.latitude, location.longitude])

    # Specific project maps
    elif type == 1:
        if resource == 0:
            for location in ProjectLocation.objects.filter(location_target=id):
                locations.append([location.latitude, location.longitude])
        elif resource == 1:
            for location in OrganisationLocation.objects.filter(location_target_id=id):
                locations.append([location.latitude, location.longitude])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': marker_icon,
        'locations': locations
    }

    return template_context
