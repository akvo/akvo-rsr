#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.

This scripts alters the postgres database after errors have been found
running the test suit.
"""

from __future__ import print_function
import sys
import os

from django.db import connections


def alter_paypal_ipn_ipaddress():
    """
    -> IPAddressField
    Ipaddress fields should have pg inet type, varchar was used. Since
    postgres didn't like to convert directly to inet we have to
    dance by text"""
    print('\tAbout to alter paypal_ipn ipaddress')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE paypal_ipn ALTER COLUMN ipaddress TYPE text; '
           'ALTER TABLE paypal_ipn ALTER COLUMN ipaddress '
           'TYPE inet USING ipaddress::inet;')
    cursor.execute(sql)
    print('\tDid alter paypal_ipn ipaddress')


def alter_invoice_amount():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter rsr_invoice amount')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE rsr_invoice ALTER COLUMN amount TYPE integer; '
           'ALTER TABLE rsr_invoice '
           'ADD CONSTRAINT amountchk CHECK (amount >= 0);')
    cursor.execute(sql)
    print('\tDid alter rsr_invoice amount')


def alter_invoice_status():
    """
    -> PositiveSmallIntegerField
    """
    print('\tAbout to alter rsr_invoice status')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE rsr_invoice ALTER COLUMN status TYPE smallint; '
           'ALTER TABLE rsr_invoice '
           'ADD CONSTRAINT statuschk CHECK (status >= 0);')
    cursor.execute(sql)
    print('\tDid alter rsr_invoice status')


def alter_rsr_projectlocation_administrative_level():
    """
    -> PositiveSmallIntegerField
    """
    print('\tAbout to alter rsr_projectlocation administrative_level')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE rsr_projectlocation '
           'ALTER COLUMN administrative_level TYPE smallint; '
           'ALTER TABLE rsr_projectlocation '
           'ADD CONSTRAINT administrative_levelchk '
           'CHECK (administrative_level >= 0);')
    cursor.execute(sql)
    print('\tDid alter rsr_projectlocation administrative_level')


def alter_rsr_project_hierarchy():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter rsr_project hierarchy')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE rsr_project ALTER COLUMN hierarchy TYPE integer; '
           'ALTER TABLE rsr_project '
           'ADD CONSTRAINT hierarchychk CHECK (hierarchy >= 0);')
    cursor.execute(sql)
    print('\tDid alter rsr_project hierarchy')


def alter_rsr_indicator_baseline_year():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter rsr_indicator baseline_year')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE rsr_indicator '
           'ALTER COLUMN baseline_year TYPE integer; '
           'ALTER TABLE rsr_indicator '
           'ADD CONSTRAINT baseline_yearchk CHECK (baseline_year >= 0);')
    cursor.execute(sql)
    print('\tDid alter rsr_indicator baseline_year')


def alter_django_counter_redircounter_count():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter django_counter_redircounter count')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE django_counter_redircounter '
           'ALTER COLUMN count TYPE integer; '
           'ALTER TABLE django_counter_redircounter '
           'ADD CONSTRAINT countchk CHECK (count >= 0);')
    cursor.execute(sql)
    print('\tDid alter django_counter_redircounter count')


def alter_rsr_partnersite_piwik_id():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter rsr_partnersite piwik_id')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE rsr_partnersite ALTER COLUMN piwik_id TYPE integer; '
           'ALTER TABLE rsr_partnersite '
           'ADD CONSTRAINT piwik_idchk CHECK (piwik_id >= 0);')
    cursor.execute(sql)
    print('\tDid alter rsr_partnersite piwik_id')


def alter_django_counter_referer_count():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter django_counter_referer count')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE django_counter_referer '
           'ALTER COLUMN count TYPE integer; '
           'ALTER TABLE django_counter_referer '
           'ADD CONSTRAINT countchk CHECK (count >= 0);')
    cursor.execute(sql)
    print('\tDid alter django_counter_referer count')


def alter_django_admin_log_action_flag():
    """
    -> PositiveSmallIntegerField
    """
    print('\tAbout to alter django_admin_log status')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE django_admin_log '
           'ALTER COLUMN action_flag TYPE smallint; '
           'ALTER TABLE django_admin_log '
           'ADD CONSTRAINT action_flag_chk CHECK (action_flag >= 0);')
    cursor.execute(sql)
    print('\tDid alter django_admin_log status')


def alter_django_counter_viewcounter_object_id():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter django_counter_viewcounter object_id')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE django_counter_viewcounter '
           'ALTER COLUMN object_id TYPE integer; '
           'ALTER TABLE django_counter_viewcounter '
           'ADD CONSTRAINT object_idchk CHECK (object_id >= 0);')
    cursor.execute(sql)
    print('\tDid alter django_counter_viewcounter object_id')


def alter_django_counter_viewcounter_count():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter django_counter_viewcounter count')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE django_counter_viewcounter '
           'ALTER COLUMN count TYPE integer; '
           'ALTER TABLE django_counter_viewcounter '
           'ADD CONSTRAINT countchk CHECK (count >= 0);')
    cursor.execute(sql)
    print('\tDid alter django_counter_viewcounter count')


def alter_tastypie_apiaccess_accessed():
    """
    -> PositiveIntegerField
    """
    print('\tAbout to alter tastypie_apiaccess count')
    cursor = connections["default"].cursor()
    sql = ('ALTER TABLE tastypie_apiaccess '
           'ALTER COLUMN accessed TYPE integer; '
           'ALTER TABLE tastypie_apiaccess '
           'ADD CONSTRAINT accessedchk CHECK (accessed >= 0);')
    cursor.execute(sql)
    print('\tDid alter tastypie_apiaccess accessed')


def alt():
    alter_paypal_ipn_ipaddress()
    alter_invoice_amount()
    alter_invoice_status()
    alter_rsr_projectlocation_administrative_level()
    alter_rsr_project_hierarchy()
    alter_rsr_indicator_baseline_year()
    alter_django_counter_redircounter_count()
    alter_rsr_partnersite_piwik_id()
    alter_django_counter_referer_count()
    alter_django_admin_log_action_flag()
    alter_django_counter_viewcounter_object_id()
    alter_django_counter_viewcounter_count()
    alter_tastypie_apiaccess_accessed()

if __name__ == '__main__':
    # Setup the Django env
    try:
        sys.path.append('/var/akvo/rsr/code/akvo')
        os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
    except ImportError as error:
        sys.stderr.write('Error: Can not find the \'settings\' module.')
        sys.stderr.write('\nImportError: ' + str(error) + '\n')
        sys.exit(1)

    print('\nAbout to alter\n')
    alt()
    print('\nFinished\n')
