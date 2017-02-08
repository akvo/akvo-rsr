# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def indicator_links(apps, schema_editor):
    """ Migration generating foreign keys from indicators and indicator periods in child results
    frameworks to parents of the same object type in the parent results framework
    """
    Result = apps.get_model('rsr', 'Result')
    Indicator = apps.get_model('rsr', 'Indicator')
    IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')

    for result in Result.objects.all():
        child_results = result.child_results.all()
        # Find all indicators for the current Result
        parent_indicators = Indicator.objects.filter(result=result)
        for parent_indicator in parent_indicators:
            # Child indicators have the same title etc and the parent indicator, and a result that's
            # a child of the current result
            child_indicators = Indicator.objects.filter(
                result__in=child_results,
                title=parent_indicator.title,
                measure=parent_indicator.measure,
                ascending=parent_indicator.ascending
            )
            #  Set FK in child indicators to parent indicator
            for child_indicator in child_indicators:
                child_indicator.parent_indicator = parent_indicator
                # basic saving only
                super(Indicator, child_indicator).save()

        #  Same pattern applies to IndicatorPeriods
        parent_periods = IndicatorPeriod.objects.filter(indicator__result=result)
        for parent_period in parent_periods:
            child_periods = IndicatorPeriod.objects.filter(
                indicator__result__in=child_results,
                indicator__title=parent_period.indicator.title,
                period_start=parent_period.period_start,
                period_end=parent_period.period_end
            )
            for child_period in child_periods:
                child_period.parent_period = parent_period
                super(IndicatorPeriod, child_period).save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0090_auto_20170207_2235'),
    ]

    operations = [
        migrations.RunPython(indicator_links),
    ]
