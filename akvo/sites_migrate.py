from django.core.management import setup_environ
import settings

setup_environ(settings)

from django.contrib.sites.models import Site


def main():
    existing_sites = Site.objects.all()
    for existing_site in existing_sites:
        existing_site.delete()
        print 'Removed existing sites.'
    site = Site(domain='www.akvo.org', name='Akvo RSR',
                development_domain='akvo.dev',
                enabled=True)
    site.save()
    print 'Created new default site.\n' \
          'If developing locally, please ensure that an alias ' \
          'for akvo.dev is defined in your /etc/hosts file.'


if __name__ == '__main__':
    main()
