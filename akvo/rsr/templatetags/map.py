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

from akvo.rsr.models import Project, Organisation

register = template.Library()

PROJECT_MARKER_ICON = getattr(settings,
    'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
ORGANISATION_MARKER_ICON = getattr(settings,
    'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')


@register.inclusion_tag('inclusion_tags/map.html')
def map(object, width, height, zoom, marker_icon=None):
    is_project = isinstance(object, Project)
    is_organisation = isinstance(object, Organisation)
    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')
    if is_project:
        marker_icon = PROJECT_MARKER_ICON
        template_context = dict(type="project", object=object, width=width,
            height=height, zoom=zoom, marker_icon=marker_icon, map_id=map_id)
    elif is_organisation:
        marker_icon = ORGANISATION_MARKER_ICON
        template_context = dict(typ="objects", object=object, width=width,
            height=height, zoom=zoom, marker_icon=marker_icon, map_id=map_id)
    return template_context
