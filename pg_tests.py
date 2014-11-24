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

import itertools
import os
import re
import sys
import unittest

from django.db import connections

reload(sys)
sys.setdefaultencoding("utf-8")

DATABASE_NAME_MY = 'mysql'
DATABASE_NAME_PG = 'default'


def is_float_equal(x, y):
    if abs(x - y) < 0.000000001:
        return True
    return False


def pgDataType(field_type):
    """
    With the help of a Django field type, dig out the postgres counterpart.
    We also make sure to only return the column type description before (
    or empty space. So we exclude the legnth of fields!
    """
    pg_data_types = {
        'AutoField':         'serial',
        'BinaryField':       'bytea',
        'BooleanField':      'boolean',
        'CharField':         'varchar(%(max_length)s)',
        'CommaSeparatedIntegerField': 'varchar(%(max_length)s)',
        'DateField':         'date',
        'DateTimeField':     'timestamp with time zone',
        'DecimalField':      'numeric(%(max_digits)s, %(decimal_places)s)',
        'FileField':         'varchar(%(max_length)s)',
        'FilePathField':     'varchar(%(max_length)s)',
        'FloatField':        'double precision',
        'IntegerField':      'integer',
        'BigIntegerField':   'bigint',
        'IPAddressField':    'inet',
        'GenericIPAddressField': 'inet',
        'NullBooleanField':  'boolean',
        'OneToOneField':     'integer',
        'PositiveIntegerField': 'integer CHECK ("%(column)s" >= 0)',
        'PositiveSmallIntegerField': 'smallint CHECK ("%(column)s" >= 0)',
        'SlugField':         'varchar(%(max_length)s)',
        'SmallIntegerField': 'smallint',
        'TextField':         'text',
        'TimeField':         'time',
    }
    # Since some of the things in that table is aliases we need to dig
    # out the "proper" type on some field types
    # http://www.postgresql.org/docs/9.3/static/
    # datatype-numeric.html#DATATYPE-SERIAL
    if field_type in [unicode('AutoField'), unicode('PositiveIntegerField')]:
        return 'int4'
    elif field_type == unicode('PositiveSmallIntegerField'):
        return 'int2'
    elif field_type == unicode('IntegerField'):
        return 'int4'
    elif field_type == unicode('FloatField'):
        return 'float8'
    elif field_type in [unicode('BooleanField'), unicode('NullBooleanField')]:
        return 'bool'

    return re.split(r'[( ]', pg_data_types[field_type])[0]


def qualname(obj):
    return '{}.{}'.format(obj.__module__,
                          obj.__name__)


def getFieldType(field):
    if not isinstance(field, RelatedObject):
        return field.get_internal_type()
    else:
        return None


def modelFields():
    """
    Return a dict with  {}
    """
    models = dict()
    for model in get_models():
        qn = qualname(model)
        model_fields = list()

        for field in model._meta.fields:
            model_fields.append({'name': field.name,
                                 'pk': field.primary_key,
                                 'type': getFieldType(field)})
        models[qn] = {'model': qn,
                      'class': model.__name__,
                      'module': model.__module__,
                      'app_label': model._meta.app_label,
                      'db_table': model._meta.db_table,
                      'model_fields': model_fields}
    return models


def dbColumns(models):
    """
    To the models append db column meta data from the database.
    """
    for model in get_models():
        qn = qualname(model)
        table_name = model._meta.db_table
        sql = ('SELECT column_name,  udt_name '
               'FROM information_schema."columns" '
               'WHERE "table_name"=\'{}\';'.format(table_name))
        cursor = connections[DATABASE_NAME_PG].cursor()
        cursor.execute(sql)
        models[qn]['cols'] = {}
        for column in cursor.fetchall():
            models[qn]['cols'][column[0]] = column[1]

    return models


class TestSchema(unittest.TestCase):
    """
    Tests the schema integrity in relation to the Django models.
    """

    def testSchema(self):
        """
        """
        print('Testing schema')
        world = dbColumns(modelFields())
        for model in world:
            print('{}'.format(model))
            for field in world[model]['model_fields']:
                if not field['type'] in ['ForeignKey', 'OneToOneField']:
                    field_name = unicode(field['name'])
                    column_type = world[model]['cols'][field_name]
                    em = '{}; {}; {}; {}'.format(model,
                                                 world[model]['db_table'],
                                                 field, column_type)

                    self.assertEqual(pgDataType(field['type']),
                                     column_type, em)


class TestValues(unittest.TestCase):
    """
    Test equality between databases.
    """

    def setUp(self):
        self.my = DATABASE_NAME_MY
        self.pg = DATABASE_NAME_PG

        self.my_cursor = connections[DATABASE_NAME_MY].cursor()
        self.pg_cursor = connections[DATABASE_NAME_PG].cursor()

    def test_compare_values(self):
        print('Compare values:')

        for model in get_models():
            print('\t{}'.format(qualname(model)))

            sql = 'SELECT * FROM {} ORDER BY 1'.format(model._meta.db_table)
            self.my_cursor.execute(sql)
            self.pg_cursor.execute(sql)

            # zip two db rows
            for row_set in itertools.izip(self.my_cursor, self.pg_cursor):
                # Grab column names
                col_headers = [desc[0] for desc in self.my_cursor.description]

                # zip header, mysql & postgres column
                for column in itertools.izip(col_headers,
                                             row_set[0], row_set[1]):
                    header = column[0]
                    my_val = column[1]
                    pg_val = column[2]
                    em = '{} - {} - {} - {}\n{}'.format(model, header, my_val,
                                                        pg_val, sql)

                    # At two different moments is the river the same?
                    if header in ['latitude', 'longitude']:
                        self.assertEqual(is_float_equal(my_val, pg_val),
                                         True, em)
                    else:
                        self.assertEqual(my_val, pg_val, em)

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

    # Since we can't import get_models before settings exists
    from django.db.models import get_models
    from django.db.models.related import RelatedObject

    # Kick of test suite
    unittest.TextTestRunner().run(
        unittest.defaultTestLoader.loadTestsFromTestCase(TestSchema))
    unittest.TextTestRunner().run(
        unittest.defaultTestLoader.loadTestsFromTestCase(TestValues))

    # Exit
    print('\nValidation done\n')
