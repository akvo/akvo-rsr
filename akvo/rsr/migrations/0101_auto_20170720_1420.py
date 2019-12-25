# -*- coding: utf-8 -*-
from __future__ import unicode_literals, print_function

from django.db import models, migrations


def empty_update(update):
    is_empty = (
        not update.text
        and (not update.data or update.data == '0')
        and not update.file and not update.photo
        and update.comments.count() == 0
    )
    return is_empty


def print_period_info(period):
    indicator = period.indicator
    result = indicator.result
    project = result.project
    print(project.title.encode('utf8'), project.id)
    print(result.title.encode('utf8'), result.id)
    print(indicator.title.encode('utf8'), indicator.id)
    print('-' * 40)


def clean_value(value):
    return value.strip('%').replace(',', '.').strip()


def populate_ratios_in_percentage_indicators(apps, schema_editor):
    """Add numerator and denominator to percentage indicators.

    To fix the aggregation and other computations for percentage indicators,
    numerator and denominator fields were added to IndicatorPeriod and
    IndicatorPeriodData models. This migration uses the percentage values of
    existing indicators, and populates the numerator and denominator value to
    keep the same percentage value. This works around the need for introducing
    a new percentage type, and carrying the baggage of the old one, forever.

    """

    IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')
    annotated_periods = IndicatorPeriod.objects.annotate(
        update_count=models.Count('data')
    )
    multiple_update_periods = annotated_periods.filter(
        indicator__measure='2', update_count__gt=1
    )
    for period in multiple_update_periods:
        for update in period.data.all():
            if empty_update(update):
                update.delete()

    multiple_update_periods = annotated_periods.filter(
        indicator__measure='2', update_count__gt=1
    )
    for period in multiple_update_periods:
        print('Manual merge of updates required: {}'.format(period.id))
        print_period_info(period)

    no_update_periods = annotated_periods.filter(
        indicator__measure='2', update_count=0
    )
    for period in no_update_periods:
        actual_value = clean_value(period.actual_value)
        if not actual_value:
            continue

        try:
            numerator = float(actual_value)
            denominator = 100
        except ValueError as e:
            print("Couldn't fix period: {} - {}".format(period.id, e))
            print_period_info(period)
        else:
            period.numerator = numerator
            period.denominator = denominator
            period.save()

    single_update_periods = annotated_periods.filter(
        indicator__measure='2', update_count=1
    )
    for period in single_update_periods:
        update = period.data.first()
        actual_value = clean_value(update.data)
        if not actual_value:
            continue

        try:
            numerator = float(actual_value)
            denominator = 100
        except ValueError as e:
            print("Couldn't fix period: {} - {}".format(period.id, e))
            print_period_info(period)
        else:
            update.numerator = numerator
            update.denominator = denominator
            update.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0100_auto_20170531_1047'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicatorperiod',
            name='denominator',
            field=models.DecimalField(decimal_places=2, max_digits=20, blank=True, help_text='The denominator for a calculated percentage', null=True, verbose_name='denominator for indicator'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperiod',
            name='numerator',
            field=models.DecimalField(decimal_places=2, max_digits=20, blank=True, help_text='The numerator for a calculated percentage', null=True, verbose_name='numerator for indicator'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperioddata',
            name='denominator',
            field=models.DecimalField(decimal_places=2, max_digits=20, blank=True, help_text='The denominator for a calculated percentage', null=True, verbose_name='denominator for indicator'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperioddata',
            name='numerator',
            field=models.DecimalField(decimal_places=2, max_digits=20, blank=True, help_text='The numerator for a calculated percentage', null=True, verbose_name='numerator for indicator'),
            preserve_default=True,
        ),
        migrations.RunPython(
            populate_ratios_in_percentage_indicators,
            reverse_code=lambda x, y: None,
        ),
    ]
