# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from ...models import Project, Partnership

class Command(BaseCommand):
    help = 'Checks that all projects get a reporting organisation when migrating from sync_owner'

    def handle(self, *args, **options):
        """
        Walk through all projects and find projects where we need to figure out what to do to be
        able to assign a reporting organisation partner.
        """

        def add_to_ok(project, org):
            return [(project.id, project.title, org.id, org.name)]


        def add_to_fix(project, partners, reason, sync_owner=None):
            if sync_owner:
                return [
                    (project.id, project.title, partners, reason, sync_owner.id, sync_owner.name)
                ]
            else:
                return [(project.id, project.title, partners, reason, "", "")]

        ok_list = []
        fix_list = []
        i = 1

        for project in Project.objects.all().prefetch_related(
                'partnerships', 'partnerships__organisation'
        ):
            if not i % 100:
                self.stdout.write(str(i))
            else:
                self.stdout.write(".", ending='')
            i += 1
            self.stdout.flush()
            support_partners = project.partnerships.filter(
                iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
            ).select_related('organisation')

            # If there's no support partner, we set the sync_owner as reporting-org,
            # if there is one. Otherwise we report the problem.
            if support_partners.count() == 0:
                if project.sync_owner:
                    ok_list += add_to_ok(project, project.sync_owner)
                else:
                    fix_list += add_to_fix(project, [], "no candidate")

            # If we have exactly one support partner, then things are in order if either:
            #   1) the sync_owner matches the support partner
            #   2) there is no sync_owner
            # In both cases we should be fine to set the sync_owner/support partner as the
            # reporting-org.
            elif support_partners.count() == 1:
                if project.sync_owner:
                    # 1)
                    if project.sync_owner == support_partners[0].organisation:
                        ok_list += add_to_ok(project, project.sync_owner)
                    else:
                        fix_list += add_to_fix(project, support_partners, "sync not support", project.sync_owner)
                # 2)
                else:
                    ok_list += add_to_ok(project, support_partners[0].organisation)

            # If there are multiple support partners we check if one of the partners is sync_owner
            # we set that organisation to reporting. Otherwise we report the problem.
            else:
                if project.sync_owner:
                    if project.sync_owner.id in [p.organisation.id for p in support_partners]:
                        ok_list += add_to_ok(project, project.sync_owner)
                    else:
                        fix_list += add_to_fix(project, support_partners, "multiple candidates")
        self.stdout.write(
            u"*** Migratable projects ***"
        )
        self.stdout.write(
            u"project ID, project title, organisation id, organisation name"
        )
        for ok_project in ok_list:
            self.stdout.write(
                u'{},"{}",{},"{}"'.format(*ok_project)
            )
        if fix_list:
            self.stdout.write(
                u"*** Projects that need fixing ***"
            )
            self.stdout.write(
                u"project ID, project title, support partner id, support partner name, type of problem, sync_owner id, sync_owner name"
            )
            for fix_project in fix_list:
                candidates = []
                if len(fix_project[2]):
                    for candidate in fix_project[2]:
                        candidates += [(candidate.organisation.id, candidate.organisation.name)]
                else:
                    candidates += [(0, "None")]
                for candidate in candidates:
                    self.stdout.write(
                        u'{},"{}",{},"{}",{},{},"{}"'.format(fix_project[0], fix_project[1],candidate[0],candidate[1],fix_project[3], fix_project[4], fix_project[5])
                    )
        else:
            self.stdout.write(
                u"*** All projects GO! ***"
            )

