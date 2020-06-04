# -*- coding: utf-8 -*-


"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

Code based on django-piwik, https://github.com/raphaa/django-piwik
"""

from django import template
from django.conf import settings


register = template.Library()


@register.inclusion_tag('piwik/tracking_code.html', takes_context=True)
def piwik_tracking_code(context):
    """Try and use configured partner site Piwik values otherwise pull from settings."""

    request = context.get('request')
    if request and request.rsr_page and request.rsr_page.piwik_id:
        piwik_id = context['request'].rsr_page.piwik_id
    else:
        piwik_id = settings.PIWIK_SITE_ID

    return {'id': piwik_id, 'url': settings.PIWIK_HOST}
