from django.core.management import setup_environ
import settings

setup_environ(settings)

from django.contrib.sites.models import Site


def main():
    existing_sites = Site.objects.all()
    for existing_site in existing_sites:
        existing_site.delete()
        print 'Removed existing sites.'
    default_site = Site(domain='www.akvo.org', name='Akvo RSR (production)')
    default_site.save()
    dev_site = Site(domain='akvo.dev', name='Akvo RSR (local)')
    dev_site.save()
    print 'Created new default sites.\n' \
          'If developing locally, please ensure that an alias ' \
          'for akvo.dev is defined in your /etc/hosts file.'


if __name__ == '__main__':
    main()
