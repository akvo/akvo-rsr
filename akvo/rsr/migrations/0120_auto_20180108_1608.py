# -*- coding: utf-8 -*-


from decimal import Decimal, InvalidOperation
from django.db import models, migrations

RSR_SYSTEM_USER = {
    'email': 'admin@akvo.org',
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

        print()
        print("Project ID\tProject title\tResult ID\tResult title\tIndicator ID\tIndicator title\t"
              "Period ID\tPeriod dates\tUpdate ID\tUpdate value")

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
                print("{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    period.id, "{} - {}".format(period.period_start, period.period_end),
                    update.id, update.value).encode('utf-8')
                )
                rsr_system_user = User.objects.get(email=RSR_SYSTEM_USER['email'].encode('utf-8'))
                comment = 'This update previously had a non-numeric value of "{}"'.format(
                    update.value)
                IndicatorPeriodDataComment.objects.create(
                    user=rsr_system_user,
                    data=update,
                    comment=comment,
                )
                update.new_value = None
                update.save()
                migrated_update_count += 1

        print("Moved {} non-numeric update values\n\n".format(migrated_update_count))

    operations = [
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
