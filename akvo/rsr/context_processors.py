import django
from django.contrib.sites.models import get_current_site

def extra_context(request):
    # TODO this will break oembedded videos if Sites is removed
    current_site = get_current_site(request)
    django_version = django.get_version()
    template_context = dict(
        current_site=current_site,
        django_version=django_version)
    return template_context
