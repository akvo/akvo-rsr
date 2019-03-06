# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import absolute_import, print_function

from django import template
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse

from akvo.rsr.models import Keyword, PartnerSite, Project, ProjectUpdate, Organisation

register = template.Library()


@register.inclusion_tag('rsr_utils/img.html', takes_context=True)
def img(context, obj, width, height, alt):
    """Standard way to show image."""
    img = ""
    geometry = "{}x{}".format(width, height)
    default_img = "//placehold.it/{}".format(geometry)

    if isinstance(obj, Project):
        img = obj.current_image
    elif isinstance(obj, ProjectUpdate):
        img = obj.photo
    elif isinstance(obj, Organisation):
        if obj.logo:
            img = obj.logo
        else:
            default_img = "//{}{}{}".format(
                context["request"].get_host(),
                getattr(settings, "STATIC_URL"),
                "rsr/images/default-org-logo.jpg")
    elif isinstance(obj, get_user_model()):
        img = obj.avatar
    elif isinstance(obj, PartnerSite):
        img = obj.logo
    elif isinstance(obj, Keyword):
        img = obj.logo

    return {"default_img": default_img,
            "geometry": geometry,
            "height": height,
            "width": width,
            "img": img,
            "alt": alt}


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


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.simple_tag
def project_edit_link(project, user):
    """Return the project edit link based on project status and user permissions."""
    published = project.publishingstatus.status == project.publishingstatus.STATUS_PUBLISHED
    view_name = 'project-edit' if published else 'project_editor'
    return reverse(view_name, args=[project.pk])
