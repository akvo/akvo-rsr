# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function

from django.db import models, migrations
from django.contrib.admin.models import LogEntry, DELETION

APPROVED_CODE = 'A'

RSR_SYSTEM_USER = {
    'email': 'admin@akvo.org',
    'is_admin': True,
    'is_superuser': True,
    'first_name': 'RSR System',
    'last_name':  'User',
    'is_active': True,
}

COMMENT = """This is an RSR system generated update, created by a database migration. The
period for this update was modified directly to set actual value and/or actual
comment, which is no longer allowed. The data has been migrated to a
system-generated update."""


def create_rsr_system_user(apps, schema_editor):
    User = apps.get_model('rsr', 'User')
    info = dict(RSR_SYSTEM_USER)
    email = info.pop('email')
    User.objects.get_or_create(email=email, defaults=info)


def delete_rsr_system_user(apps, schema_editor):
    User = apps.get_model('rsr', 'User')
    User.objects.get(email=RSR_SYSTEM_USER['email']).delete()


def create_update_from_actual_value_and_comment(apps, schema_editor):
    """ Create an update for periods that were directly modified."""

    IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')
    IndicatorPeriodData = apps.get_model('rsr', 'IndicatorPeriodData')
    IndicatorPeriodDataComment = apps.get_model('rsr', 'IndicatorPeriodDataComment')
    User = apps.get_model('rsr', 'User')
    rsr_system_user = User.objects.get(email=RSR_SYSTEM_USER['email'])

    def create_update(period_id, value, comment, user_id, timestamp):
        data = IndicatorPeriodData.objects.create(
            period_id=period_id,
            value=value,
            text=comment,
            user_id=user_id,
            status=APPROVED_CODE
        )
        # HACK: use QuerySet.update() to modify the "unmodifiable" timestamp fields
        if timestamp:
            IndicatorPeriodData.objects.filter(period_id=period_id).update(
                created_at=timestamp, last_modified_at=timestamp
            )
        IndicatorPeriodDataComment.objects.create(
            user_id=user_id,
            data=data,
            comment=COMMENT,
        )

    # Filter for periods with either actual_value or actual_comment
    exclude_filter = (
        (models.Q(actual_value=None) | models.Q(actual_value=''))
        & (models.Q(actual_comment=None) | models.Q(actual_comment=''))
    )

    periods = IndicatorPeriod.objects.annotate(updates=models.Count('data'))\
                                     .filter(updates=0)\
                                     .annotate(children=models.Count('child_periods'))\
                                     .filter(children=0)\
                                     .exclude(exclude_filter)\
                                     .values_list(
                                         'id',
                                         'indicator_id',
                                         'indicator__result__id',
                                         'indicator__result__project__id',
                                         'actual_value',
                                         'actual_comment',
                                     )

    user_not_found = []
    for values in periods:
        ids = values[:4]
        user_id, timestamp = get_last_modified_user_id(ids)
        if user_id is None:
            user_not_found.append(ids)
            user_id = rsr_system_user.id

        period_id = ids[0]
        value, comment = values[4:]
        create_update(period_id, value, comment, user_id, timestamp)

    print('Actual user not identified for the following periods (using RSR System user as proxy):')
    for ids in user_not_found:
        print('Period: {}, Indicator: {}, Result: {}, Project: {}'.format(*ids))


def get_last_modified_user_id(ids):
    models = ('indicatorperiod', 'indicator', 'result', 'project')
    for id_, model in zip(ids, models):
        log_entries = LogEntry.objects\
                              .filter(content_type__model=model, object_id=id_)\
                              .exclude(action_flag=DELETION)\
                              .values_list('user_id', 'action_time')

        count = len(log_entries)
        if count > 0:
            user_id = log_entries[0][0]
            # Use the action_time field to set the created_at and last_modified_at fields in the
            # IndicatorPeriodData object we create later. This is probably the best estimate of
            # when the value was created/added
            timestamp = log_entries[0][1]
            break
        else:
            user_id = None
            timestamp = None
    return user_id, timestamp


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0108_auto_20170915_0902'),
    ]

    operations = [
        migrations.RunPython(create_rsr_system_user,
                             reverse_code=delete_rsr_system_user),
        migrations.RunPython(create_update_from_actual_value_and_comment,
                             reverse_code=lambda x, y: None),
    ]
