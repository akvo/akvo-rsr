# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from __future__ import print_function

import csv
import datetime
from os.path import abspath, dirname, join

from django.core.management.base import BaseCommand

from akvo.rsr.models import User

HERE = dirname(abspath(__file__))
OUTPUT_PATH = abspath(join(HERE, '..', '..', '..', '..', 'data', 'user-list.csv'))


def mark_users_as_inactive(fd_csv):
    user_data = csv.reader(fd_csv, delimiter=',', quotechar='"')
    header = next(user_data)
    email_column = header.index('Email')
    emails = [row[email_column] for row in user_data]
    print('Looking for {} emails'.format(len(emails)))
    users = User.objects.filter(email__in=emails)
    print('Setting {} users as inactive'.format(users.count()))
    users.update(is_active=False)


def export(n_years=100):
    today = datetime.datetime.today()
    last_login_cutoff = today - datetime.timedelta(days=365 * n_years)
    users = User.objects.filter(
        is_active=True, employers__gt=0, last_login__gt=last_login_cutoff
    ).distinct()
    print('Exporting {} users to {}'.format(users.count(), OUTPUT_PATH))
    with open(OUTPUT_PATH, 'w') as f:
        for user in users:
            f.write('"{}",{}\n'.format(user.get_full_name().encode('utf8'), user.email))


class Command(BaseCommand):
    help = 'Script to manage user list for using with hubspot'

    def add_arguments(self, parser):
        subparsers = parser.add_subparsers()

        set_inactive = subparsers.add_parser('set_inactive', cmd=self)
        set_inactive.add_argument('user_list_csv', type=open, help='path to the csv with user list')

        export = subparsers.add_parser('export', cmd=self)
        export.add_argument('-n', type=int,
                            help='limit for number of years since last login',
                            default=100)

    def handle(self, *args, **options):
        if 'user_list_csv' in options:
            mark_users_as_inactive(options['user_list_csv'])
        else:
            export(options['n'])
