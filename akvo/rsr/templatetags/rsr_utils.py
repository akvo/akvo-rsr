# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django import template
from akvo.rsr.models import Project, ProjectUpdate, Organisation
register = template.Library()



# class CycleNode(template.Node):
#     def __init__(self, cyclevars):
#         self.cyclevars = cyclevars

#     def render(self, context):
#         if self not in context.render_context:
#             context.render_context[self] = itertools.cycle(self.cyclevars)
#         cycle_iter = context.render_context[self]
#         return next(cycle_iter)

# @register.tag('img')
# def do_img(parser, obj, width, heigh, alt):
#     return '<img src="{}" alt={} />'.format("hi", "ha")


# @register.tag('rsr_utils/img.html', takes_context=True)
# def img(context, obj, width, height, alt):
#     """Standard way to show image"""

#     geometry = '{}x{}'.format(width, height)

#     # Based on type get image
#     img = obj
#     if isinstance(obj, Project):
#         img = obj.current_image
#     elif isinstance(obj, ProjectUpdate):
#         img = obj.photo
#     elif isinstance(obj, Organisation):
#         img = obj.logo

#     return {'alt': alt,
#             'height': height,
#             'img': img,
#             'geometry': geometry,
#             'width': width}


@register.inclusion_tag('rsr_utils/img.html', takes_context=True)
def img(context, obj, width, height, alt):
    """Standard way to show image"""

    geometry = '{}x{}'.format(width, height)

    # Based on type get image
    img = obj
    if isinstance(obj, Project):
        img = obj.current_image
    elif isinstance(obj, ProjectUpdate):
        img = obj.photo
    elif isinstance(obj, Organisation):
        img = obj.logo

    options = {'crop': True}

    height = '{}.px'.format(height)

    return {'alt': alt,
            'height': height,
            'options': options,
            'img': img,
            'geometry': geometry,
            'width': width}
