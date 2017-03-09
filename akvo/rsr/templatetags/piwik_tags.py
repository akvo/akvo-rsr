# -*- coding: utf-8 -*-


"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

Code based on django-piwik, https://github.com/raphaa/django-piwik
"""

from django import template
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


register = template.Library()


@register.inclusion_tag('piwik/tracking_code.html', takes_context=True)
def piwik_tracking_code(context):
    """Try and use configured partner site Piwik values otherwise pull from settings."""
    try:
        piwik_id = settings.PIWIK_SITE_ID,
        if isinstance(piwik_id, tuple):
            piwik_id = piwik_id[0]
    except AttributeError:
        raise ImproperlyConfigured('PIWIK_SITE_ID does not exist.')

    try:
        piwik_url = settings.PIWIK_URL
    except AttributeError:
        raise ImproperlyConfigured('PIWIK_URL does not exist.')

    if context['request'].rsr_page and context['request'].rsr_page.piwik_id:
        return {
            'id': context['request'].rsr_page.piwik_id,
            'url': piwik_url
        }

    return {'id': piwik_id, 'url': piwik_url}
