import django
from django.contrib.sites.models import get_current_site

def extra_context(request, protocol="http"):
    current_site = get_current_site(request)
    django_version = django.get_version()
    template_context = dict(
        current_site=current_site,
        django_version=django_version)
    return template_context

def get_current_path_without_lang(request):
    path = request.get_full_path()
    path_bits = path.split('/')
    path = '/'.join(path_bits[2:])
    return {'current_path_without_lang': path}

