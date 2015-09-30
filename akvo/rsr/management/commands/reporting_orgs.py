# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from ...models import Project, Partnership

class Command(BaseCommand):
    help = 'Checks that all projects get a reporting organisation when migrating from sync_owner'

    def handle(self, *args, **options):
        ok = []
        fix = []
        i = 1
        for project in Project.objects.all():
            if not i % 100:
                self.stdout.write(str(i))
            else:
                self.stdout.write(".", ending='')
            i += 1
            self.stdout.flush()
            support_partners = project.partnerships.filter(
                iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
            )
            if support_partners.count() == 1:
                if project.sync_owner and project.sync_owner == support_partners[0].organisation:
                    ok += [(project.id, project.title, project.sync_owner.id,
                            project.sync_owner.name,)]
                else:
                    fix += [(project.id, project.title, support_partners,"sync_not_support")]
            else:
                fix += [(project.id, project.title, support_partners,"")]
        self.stdout.write(
            u"*** Migratable projects ***"
        )
        self.stdout.write(
            u"project ID, project title, organisation id, organisation name"
        )
        for ok_project in ok:
            self.stdout.write(
                u'{},"{}",{},"{}"'.format(*ok_project)
            )
        if fix:
            self.stdout.write(
                u"*** Projects that need fixing ***"
            )
            self.stdout.write(
                u"project ID, project title, candidate org id, candidate org name, sync owner doesn't match support partner"
            )
            for fix_project in fix:
                candidates = []
                if len(fix_project[2]):
                    for candidate in fix_project[2]:
                        candidates += [(candidate.organisation.id, candidate.organisation.name)]
                else:
                    candidates += [(0, "None")]
                for candidate in candidates:
                    self.stdout.write(
                        u'{},"{}",{},"{}",{}'.format(fix_project[0], fix_project[1],candidate[0],candidate[1],fix_project[3])
                    )
        else:
            self.stdout.write(
                u"*** All projects GO! ***"
            )

