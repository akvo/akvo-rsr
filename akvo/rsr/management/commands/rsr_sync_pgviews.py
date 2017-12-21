# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from optparse import make_option
import logging

from django.core.management.base import BaseCommand

from django_pgviews.models import ViewSyncer

log = logging.getLogger('django_pgviews.sync_pgviews')


class Command(BaseCommand):
    help = """Create/update Postgres views for all installed apps."""

    option_list = BaseCommand.option_list + (
        make_option('--no-update',
                    action='store_false',
                    dest='update',
                    default=True,
                    help="Don't update existing views, only create new ones."),
        make_option('--force',
                    action='store_true',
                    dest='force',
                    default=False,
                    help="Force replacement of pre-existing views where breaking changes have been "
                         "made to the schema.")
    )

    def handle(self, *args, **options):
        vs = ViewSyncer()
        vs.run(options['force'], options['update'])
