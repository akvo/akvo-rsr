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
from django.http import Http404

from akvo.rsr.models import Project, Organisation

register = template.Library()

#not used for now
#PROJECT_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_PROJECT_MARKER_ICON', '')
#ORGANISATION_MARKER_ICON = getattr(settings, 'GOOGLE_MAPS_ORGANISATION_MARKER_ICON', '')


# TODO: this should be fixed so partner sites use their own domain
HOST = 'http://%s/' % getattr(settings, 'DOMAIN_NAME', 'akvo.org')

@register.inclusion_tag('inclusion_tags/map.html')
def map(resource, width, height, type="dynamic", marker_icon=""):
    """
    Generic google map inclusion tag tha ses the RSR api to fetch data
    params:
        resource: the name of the resource as a string or an object of that resource's model
            currently "project" and "organisation" can be used
        width, height: the dimensions of the map
        type: there are three types currently: "dynamic", "static" and "small" the two first are used for global maps
            the "small" map is used for a single project or organisation's marker(s)
        marker_icon: the name of an icon to use rather than the default. the icon must be in mediaroot/core/img/
    """

    map_id = 'akvo_map_%s' % os.urandom(8).encode('hex')

    template_context = {
        'map_id': map_id,
        'type': type,
        'width': width,
        'height': height,
        'host': HOST,
        'marker_icon': marker_icon,
    }
    #extend this to support more models that have a location
    supported_models = (Project, Organisation)

    # determine if we have the name of the resource or an object of that kind
    # Hack! TODO: refactor to use the proper API resources
    # if it's a string we return the corresponding NNNMapResource resource name
    if isinstance(resource, basestring):
        template_context['resource'] = "map_for_%s" % resource
    # otherwise return the NNNResource resource name
    elif isinstance(resource, supported_models):
        template_context['resource'] = resource.__class__.__name__.lower()
        template_context['object_id'] = resource.id
    return template_context
