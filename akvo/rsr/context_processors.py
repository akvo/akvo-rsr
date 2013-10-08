import django
from django.contrib.sites.models import get_current_site
from django.conf import settings

def extra_context(request, protocol="http"):
    current_site = get_current_site(request)
    django_version = django.get_version()
    deploy_tag = getattr(settings, 'DEPLOY_TAG', 'Unknown')
    deploy_branch = getattr(settings, 'DEPLOY_BRANCH', 'Unknown')
    deploy_commit_id = getattr(settings, 'DEPLOY_COMMIT_ID', 'Unknown')
    deploy_commit_full_id = getattr(settings, 'DEPLOY_COMMIT_FULL_ID', 'Unknown')

    template_context = dict(
        current_site=current_site,
        django_version=django_version,
        deploy_tag = deploy_tag,
        deploy_branch = deploy_branch,
        deploy_commit_id = deploy_commit_id,
        deploy_commit_full_id = deploy_commit_full_id)
    return template_context

def get_current_path_without_lang(request):
    path = request.get_full_path()
    path_bits = path.split('/')
    path = '/'.join(path_bits[2:])
    return {'current_path_without_lang': path}

