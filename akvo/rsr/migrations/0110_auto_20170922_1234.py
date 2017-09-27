# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import akvo.rsr.fields


def update_status_new_to_draft(apps, schema):
    IndicatorPeriodData = apps.get_model('rsr', 'IndicatorPeriodData')
    IndicatorPeriodData.objects.filter(status='N').update(status='D')


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0109_auto_20170911_1039'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicatorlabel',
            name='label',
            field=models.ForeignKey(related_name='indicators', on_delete=django.db.models.deletion.PROTECT, verbose_name='label', to='rsr.OrganisationIndicatorLabel', help_text='Thematic labels allow you to \u2018tag\u2019 your indicator by choosing from a pre-defined set of thematic program areas (e.g. Improved Business Environment) so that all similarly tagged indicators can be grouped together when creating a custom RSR report. An indicator can have more than one thematic label.'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='status',
            field=akvo.rsr.fields.ValidXMLCharField(default='D', max_length=1, verbose_name='status', db_index=True, choices=[('D', 'draft'), ('P', 'pending approval'), ('R', 'return for revision'), ('A', 'approved')]),
            preserve_default=True,
        ),
        migrations.RunPython(update_status_new_to_draft,
                             reverse_code=lambda x, y: None)
    ]
