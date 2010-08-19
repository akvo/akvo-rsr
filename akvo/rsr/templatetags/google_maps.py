# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.contenttypes.models import ContentType

from django import template
register = template.Library()

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
    return {'object': object,
            'width': width,
            'height': height,
            'zoom': zoom}
