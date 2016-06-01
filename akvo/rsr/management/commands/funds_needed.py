# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand
from optparse import make_option
from ...models import Project


class Command(BaseCommand):
    args = '<value>'
    help = 'Checks all projects with a funding between 0 and a specified value'

    option_list = BaseCommand.option_list + (
        make_option(
            '--zero',
            action='store_true',
            dest='zero',
            default=False,
            help='Set needs funding to 0, instead of only printing results'),
        make_option(
            '--complete',
            action='store_true',
            dest='complete',
            default=False,
            help='Set projects to the \'Complete\' status'),
    )

    def __init__(self, *args, **kwargs):
        self.value = None
        self.projects = None
        super(Command, self).__init__(*args, **kwargs)

    def get_projects(self):
        self.projects = Project.objects.filter(funds_needed__gt=0., funds_needed__lt=self.value)

    def print_projects(self):
        self.stdout.write('')
        self.stdout.write('Found {0} project{1}...'.format(
            str(self.projects.count()),
            's' if not self.projects.count() == 1 else ''))

        if self.projects.count() > 0:
            self.stdout.write('')
            self.stdout.write(' id   | funds needed |')
            self.stdout.write('------|--------------|')
            for p in self.projects.order_by('id'):
                self.stdout.write('{pk:{fill}6}|{funds:{fill}14}|'.format(
                    pk=p.pk, funds=p.funds_needed, fill=' '))
            self.stdout.write('------|--------------|')

    def handle(self, *args, **options):
        """
        Walk through all projects and find projects where the needs funding is in between 0 and the
        provided decimal. Print these projects, and set the needs_funding field to 0 if the --do
        option is supplied.
        """
        error = ''
        if len(args) != 1:
            error = 'Please specify exactly 1 value'
        else:
            try:
                self.value = Decimal(args[0])
            except InvalidOperation:
                error = 'Please specify a decimal, using a period to denote the decimals'

        if error:
            self.stdout.write(error)
            self.stdout.write('')
            self.stdout.write('Usage: /var/akvo/rsr/code/manage.py needs_funding [options] <value>')
            self.stdout.write('')
            return

        self.get_projects()
        self.print_projects()

        # Set funds needed to 0 for the retrieved projects
        if self.projects.count() > 0 and options['zero']:
            for p in self.projects:
                p.funds_needed = 0.
                p.save()

            self.stdout.write('')
            self.stdout.write('Succesfully set funds needed to 0 for {0} project{1}'.format(
                str(self.projects.count()),
                's' if not self.projects.count() == 1 else ''))

        # Set projects to 'Complete' for the retrieved projects
        if self.projects.count() > 0 and options['complete']:
            for p in self.projects:
                p.iati_status = '3'
                p.save()

            self.stdout.write('')
            self.stdout.write('Succesfully set status to \'Complete\' for {0} project{1}'.format(
                str(self.projects.count()),
                's' if not self.projects.count() == 1 else ''))

        self.stdout.write('')
        self.stdout.write('Done!')
        self.stdout.write('')
