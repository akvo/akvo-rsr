# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0054_auto_20160214_1249'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='employment',
            unique_together=set([('organisation', 'user', 'group')]),
        ),
    ]
