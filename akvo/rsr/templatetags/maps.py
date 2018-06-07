# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import json
import logging
import os
from django import template
from django.conf import settings


from akvo.rsr.models import (Project, Organisation, ProjectUpdate,
                             ProjectLocation, ProjectUpdateLocation)
from akvo.utils import get_thumbnail

register = template.Library()
logger = logging.getLogger(__name__)

PROJECT_MARKER_ICON = getattr(settings,
                              'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
PROJECT_UPDATE_MARKER_ICON = getattr(settings,
                                     'GOOGLE_MAPS_PROJECT_UPDATE_MARKER_ICON',
                                     '')
ORGANISATION_MARKER_ICON = getattr(settings,
                                   'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')
MEDIA_URL = getattr(settings, 'MEDIA_URL', '/media/')


def avatar(item, geometry='60x60', quality=99):
    """Build user avatar.

    Digs out the url to the visual representation from object. If no one exists
    defaults to empty string.
    """
    url = ""
    try:
        if isinstance(item, Project):
            url = get_thumbnail(item.current_image, geometry,
                                crop='center', quality=quality).url
        elif isinstance(item, Organisation):
            url = get_thumbnail(item.logo, geometry,
                                crop='center', quality=quality).url
        elif isinstance(item, ProjectUpdate):
            url = get_thumbnail(item.photo, geometry,
                                crop='center', quality=quality).url
    except Exception:
        pass

    return url


def get_location(item):
    """..."""
    try:
        location = item.primary_location

        if location.latitude == 0 and location.longitude == 0:
            raise ValueError('latitude or longitude is 0')
        if location.latitude > 80 or location.latitude < -80:
            raise ValueError('lat over 80 or lat less than -80')

        if isinstance(item, Project):
            item_type = 'project'
            icon = PROJECT_MARKER_ICON
            text = item.title.encode('utf8')

        elif isinstance(item, Organisation):
            item_type = 'organisation'
            icon = ORGANISATION_MARKER_ICON
            text = item.name.encode('utf8')

        elif isinstance(item, ProjectUpdate):
            item_type = 'projectUpdate'
            icon = PROJECT_UPDATE_MARKER_ICON
            text = item.title.encode('utf8')

        return {'type': item_type,
                'image': avatar(item),
                'latitude': location.latitude,
                'longitude': location.longitude,
                'url': item.get_absolute_url(),
                'icon': icon,
                'pk': str(item.pk),
                'text': text}
    except Exception:
        return []


@register.inclusion_tag('inclusion_tags/maps.html')
def project_map(id, width, height, dynamic='dynamic'):
    """Project map.

    params:
        id: integer, id of project or organisation.
        width, height: the dimensions of the map.
        dynamic: 'dynamic' (default) or 'static', map is scrollable and
        clickable if 'dynamic'.
    """
    if dynamic != 'dynamic':
        dynamic = False

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []
    update_locations = []

    for location in ProjectLocation.objects.filter(location_target=id):
        if location.latitude == 0 and location.longitude == 0:
            continue
        if location.latitude > 80 or location.latitude < -80:
            continue

        locations.append([location.latitude, location.longitude])

    for update_location in ProjectUpdateLocation.objects.filter(location_target__project=id):
        if update_location.latitude == 0 and update_location.longitude == 0:
            continue
        if update_location.latitude > 80 or update_location.latitude < -80:
            continue

        project_update = update_location.location_target

        # Do not show placeholder locations
        if update_location.latitude == 0 and update_location.longitude == 0:
            continue

        # Small map, so don't show thumbnail of updates
        thumbnail = ""

        update_locations.append([
            update_location.latitude, update_location.longitude,
            [str(project_update.pk), project_update.title, thumbnail, 'project', str(id)]
        ])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': PROJECT_MARKER_ICON,
        'update_marker_icon': PROJECT_UPDATE_MARKER_ICON,
        'locations': json.dumps(locations),
        'update_locations': json.dumps(update_locations),
        'dynamic': dynamic,
        'infowindows': False,
        'partnersite_widget': False
    }

    return template_context


@register.inclusion_tag('inclusion_tags/maps.html')
def projects_map(projects, width, height, dynamic='dynamic'):
    """
    params:
        projects: Project queryset.
        width, height: the dimensions of the map.
        dynamic: 'dynamic' (default) or 'static', map is scrollable and clickable if 'dynamic'.
    """

    if dynamic != 'dynamic':
        dynamic = False

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []
    update_locations = []

    for project in projects:
        proj_locations = ProjectLocation.objects.filter(location_target=project)
        for location in proj_locations:
            if location.latitude == 0 and location.longitude == 0:
                continue
            if location.latitude > 80 or location.latitude < -80:
                continue
            try:
                thumbnail = project.current_image.extra_thumbnails['map_thumb'].absolute_url
            except:
                thumbnail = ""
            locations.append([location.latitude,
                              location.longitude,
                              [str(project.pk), project.title.encode('utf8'), thumbnail, 'project']])

        for update_location in ProjectUpdateLocation.objects.filter(location_target__project=project):
            if update_location.latitude == 0 and update_location.longitude == 0:
                continue
            if update_location.latitude > 80 or update_location.latitude < -80:
                continue

            project_update = update_location.location_target

            # Do not show placeholder locations
            if update_location.latitude == 0 and update_location.longitude == 0:
                continue

            try:
                thumbnail = project_update.photo.extra_thumbnails['map_thumb'].absolute_url
            except:
                thumbnail = ""

            update_locations.append([update_location.latitude,
                                     update_location.longitude,
                                     [str(project_update.pk), project_update.title.encode('utf8'), thumbnail, 'project', str(project.pk)]])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': PROJECT_MARKER_ICON,
        'update_marker_icon': PROJECT_UPDATE_MARKER_ICON,
        'locations': locations,
        'update_locations': update_locations,
        'dynamic': dynamic,
        'infowindows': True
    }

    return template_context
