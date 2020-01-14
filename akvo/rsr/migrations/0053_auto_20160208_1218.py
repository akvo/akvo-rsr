# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0052_auto_20160201_1556'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicatorperioddata',
            name='period_actual_value',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'', max_length=50, verbose_name='period actual value'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='status',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'D', max_length=1, verbose_name='status', db_index=True, choices=[('D', 'draft'), ('P', 'pending approval'), ('R', 'return for revision'), ('A', 'approved')]),
            preserve_default=True,
        ),
    ]
