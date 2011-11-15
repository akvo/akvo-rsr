import django
from django.contrib.sites.models import RequestSite

def extra_context(request):
    current_site = RequestSite(request)
    django_version = django.get_version()
    template_context = dict(
        current_site=current_site,
        django_version=django_version)
    return template_context
