from django.contrib.sites.models import Site

def extra_context(request):
    current_site = Site.objects.get_current()
    template_context = dict(current_site=current_site)
    return template_context
