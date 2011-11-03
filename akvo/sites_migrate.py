from django.core.management import setup_environ
import settings

setup_environ(settings)

from django.contrib.sites.models import Site


def main():
    existing_sites = Site.objects.all()
    for existing_site in existing_sites:
        existing_site.delete()
        print 'Removed legacy site %s.' % existing_site.domain
    default_site = Site(id=1, domain='www.akvo.org', name='Akvo RSR')
    default_site.save()
    print 'Created default site.'
    partner_site = Site(id=2, domain='akvoapp.org', name='Akvo Partner Site')
    partner_site.save()
    print 'Created partner site.'


if __name__ == '__main__':
    main()
