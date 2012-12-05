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

#not used for now
#PROJECT_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
#ORGANISATION_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')

#RAW_HOST = getattr(settings, 'DOMAIN_NAME', 'akvo.org')
#
## Production server uses leading 'www'
#if RAW_HOST == 'akvo.org':
#    HOST = 'http://www.akvo.org/'
#else:
#    HOST = 'http://%s/' % RAW_HOST

# TODO: this will break on partner sites I think
HOST = 'http://%s/' % getattr(settings, 'DOMAIN_NAME', 'akvo.org')

@register.inclusion_tag('inclusion_tags/map.html')
def map(resource, width, height, type="dynamic", marker_icon=""):

    is_project = isinstance(object, Project)
    is_organisation = isinstance(object, Organisation)
    is_all_projects = isinstance(object, basestring) and (object == 'projects')
    is_all_organisations = isinstance(object, basestring) and (object == 'organisations')

    # We want a unique id for each map element id
    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')
    template_context = {
        'map_id': map_id,
        'type': type,
        'width': width,
        'height': height,
        'host': HOST,
        'marker_icon': marker_icon,
    }

    supported_models = (Project, Organisation)

    if isinstance(resource, basestring):
        template_context['resource'] = resource
    elif isinstance(resource, supported_models):
        template_context['resource'] = resource.__class__.__name__.lower()
        template_context['object_id'] = resource.id
    return template_context


#    if is_project:
#        template_context['object'] = object.id
#        template_context['objectType'] = 'project'
#    elif is_all_projects:
#        template_context['object'] = object
#        template_context['objectType'] = 'projects'
#    elif is_organisation:
#        template_context['object'] = object.id
#        template_context['objectType'] = 'organisation'
#    elif is_all_organisations:
#        template_context['object'] = object
#        template_context['objectType'] = 'organisations'
#    return template_context
