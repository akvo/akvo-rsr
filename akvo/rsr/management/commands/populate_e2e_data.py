# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import logging
from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from akvo.rsr.models import User, Organisation, Employment


def create_user(email, password, is_admin=False, is_staff=False, is_superuser=False, is_active=True):
    first_name = email.split('@')[0]
    last_name = 'von {}enstein'.format(first_name)
    user = User.objects.create(
        email=email,
        username=email,
        first_name=first_name,
        last_name=last_name,
        is_staff=is_staff,
        is_admin=is_admin,
        is_superuser=is_superuser,
        is_active=is_active,
    )
    user.set_password(password)
    user.save()
    return user


def create_organisation(name, can_create_projects=True):
    org = Organisation.objects.create(
        name=name, long_name=name, can_create_projects=can_create_projects
    )
    return org


def make_employment(user, org, group_name):
    group = Group.objects.get(name=group_name)
    return Employment.objects.create(user=user, organisation=org, group=group, is_approved=True)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--teardown', action='store_true', help="Teardown data")

    def handle(self, *args, **options):
        teardown = bool(options['teardown'])
        if teardown:
            self.teardown()
        else:
            self.setup()

    def setup(self):
        saved_email_backend = settings.EMAIL_BACKEND
        settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
        logging.disable(logging.CRITICAL)

        create_user('e2e-admin@akvo.org', 'password', is_staff=True, is_superuser=True)
        user = create_user('e2e-user@akvo.org', 'password')
        org = create_organisation('e2e-org')
        make_employment(user, org, 'Admins')

        settings.EMAIL_BACKEND = saved_email_backend
        logging.disable(logging.NOTSET)

    def teardown(self):
        org = Organisation.objects.get(name='e2e-org')
        org.projects.all().delete()
        org.delete()
        User.objects.filter(email__in=['e2e-admin@akvo.org', 'e2e-user@akvo.org']).delete()
