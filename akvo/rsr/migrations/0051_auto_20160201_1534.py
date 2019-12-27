# -*- coding: utf-8 -*-


from django.db import models, migrations


def move_indicator_period_data(apps, schema_editor):
    """
    Move the indicator period data from the ProjectUpdate model to the IndicatorPeriodData model
    and delete the old indicator 'updates'.
    """
    ProjectUpdate = apps.get_model('rsr', 'ProjectUpdate')
    IndicatorPeriodData = apps.get_model('rsr', 'IndicatorPeriodData')

    indicator_updates = ProjectUpdate.objects.exclude(indicator_period=None)
    for update in indicator_updates:
        # Create new indicater period data object
        IndicatorPeriodData.objects.create(
            period=update.indicator_period,
            user=update.user,
            relative_data=True,
            data=str(update.period_update),
            text=update.text,
            photo=update.photo,
            update_method=update.update_method,
            created_at=update.created_at,
            last_modified_at=update.last_modified_at,
        )
    # Delete all (old) indicator 'updates'
    indicator_updates.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0050_auto_20160201_1513'),
    ]

    operations = [
        migrations.RunPython(
            move_indicator_period_data
        ),
    ]
