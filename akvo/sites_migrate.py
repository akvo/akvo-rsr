from django.core.management import setup_environ
import settings

setup_environ(settings)

from django.contrib.sites.models import Site


def main():
    existing_sites = Site.objects.all()
    for existing_site in existing_sites:
        existing_site.delete()
        print 'Removed legacy site %s.' % existing_site.domain
    production_site = Site(domain='www.akvo.org', name='Akvo RSR (production)')
    production_site.save()
    print 'Created default production site.'
    local_site = Site(domain='akvo.dev', name='Akvo RSR (local)')
    local_site.save()
    print 'Created default local development site.'


if __name__ == '__main__':
    main()
