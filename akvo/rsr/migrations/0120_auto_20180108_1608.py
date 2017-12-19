# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from decimal import Decimal, InvalidOperation
from django.db import models, migrations

RSR_SYSTEM_USER = {
    'email': u'admin@akvo.org',
    'is_admin': True,
    'is_superuser': True,
    'first_name': 'RSR System',
    'last_name':  'User',
    'is_active': True,
}




class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0119_auto_20180104_1310'),
    ]

    def migrate_non_numeric_values(apps, schema_editor):
        IndicatorPeriodData = apps.get_model('rsr', 'IndicatorPeriodData')
        IndicatorPeriodDataComment = apps.get_model('rsr', 'IndicatorPeriodDataComment')
        User = apps.get_model('rsr', 'User')

        print
        print(u"Project ID\tProject title\tResult ID\tResult title\tIndicator ID\tIndicator title\t"
              u"Period ID\tPeriod dates\tUpdate ID\tUpdate value")

        updates = IndicatorPeriodData.objects.all()
        migrated_update_count = 0
        for update in updates:
            try:
                if not (update.value is None or update.value == ''):
                    update.new_value = Decimal(update.value)
                else:
                    update.new_value = None
                update.save()
            except InvalidOperation:
                project = update.period.indicator.result.project
                result = update.period.indicator.result
                indicator = update.period.indicator
                period = update.period
                print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    period.id, u"{} - {}".format(period.period_start, period.period_end),
                    update.id, update.value).encode('utf-8')
                )
                rsr_system_user = User.objects.get(email=RSR_SYSTEM_USER['email'].encode('utf-8'))
                comment = u'This update previously had a non-numeric value of "{}"'.format(
                    update.value)
                IndicatorPeriodDataComment.objects.create(
                    user=rsr_system_user,
                    data=update,
                    comment=comment,
                )
                update.new_value = None
                update.save()
                migrated_update_count += 1

        print("Migrated {} update values\n\n".format(migrated_update_count))
        print("*"*50)
        print
        print(u"Project ID\tProject title\tResult ID\tResult title\tIndicator ID\tIndicator title\t"
              u"Period ID\tPeriod dates\tTarget value")

        IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')
        periods = IndicatorPeriod.objects.all()
        migrated_target_count = 0
        for period in periods:
            try:
                if not (period.target_value is None or period.target_value == ''):
                    period.new_target_value = Decimal(period.target_value)
                else:
                    period.new_target_value = None
                period.save()
            except InvalidOperation:
                project = period.indicator.result.project
                result = period.indicator.result
                indicator = period.indicator
                print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    period.id, u"{} - {}".format(period.period_start, period.period_end),
                    period.target_value).encode('utf-8')
                )
                comment = u'This period previously had a non-numeric target_value of "{}"'.format(
                    period.target_value)
                if period.target_comment:
                    comment = "\n{}".format(comment)
                period.target_comment += comment
                period.new_target_value = None
                period.save()
                migrated_target_count += 1

        print("Migrated {} period target values\n\n".format(migrated_target_count))

        Indicator = apps.get_model('rsr', 'Indicator')
        indicators = Indicator.objects.all()
        migrated_baseline_count = 0

        print("*"*50)
        print
        print(u"Project ID\tProject title\tResult ID\tResult title\tIndicator ID\tIndicator title\t"
              u"Baseline value")
        for indicator in indicators:
            try:
                if not (indicator.baseline_value is None or indicator.baseline_value == ''):
                    indicator.new_baseline_value = Decimal(indicator.baseline_value)
                else:
                    indicator.new_baseline_value = None
                indicator.save()
            except InvalidOperation:
                project = indicator.result.project
                result = indicator.result
                print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    indicator.baseline_value).encode('utf-8')
                )
                comment = u'This indicator previously had a non-numeric baseline_value of "{}"'.format(
                    indicator.baseline_value)
                if indicator.baseline_comment:
                    comment = "\n{}".format(comment)
                indicator.baseline_comment += comment
                indicator.new_baseline_value = None
                indicator.save()
                migrated_baseline_count += 1

        print("Migrated {} indicator baseline values\n\n".format(migrated_baseline_count))

    operations = [
        migrations.CreateModel(
            name='PeriodActualValue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.IntegerField()),
            ],
            options={
                'db_table': 'rsr_indicator_period_actual_value',
                'managed': False,
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='indicatorperiod',
            name='actual_comment',
        ),
        migrations.RemoveField(
            model_name='indicatorperiod',
            name='actual_value',
        ),
        migrations.AddField(
            model_name='indicator',
            name='new_baseline_value',
            field=models.DecimalField(
                decimal_places=2, max_digits=20,
                blank=True, null=True,
                help_text='The value of the baseline at the start of the project.',
                verbose_name='baseline value'
            ),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperiod',
            name='new_target_value',
            field=models.DecimalField(
                decimal_places=2, max_digits=20,
                blank=True, null=True,
                help_text='The target value for the above period.',
                verbose_name='target value'
            ),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperioddata',
            name='new_value',
            field=models.DecimalField(
                decimal_places=2, max_digits=20,
                blank=True, null=True,
                verbose_name='quantitative indicator value'
            ),
            preserve_default=True,
        ),
        migrations.RunPython(
            migrate_non_numeric_values,
            reverse_code=lambda x, y: None,
        ),

    ]
