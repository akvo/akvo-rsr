# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
from django.conf import settings

register = template.Library()

from akvo.rsr.models import Project, Organisation

@register.inclusion_tag('inclusion_tags/google_map.html')
def google_map(object, width, height, zoom):
    project_marker_icon = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
    organisation_marker_icon = getattr(settings, 'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')
    template_context = dict(object=object, width=width, height=height,
        zoom=zoom, project_marker_icon=project_marker_icon,
        organisation_marker_icon=organisation_marker_icon)
    return template_context

@register.inclusion_tag('inclusion_tags/google_global_project_map.html')
def google_global_project_map(map_type, width, height, zoom):
    projects = Project.objects.published().has_primary_location()
    marker_icon = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
    template_context = dict(map_type=map_type,
        marker_icon=marker_icon,
        projects=projects,
        width=width,
        height=height,
        zoom=zoom)
    return template_context

@register.inclusion_tag('inclusion_tags/google_global_organisation_map.html')
def google_global_organisation_map(map_type, width, height, zoom):
    organisations = Organisation.objects.has_primary_location()
    marker_icon = getattr(settings, 'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')
    template_context = dict(map_type=map_type,
        marker_icon=marker_icon,
        organisations=organisations,
        width=width,
        height=height,
        zoom=zoom)
    return template_context
