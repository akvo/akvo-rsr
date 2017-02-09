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
            period = IndicatorPeriod.objects.get(id=period_id)
            if parent_indicator is None:
                print 'Orphaned Indicator'
                pprint_period_lineage(period)

            elif parent_indicator.periods.count() == 0:
                period.delete()

            elif parent_indicator.periods.count() == 1:
                parent_period = parent_indicator.periods.first()
                period.period_start = parent_period.period_start
                period.period_end = parent_period.period_end
                period.save()
                # Fix additional missing data by saving the parent
                parent_period.save()
                print 'Fixed period'
                pprint_period_lineage(period)
                if period.indicator.periods.count() != parent_period.indicator.periods.count():
                    print 'No. of periods mismatch with parent :: '
                    pprint_period_lineage(parent_period)

            else:
                print 'Orphaned Period'
                pprint_period_lineage(period)

        elif parent_count > 1:
            # FIXME: The current code just uses .first() and deals with this.
            # Doesn't seem like the best way of doing this, but doesn't really
            # need a migration here.
            pass


def pprint_period_lineage(period):
    indicator = period.indicator
    result = indicator.result
    project = result.project
    print u'{} > {} > {} > {}--{}'.format(
        project.title, result.title, indicator.title, period.period_start, period.period_end
    )
    print u'{} > {} > {} > {}'.format(project.id, result.id, indicator.id, period.id)
    print u'#' * 20


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0088_auto_20161116_1214'),
    ]

    operations = [
        migrations.RunPython(fix_broken_child_indicator_periods, reverse_code=lambda x, y: None),
    ]
