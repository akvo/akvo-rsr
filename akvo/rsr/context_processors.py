# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import django

from django.conf import settings
from django.core.exceptions import DisallowedHost
from django.contrib.sites.models import get_current_site


def extra_context(request, protocol="http"):
    """Add information to the request context."""
    try:
        current_site = get_current_site(request)
    except DisallowedHost:
        current_site = None

    django_version = django.get_version()
    debug = getattr(settings, 'DEBUG', False)
    deploy_tag = getattr(settings, 'DEPLOY_TAG', 'Unknown')
    deploy_branch = getattr(settings, 'DEPLOY_BRANCH', 'Unknown')
    deploy_commit_id = getattr(settings, 'DEPLOY_COMMIT_ID', 'Unknown')
    deploy_commit_full_id = getattr(settings, 'DEPLOY_COMMIT_FULL_ID', 'Unknown')

    return dict(
        current_site=current_site,
        django_version=django_version,
        debug=debug,
        deploy_tag=deploy_tag,
        deploy_branch=deploy_branch,
        deploy_commit_id=deploy_commit_id,
        deploy_commit_full_id=deploy_commit_full_id
    )


def get_current_path_without_lang(request):
    """Return current path without lang."""
    path = request.get_full_path()
    path_bits = path.split('/')
    path = '/'.join(path_bits[2:])
    return {'current_path_without_lang': path}


def extra_pages_context(request):
    """Add context information of an RSR Page."""
    if request.rsr_page:
        page = request.rsr_page
        return {
            'rsr_page': page,
            'favicon': page.favicon,
            'logo': page.logo,
            'organisation': page.organisation,
            'return_url': page.return_url,
            'return_url_text': page.custom_return_url_text,
            'page_stylesheet': page.stylesheet,
            'akvoapp_root_url': '//{}'.format(settings.AKVOAPP_DOMAIN),
            'domain_url': '//{}'.format(settings.RSR_DOMAIN),
            'no_facebook': not page.facebook_button,
            'facebook_app_id': page.facebook_app_id,
            'no_twitter': not page.twitter_button,
        }

    return {}
