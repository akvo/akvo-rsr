# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import django

from django.conf import settings
from django.contrib.sites.models import get_current_site


def extra_context(request, protocol="http"):
    """Add information to the request context."""
    current_site = get_current_site(request)
    django_version = django.get_version()
    deploy_tag = getattr(settings, 'DEPLOY_TAG', 'Unknown')
    deploy_branch = getattr(settings, 'DEPLOY_BRANCH', 'Unknown')
    deploy_commit_id = getattr(settings, 'DEPLOY_COMMIT_ID', 'Unknown')
    deploy_commit_full_id = getattr(
        settings, 'DEPLOY_COMMIT_FULL_ID', 'Unknown')

    return dict(
        current_site=current_site,
        django_version=django_version,
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

        # Check if only projects of the partner should be shown or all projects
        # if page.partner_projects:
        #     projects = page.organisation.published_projects().prefetch_related('locations')
        # else:
        #     projects = Project.objects.all().published().prefetch_related('locations')
        #
        # # Check if keywords have been specified for the partner site and filter projects based on keywords if so
        # if page.keywords.all():
        #     if page.exclude_keywords:
        #         projects = projects.exclude(keywords__in=page.keywords.all())
        #     else:
        #         projects = projects.filter(keywords__in=page.keywords.all())

        return {
            'rsr_page': page,
            'favicon': page.favicon,
            'logo': page.logo,
            'organisation': page.organisation,
            'return_url': page.return_url,
            'return_url_text': page.custom_return_url_text,
            'stylesheet': page.stylesheet,
            'akvoapp_root_url': request.akvoapp_root_url,
            'domain_url': request.domain_url,
            # 'projects_qs': projects.latest_update_fields().order_by('-id'),
            'no_facebook': not page.facebook_button,
            'facebook_app_id': page.facebook_app_id,
            'no_twitter': not page.twitter_button,
        }

    return {}
