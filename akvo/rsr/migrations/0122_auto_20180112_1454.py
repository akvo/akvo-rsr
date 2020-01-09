# -*- coding: utf-8 -*-


from django.db import models, migrations
import datetime


def set_event_date(apps, schema_editor):
    ProjectUpdate = apps.get_model('rsr', 'ProjectUpdate')
    ProjectUpdate.objects.all().update(event_date=models.F('created_at'))


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0121_auto_20180108_1610'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='projectupdate',
            options={'ordering': ['-event_date', '-id'], 'get_latest_by': 'event_date', 'verbose_name': 'project update', 'verbose_name_plural': 'project updates'},
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='event_date',
            field=models.DateField(default=datetime.date.today, help_text='The date of the corresponding event', db_index=True, verbose_name='event date', blank=True),
            preserve_default=True,
        ),
        migrations.RunPython(set_event_date, lambda x, y: None),
    ]
