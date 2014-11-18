#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.

This script is a tool to validate the transfer of data between mysql and
postgres using the Django ORM.
"""

from __future__ import print_function

import os
import sys
import unittest
import itertools

from django.db import connections

RSR_MODELS = ['Benchmark',
              'Benchmarkname',
              'BudgetItem',
              'BudgetItemLabel',
              'CountryBudgetItem',
              'Country',
              'RecipientCountry',
              'Category',
              'FocusArea',
              'Goal',
              'Indicator',
              'IndicatorPeriod',
              'Invoice',
              'InternalOrganisationID',
              'Keyword',
              'LegacyData',
              'Link',
              'OrganisationLocation',
              'ProjectLocation',
              'ProjectUpdateLocation',
              'MiniCMS',
              'Organisation',
              # 'OrganisationAccount', # No id's hence, need handle with care
              'PartnerSite',
              'PartnerType',
              'Partnership',
              'PayPalGateway',
              'MollieGateway',
              'PaymentGatewaySelector',
              'PlannedDisbursement',
              'PolicyMarker',
              'Project',
              'ProjectComment',
              'ProjectCondition',
              'ProjectContact',
              'ProjectUpdate',
              'PublishingStatus',
              'RecipientRegion',
              'Result',
              'Sector',
              'Transaction',
              'UserProfile',]


APPS = [{'package': 'akvo.rsr.models',
         'models': RSR_MODELS},
        {'package': 'django.contrib.auth.models',
         'models': ['Group', 'Permission', 'User', ]},
        {'package': 'django.contrib.admin.models',
         'models': ['LogEntry', ]},
        {'package': 'django.contrib.contenttypes.models',
         'models': ['ContentType', ]},
        {'package': 'django_counter.models',
         'models': ['ViewCounter', 'Referer', 'RedirCounter', ]},
        # {'package': 'notification.models',
        #  'models': ['Notice', 'NoticeSetting', 'NoticeSetting',
        #             'NoticeQueueBatch', 'ObservedItem', 'NoticeType', ]},
        {'package': 'oembed.models',
         'models': ['StoredOEmbed', 'AggregateMedia', 'StoredProvider', ]},
        {'package': 'paypal.standard.ipn.models',
         'models': ['PayPalIPN', ]},
        {'package': 'permissions.models',
         'models': ['Permission', 'ObjectPermission',
                    'ObjectPermissionInheritanceBlock',
                    'Role', 'PrincipalRoleRelation', ]},
        {'package': 'registration.models',
         'models': ['RegistrationProfile', ]},
        {'package': 'tastypie.models',
         'models': ['ApiAccess', 'ApiKey', ]}, ]


def is_float_equal(x, y):
    if abs(x - y) < 0.000000001:
        return True
    return False


class TestValidate(unittest.TestCase):
    """
    Our basic test class
    """

    def setUp(self):
        """Set the my & pg attribues to what the Django settings
        database name."""

        # Database names
        self.my = 'mysql'
        self.pg = 'default'

        self.my_cursor = connections[self.my].cursor()
        self.pg_cursor = connections[self.pg].cursor()

    def test_cell_by_cell(self):
        """Compare apps"""
        print('\nComparing cell by cell')

        for app in APPS:
            package = __import__(app['package'], fromlist=app['models'])

            for model in app['models']:
                print("\t{}.{} ".format(app['package'], model))

                module = getattr(package, model)

                sql = 'SELECT * FROM {} ORDER BY id DESC'.format(
                    module._meta.db_table)
                self.my_cursor.execute(sql)
                self.pg_cursor.execute(sql)

                # zip column name, mysql row and postgres row
                for row_set in itertools.izip(self.my_cursor, self.pg_cursor):
                    cols = [desc[0] for desc in self.my_cursor.description]
                    for column in itertools.izip(cols, row_set[0],
                                                 row_set[1]):

                        em = '\nModule: {}\n Column: {}'.format(module,
                                                                column[0])
                        if column[0] == 'ipaddress':
                            # print('got IP')

                            my_val = str(column[1])
                            pg_val = str(column[2])

                            # PG introduces trailing whitespace :-(
                            print('IP: [{}] - [{}]'.format(my_val, pg_val))

                            # Compare db values
                            self.assertEqual(my_val.rstrip(), pg_val.rstrip(),
                                             msg=em)

                        elif column[0] in ['latitude', 'longitude']:
                            # print('got lat or long')
                            diff = is_float_equal(column[1], column[2])
                            self.assertEqual(diff, True, em)

                        elif column[0] not in ['_state', 'last_modified_at']:
                            self.assertEqual(column[1], column[2], msg=em)

                        # if isinstance(column[1], (str, unicode)):
                        #     em_ws_pg = 'Trailing whitespace in mysql: [{}]'.format(
                        #         column[2])
                        #     if len(column[2]) > 0:
                        #         self.assertNotIn(column[2][-1],
                        #                          string.whitespace,
                        #                          em_ws_pg)

                        #         # Remove trailing space inline or?


    def test_people_affected(self):
        """Compare so we get the same sum from both databases."""
        from akvo.rsr.models import Project
        from django.conf import settings

        print('\nTest people affected')

        people_benchmark = getattr(settings, 'AFFECTED_BENCHMARKNAME',
                                   'people affected')

        # Project
        my_projects = Project.objects.using(self.my).all().order_by('id')
        pg_projects = Project.objects.using(self.pg).all().order_by('id')

        my_people = my_projects.get_largest_value_sum(people_benchmark)
        pg_people = pg_projects.get_largest_value_sum(people_benchmark)

        self.assertEqual(my_people, pg_people)

    def test_organisation_account(self):
        """Since organisation accounts don't have id's we need to take special
        care of the collection."""
        from akvo.rsr.models import Organisation, OrganisationAccount

        print('\nTesting organisation account')

        my_orgs = Organisation.objects.using(self.my).all().order_by('id')
        pg_orgs = Organisation.objects.using(self.pg).all().order_by('id')

        self.assertEqual(my_orgs.count(), pg_orgs.count())

        for org in itertools.izip(my_orgs, pg_orgs):
            my_acc = OrganisationAccount.objects.using(self.my).get(
                organisation=org[0])
            pg_acc = OrganisationAccount.objects.using(self.pg).get(
                organisation=org[1])
            self.assertEqual(my_acc.account_level, pg_acc.account_level)

    def test_sessions(self):
        """Since there is no id on collection."""
        from django.contrib.sessions.models import Session

        print('\nTesting sessions')

        sql = 'SELECT * FROM {} ORDER BY session_key DESC'.format(
            Session._meta.db_table)
        self.my_cursor.execute(sql)
        self.pg_cursor.execute(sql)

        for row_set in itertools.izip(self.my_cursor, self.pg_cursor):
            cols = [desc[0] for desc in self.my_cursor.description]
            for column in itertools.izip(cols, row_set[0],
                                         row_set[1]):
                em = 'Session: {} {}'.format(column[1], column[2])
                self.assertEqual(column[1], column[2], msg=em)


if __name__ == '__main__':
    # Setup the Django env
    try:
        sys.path.append('/var/akvo/rsr/code/akvo')
        os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
    except ImportError as error:
        sys.stderr.write('Error: Can not find the \'settings\' module.')
        sys.stderr.write('\nImportError: ' + str(error) + '\n')
        sys.exit(1)

    # Kick of testquite
    unittest.TextTestRunner().run(
        unittest.defaultTestLoader.loadTestsFromTestCase(TestValidate))

    # Exit
    print('\nValidation done\n')
