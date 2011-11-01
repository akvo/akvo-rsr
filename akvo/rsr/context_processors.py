import django
from django.conf import settings
from django.contrib.sites.models import Site

def extra_context(request):
    domain_name = getattr(settings, 'DOMAIN_NAME', 'www.akvo.org')
    current_site = Site.objects.get_current()
    django_version = django.get_version()
    template_context = dict(
        domain_name=domain_name,
        current_site=current_site,
        django_version=django_version)
    return template_context
