# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0053_auto_20160208_1218'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='status',
            field=akvo.rsr.fields.ValidXMLCharField(default='N', max_length=1, verbose_name='status', db_index=True, choices=[('N', 'new'), ('D', 'draft'), ('P', 'pending approval'), ('R', 'return for revision'), ('A', 'approved')]),
            preserve_default=True,
        ),
    ]
