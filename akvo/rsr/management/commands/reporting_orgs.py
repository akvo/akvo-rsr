# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import sys

from collections import namedtuple
from django.core.management.base import BaseCommand, OutputWrapper

from ...models import Project, Partnership, Organisation

FixProject = namedtuple('FixProject', ['project', 'reason', 'partners', 'sync_owner'])
OKProject = namedtuple('OKProject', ['project', 'organisation'])


class ReportingOrgMaker(object):

    NO_CANDIDATE = 'no candidate'
    MULTIPLE_CANDIDATES = 'multiple candidates'
    SYNC_NOT_SUPPORT = 'sync not support'

    def __init__(self, options):
        self.stdout = OutputWrapper(options.get('stdout', sys.stdout))
        self.keyword_based_reporting_orgs = {
            'WASH Alliance': 8,
            'Connect4Change': 34,
            'SRHR Alliance': 1043,
            'WvW': 43,
            'wvw2014': 43,
            'wvw2015': 43,
            'wvw2016': 43,
            'WfW': 43,
            'wfw2014': 43,
            'wfw2015': 43,
            'wfw2016': 43,
        }
        self.keywords_set = set(self.keyword_based_reporting_orgs.keys())
        self.migrate = options['migrate']
        self.ok_list = []
        self.fix_list = []

    def add_to_ok(self, project, org):
        self.ok_list += [OKProject(project, org)]

    def add_to_fix(self, project, reason, partners, sync_owner=None):
        self.fix_list += [FixProject(project, reason, partners, sync_owner)]

    def find_reporting_org_for_projects(self):
        # loop over all projects, trying ot figure reporting-org for each.
        self.stdout.write('\nData gathering progress:')
        i = 1
        for project in Project.objects.published().prefetch_related(
                'partnerships', 'partnerships__organisation', 'keywords'):
            if not i % 100:
                self.stdout.write(str(i))
            else:
                self.stdout.write(".", ending='')
            i += 1
            self.stdout.flush()

            # first check if we have a keyword from the keyword_based_reporting_orgs.keys() list
            reporting_keyword = self.keywords_set.intersection(
                set(project.keywords.values_list('label', flat=True)))
            if reporting_keyword:
                # if we do, set the reporting-org to the org connected to the keyword
                self.add_to_ok(project, Organisation.objects.get(
                    pk=self.keyword_based_reporting_orgs[list(reporting_keyword)[0]]))
            else:
                # otherwise try to find the reporting org among sync_owner and accountable partners
                support_partners = project.partnerships.filter(
                    iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
                ).select_related('organisation')

                # If there's no support partner, we set the sync_owner as reporting-org,
                # if there is one. Otherwise we report the problem.
                if support_partners.count() == 0:
                    if project.sync_owner:
                        self.add_to_ok(project, project.sync_owner)
                    else:
                        self.add_to_fix(project, self.NO_CANDIDATE, [])

                # If we have exactly one support partner, then things are in order if either:
                # 1) the sync_owner matches the support partner
                #   2) there is no sync_owner
                # In both cases we should be fine to set the sync_owner/support partner as the
                # reporting-org.
                elif support_partners.count() == 1:
                    if project.sync_owner:
                        # 1)
                        if project.sync_owner == support_partners[0].organisation:
                            self.add_to_ok(project, project.sync_owner)
                        else:
                            self.add_to_fix(project, self.SYNC_NOT_SUPPORT, support_partners,
                                            project.sync_owner)
                    # 2)
                    else:
                        self.add_to_ok(project, support_partners[0].organisation)

                # If there are multiple support partners we check if one of the partners is sync_owner
                # we set that organisation to reporting. Otherwise we report the problem.
                else:
                    if project.sync_owner:
                        if project.sync_owner.id in [p.organisation.id for p in support_partners]:
                            self.add_to_ok(project, project.sync_owner)
                        else:
                            self.add_to_fix(project, self.MULTIPLE_CANDIDATES, support_partners)

    def create_reporting_orgs(self):
        try:
            reporting_org_choice = Partnership.IATI_REPORTING_ORGANISATION
            self.stdout.write(
                "\n*** Assigning reporting-org partners to the following projects ***"
            )
            self.stdout.write(
                "project ID, project title, organisation id, organisation name"
            )
            for data in self.ok_list:
                partner = Partnership(
                    organisation=data.organisation,
                    iati_organisation_role=reporting_org_choice)
                data.project.partnerships.add(partner)
                self.print_ok_data(data)
        except Exception:
            self.stdout.write(
                "\n*** Reporting organisation choice not available for Partnerships ***"
            )

    def print_ok_data(self, data):
        self.stdout.write(
            '{},"{}",{},"{}"'.format(data.project.id, data.project.title, data.organisation.id,
                                     data.organisation.name))

    def print_fix_data(self, data, partner):
        self.stdout.write(
            '{},"{}",{},"{}","{}",{},"{}"'.format(
                data.project.id,
                data.project.title,
                partner.organisation.id,
                partner.organisation.name,
                data.reason,
                data.sync_owner.id if data.sync_owner else '',
                data.sync_owner.name if data.sync_owner else ''))

    def output_ok_list(self):
        self.stdout.write(
            "\n*** List of projects and the <reporting-org> partner they will get when migrating ***"
        )
        self.stdout.write(
            "project ID, project title, organisation id, organisation name"
        )
        for data in self.ok_list:
            self.print_ok_data(data)

    def output_fix_list(self):
        self.stdout.write(
            "\n*** List of projects where no clear-cut reporting-org candidate was found ***"
        )
        self.stdout.write(
            "project ID, project title, support partner id, support partner name, type of problem, sync_owner id, sync_owner name"
        )
        for data in self.fix_list:
            for partner in data.partners:
                self.print_fix_data(data, partner)


class Command(BaseCommand):
    help = 'Checks that all projects get a reporting organisation when migrating from sync_owner'

    def add_arguments(self, parser):
        parser.add_argument(
            '--migrate',
            action='store_true',
            help='Migrate the database, creating reporting-org partnership objects'
        )

    def handle(self, *args, **options):
        """
        Walk through all projects and find projects where we need to figure out what to do to be
        able to assign a reporting organisation partner.
        """

        reporter_maker = ReportingOrgMaker(options)
        reporter_maker.find_reporting_org_for_projects()
        if reporter_maker.migrate:
            reporter_maker.create_reporting_orgs()
            reporter_maker.output_fix_list()
        else:
            reporter_maker.output_ok_list()
            reporter_maker.output_fix_list()

        self.stdout.write('Done!')
