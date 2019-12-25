# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from ...models import Keyword
from ...models import Project


class Command(BaseCommand):
    help = "Script for merging and purging keywords"

    def handle(self, *args, **options):
        # This dict holds the old keywords as keys and the new ones as values
        mergers = {
            '2150:WvW 2015': 'wvw2015', '912:SRHR Alliance': 'SRHR Alliance',
            '2151:Walking for Water 2015': 'wfw2015', '1151:WvW 2014': 'wvw2014',
            '272:Connect4Change': 'Connect4Change', '1684:YEP Water': 'YEP', '444:WvW 2012': 'WvW',
            '1061:WASH Liberia': 'WASH Liberia', '487:Walking for Water 2012': 'WfW',
            'wfw2012': 'WfW', 'wfw2013': 'WfW', '829:Walking for Water 2013': 'WfW',
            '1060:Football for Water': 'Football for Water',
            '275:Dutch WASH Alliance': 'WASH Alliance', '1443:Walking for Water 2014': 'wfw2014',
            '815:WvW 2013': 'WvW', '2925:WvW 2016': 'wvw2016', 'wvw2012': 'WvW', 'wvw2013': 'WvW',
            'ttc': False, 'ttc-c4c': False
        }

        # setup a dict with all keyword objects
        keyword_objects = {}
        for key in mergers:
            keyword_objects[key], _ = Keyword.objects.get_or_create(label=key)
            if mergers[key]:
                keyword_objects[mergers[key]], _ = Keyword.objects.get_or_create(label=mergers[key])

        for project in Project.objects.all().prefetch_related('keywords'):
            for keyword in project.keywords.all():
                if mergers.get(keyword.label, False):
                    self.stdout.write(u"Adding keyword {} to project {}:{}".format(
                        keyword_objects[mergers[keyword.label]], project.id, project.title
                    ))
                    project.keywords.add(keyword_objects[mergers[keyword.label]])
                    self.stdout.write(u"Removing keyword {} from project {}:{}".format(
                        keyword.label, project.id, project.title
                    ))
                    project.keywords.remove(keyword)

        for key in mergers:
            self.stdout.write(u"Deleting keyword {}".format(key))
            Keyword.objects.get(label=key).delete()
