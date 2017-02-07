# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def fix_broken_child_indicator_periods(apps, schema_editor):
    """Fix child indicator periods that cannot find their parent."""

    IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')
    Indicator = apps.get_model('rsr', 'Indicator')

    # Filter for child_periods, which don't have a parent_period.
    values = (
        'id', 'period_start', 'period_end', 'indicator__title', 'indicator__result__parent_result'
    )
    periods = IndicatorPeriod.objects.exclude(indicator__result__parent_result=None)
    deleted_indicators = []
    orphaned_periods = []
    fixable_periods = []
    deletable_periods = []

    for period_values in periods.values(*values):
        period_id = period_values.pop('id')
        period_values['indicator__result'] = period_values.pop('indicator__result__parent_result')
        parent_periods = IndicatorPeriod.objects.filter(**period_values)
        parent_count = parent_periods.count()
        if parent_count == 1:
            continue
        elif parent_count == 0:
            result = period_values['indicator__result']
            title = period_values['indicator__title']
            parent_indicator = Indicator.objects.filter(result=result, title=title).first()
            if parent_indicator is None:
                deleted_indicators.append(period_id)
                # deleted_indicators (orphaned_indicators): 4
                # FIXME: Need to be manually looked at, and fixed.
            elif parent_indicator.periods.count() == 0:
                deletable_periods.append(period_id)
                # deletable_periods: 0
            elif parent_indicator.periods.count() == 1:
                fixable_periods.append(period_id)
                # fixable_periods: 27
                period = IndicatorPeriod.objects.get(id=period_id)
                parent_period = parent_indicator.periods.first()
                period.period_start = parent_period.period_start
                period.period_end = parent_period.period_end
                period.save()
            else:
                orphaned_periods.append(period_id)
                # orphaned_periods: 4
                # FIXME: Need to be manually looked at, and fixed.
        elif parent_count > 1:
            # FIXME: The current code just uses .first() and deals with this.
            # Doesn't seem like the best way of doing this, but doesn't really
            # need a migration here.
            pass

    print len(orphaned_periods), 'orphaned'
    print len(fixable_periods), 'fixable'
    print len(deletable_periods), 'deletable'
    print len(deleted_indicators), 'indicator orphaned'
    raise KeyError


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0088_auto_20161116_1214'),
    ]

    operations = [
        migrations.RunPython(fix_broken_child_indicator_periods, reverse_code=lambda x, y: None),
    ]
