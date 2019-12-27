# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0055_auto_20160218_1027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='relative_data',
            field=models.BooleanField(default=True, verbose_name='relative data'),
            preserve_default=True,
        ),
    ]
