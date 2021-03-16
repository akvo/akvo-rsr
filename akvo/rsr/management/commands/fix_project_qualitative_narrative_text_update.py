# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from django.db.models import Q

from akvo.rsr.models import Project, IndicatorPeriodData
from akvo.rsr.models.result.utils import QUALITATIVE


class Command(BaseCommand):
    help = """Move qualitative IndicatorPeriodData.text value to IndicatorPeriodData.narrative.

    Fix inconsistency on IndicatorPeriodData narrative which should be stored in narrative
    attribute instead of text attribute. This script will looks for qualitative period update
    with non empty text attribute value but with empty narrative and move the text value to the
    narrative attribute.

    """

    def add_arguments(self, parser):
        parser.add_argument(
            'project_id',
            type=int,
            help='The root project hierarchy under which all projects are fixed',
        )

    def handle(self, *args, **options):
        root_project = Project.objects.get(id=options['project_id'])
        root_hierarchy_ids = root_project.descendants().values_list('id', flat=True)
        queryset = IndicatorPeriodData.objects\
            .filter(period__indicator__type=QUALITATIVE, period__indicator__result__project__in=root_hierarchy_ids)\
            .filter(Q(narrative__isnull=True) | Q(narrative__exact=''))\
            .exclude(Q(text__isnull=True) | Q(text__exact=''))
        size = queryset.count()

        for update in queryset.all():
            print("Fixing data {}".format(update.id))
            narrative = update.text
            update.narrative = narrative
            update.text = ''
            update.save(update_fields=['narrative', 'text'])

        print("Fixes {} data".format(size))
