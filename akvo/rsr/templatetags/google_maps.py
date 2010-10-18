# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()

from akvo.rsr.models import Project

"""
@register.inclusion_tag('inclusion_tags/_static_map.html')
def static_map(model_path, object_id, width, height, zoom, marker_color):
    app, model = model_path.split('.')
    content_type = ContentType.objects.get(app_label=app, model=model)
    object = content_type.get_object_for_this_type(id=object_id)
    base_url = 'http://maps.google.com/maps/api/staticmap?'
    query = 'markers=color:%s|%s&size=%sx%s&zoom=%d&sensor=false' % \
        (marker_color, object.get_location(), width, height, zoom)
    map_url = base_url + query
    return {'object': object,
            'map_url': map_url,
            'width': width,
            'height': height}
"""

@register.inclusion_tag('inclusion_tags/google_map.html')
def google_map(object, width, height, zoom):
    marker_icon = getattr(settings, 'GOOGLE_MAPS_MARKER_ICON', '')
    template_context = dict(object=object, width=width, height=height,
        zoom=zoom, marker_icon=marker_icon)
    return template_context

@register.inclusion_tag('inclusion_tags/google_global_project_map.html')
def google_global_project_map(map_type, width, height, zoom):
    projects = Project.objects.published().has_primary_location()
    if map_type == 'static':
        marker_icon = getattr(settings, 'GOOGLE_MAPS_SMALL_MARKER_ICON', '')
    else:
        marker_icon = getattr(settings, 'GOOGLE_MAPS_MARKER_ICON', '')
    template_context = dict(map_type=map_type,
        marker_icon=marker_icon,
        projects=projects,
        width=width,
        height=height,
        zoom=zoom)
    return template_context

@register.inclusion_tag('inclusion_tags/google_static_global_project_map.html')
def google_static_global_project_map(width, height, zoom, marker_color, marker_size):
    if marker_size.lower() not in ('normal', 'mid', 'small', 'tiny'):
        marker_size = 'normal'
    projects = Project.objects.published().has_primary_location()
    locations = ''
    for project in projects:
        locations += '%f,%f|' % (project.primary_location.latitude,
            project.primary_location.longitude)
    base_url = 'http://maps.google.com/maps/api/staticmap'
    markers = 'markers=size:%s|color:%s|%s' % (marker_size.lower(), 
        marker_color, locations)
    map_url = '%s?%s&size=%dx%d&zoom=%d&sensor=false' % (base_url, 
        markers, width, height, zoom)
    template_context = dict(map_url=mark_safe(map_url), width=width,
        height=height, zoom=zoom)
    return template_context
