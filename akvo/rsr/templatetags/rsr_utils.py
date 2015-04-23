# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import absolute_import, print_function

from django import template
from django.contrib.auth import get_user_model
from akvo.rsr.models import PartnerSite, Project, ProjectUpdate, Organisation
register = template.Library()


@register.inclusion_tag('rsr_utils/img.html', takes_context=True)
def img(context, obj, width, height, alt):
    """Standard way to show image."""
    geometry = '{}x{}'.format(width, height)

    # Based on type get image
    img = obj
    if isinstance(obj, Project):
        img = obj.current_image
    elif isinstance(obj, ProjectUpdate):
        img = obj.photo
    elif isinstance(obj, Organisation):
        img = obj.logo
    elif isinstance(obj, get_user_model()):
        img = obj.avatar
    elif isinstance(obj, PartnerSite):
        img = obj.logo

    height = '{}.px'.format(height)

    return {'alt': alt,
            'height': height,
            'img': img,
            'geometry': geometry,
            'width': width}


@register.inclusion_tag('rsr_utils/vid_img.html', takes_context=True)
def vid_img(context, obj, width, height, alt):
    """Standard way to show video thumbnail."""
    geometry = '{}x{}'.format(width, height)

    # Based on type get video
    vid = obj
    if isinstance(obj, ProjectUpdate):
        vid = obj.video

    height = '{}.px'.format(height)

    return {'alt': alt,
            'height': height,
            'vid': vid,
            'geometry': geometry,
            'width': width}
