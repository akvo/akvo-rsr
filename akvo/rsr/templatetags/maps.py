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

from akvo.rsr.models import Project, Organisation, ProjectLocation, OrganisationLocation, ProjectUpdateLocation

register = template.Library()

PROJECT_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
PROJECT_UPDATE_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_PROJECT_UPDATE_MARKER_ICON', '')
ORGANISATION_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')
MEDIA_URL = getattr(settings, 'MEDIA_URL', '/media/')


# TODO: this should be fixed so partner sites use their own domain
HOST = 'http://%s' % getattr(settings, 'RSR_DOMAIN', 'akvo.org')

@register.inclusion_tag('inclusion_tags/maps.html')
def project_map(id, width, height, dynamic='dynamic'):
    """
    params:
        id: integer, id of project or organisation.
        width, height: the dimensions of the map.
        dynamic: 'dynamic' (default) or 'static', map is scrollable and clickable if 'dynamic'.
    """

    if dynamic != 'dynamic':
        dynamic = False

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []
    update_locations = []

    for location in ProjectLocation.objects.filter(location_target=id):
        locations.append([location.latitude, location.longitude])

    for update_location in ProjectUpdateLocation.objects.filter(location_target__project=id):
        project_update = update_location.location_target

        # Small map, so don't show thumbnail of updates
        thumbnail = ""

        update_locations.append([update_location.latitude,
                                 update_location.longitude,
                                 [str(project_update.pk),project_update.title.encode('utf8'), thumbnail, 'project',
                                  str(id)]])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': PROJECT_MARKER_ICON,
        'update_marker_icon': PROJECT_UPDATE_MARKER_ICON,
        'locations': locations,
        'update_locations': update_locations,
        'dynamic': dynamic,
        'infowindows': False,
        'partnersite_widget': False
    }

    return template_context


@register.inclusion_tag('inclusion_tags/maps.html')
def organisation_map(id, width, height, dynamic='dynamic'):
    """
    params:
        id: integer, id of project or organisation.
        width, height: the dimensions of the map.
        dynamic: 'dynamic' (default) or 'static', map is scrollable and clickable if 'dynamic'.
    """

    if dynamic != 'dynamic':
        dynamic = False

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []

    for location in OrganisationLocation.objects.filter(location_target_id=id):
        locations.append([location.latitude, location.longitude])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': ORGANISATION_MARKER_ICON,
        'locations': locations,
        'dynamic': dynamic,
        'infowindows': False,
        'partnersite_widget': False
    }

    return template_context


@register.inclusion_tag('inclusion_tags/maps.html')
def global_project_map(width, height, dynamic='dynamic'):
    """
    params:
        width, height: the dimensions of the map.
        dynamic: 'dynamic' (default) or 'static', map is scrollable and clickable if 'dynamic'.
    """

    if dynamic != 'dynamic':
        dynamic = False

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []
    update_locations = []

    for project in Project.objects.all().active():
        try:
            location = project.primary_location
            try:
                thumbnail = project.current_image.extra_thumbnails['map_thumb'].absolute_url
            except:
                thumbnail = ""
            locations.append([location.latitude,
                              location.longitude,
                              [str(project.pk),project.title.encode('utf8'), thumbnail, 'project']])
        except:
            pass

        for update_location in ProjectUpdateLocation.objects.filter(location_target__project=project):
            project_update = update_location.location_target

            try:
                thumbnail = project_update.photo.extra_thumbnails['map_thumb'].absolute_url
            except:
                thumbnail = ""

            update_locations.append([update_location.latitude,
                                     update_location.longitude,
                                     [str(project_update.pk), project_update.title.encode('utf8'), thumbnail, 'project',
                                      str(project.pk)]])

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': PROJECT_MARKER_ICON,
        'update_marker_icon': PROJECT_UPDATE_MARKER_ICON,
        'locations': locations,
        'update_locations': update_locations,
        'dynamic': dynamic,
        'infowindows': True,
        'partnersite_widget': False
    }

    return template_context


@register.inclusion_tag('inclusion_tags/maps.html')
def global_organisation_map(width, height, dynamic='dynamic'):
    """
    params:
        width, height: the dimensions of the map.
        dynamic: 'dynamic' (default) or 'static', map is scrollable and clickable if 'dynamic'.
    """

    if dynamic != 'dynamic':
        dynamic = False

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    locations = []

    for organisation in Organisation.objects.all():
        try:
            location = organisation.primary_location
            thumbnail = organisation.logo.extra_thumbnails['map_thumb'].absolute_url
            locations.append([location.latitude,
                              location.longitude,
                              [str(organisation.pk),organisation.name.encode('utf8'), thumbnail, 'organisation']])
        except:
            pass

    template_context = {
        'map_id': map_id,
        'width': width,
        'height': height,
        'marker_icon': ORGANISATION_MARKER_ICON,
        'locations': locations,
        'dynamic': dynamic,
        'infowindows': True,
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
            try:
                thumbnail = project.current_image.extra_thumbnails['map_thumb'].absolute_url
            except:
                thumbnail = ""
            locations.append([location.latitude,
                              location.longitude,
                              [str(project.pk), project.title.encode('utf8'), thumbnail, 'project']])

        for update_location in ProjectUpdateLocation.objects.filter(location_target__project=project):
            project_update = update_location.location_target

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
