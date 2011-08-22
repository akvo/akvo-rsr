from django.core.management import setup_environ
import settings

setup_environ(settings)

from django.contrib.sites.models import Site


def enable_existing_sites():
    sites = Site.objects.all()
    for site in sites:
        site.enabled = True
        site.save()
    print 'Existing sites migrated.\n'

def create_local_development_site():
    site = Site.objects.get(name='localhost:8000')
    site.name = 'Local development (vanilla RSR)'
    site.domain = site.development_domain = 'akvo.dev'
    site.enabled = True
    site.save()
    print 'Local development site created.\n'

if __name__ == '__main__':
    enable_existing_sites()
    create_local_development_site()
