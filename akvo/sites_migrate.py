from django.core.management import setup_environ
import settings

setup_environ(settings)

from django.contrib.sites.models import Site


def main():
    sites = Site.objects.all()
    for site in sites:
        site.enabled = True
        site.save()

if __name__ == '__main__':
    main()
