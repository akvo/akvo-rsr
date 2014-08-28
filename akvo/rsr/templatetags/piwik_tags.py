# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# code based on django-piwik, https://github.com/raphaa/django-piwik

from django import template
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


register = template.Library()


@register.inclusion_tag('piwik/tracking_code.html')
def tracking_code():
    if settings.PARTNER_SITE and settings.PARTNER_SITE.piwik_id:
        id = settings.PARTNER_SITE.piwik_id
    else:
        try:
            id = settings.PIWIK_SITE_ID
        except AttributeError:
            raise ImproperlyConfigured('PIWIK_SITE_ID does not exist.')
    try:
        url = settings.PIWIK_URL
    except AttributeError:
        raise ImproperlyConfigured('PIWIK_URL does not exist.')
    return {'id': id, 'url': url}
