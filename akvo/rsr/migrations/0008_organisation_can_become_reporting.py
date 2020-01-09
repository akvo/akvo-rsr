# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0007_auto_20150512_1320'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisation',
            name='can_become_reporting',
            field=models.BooleanField(default=False, help_text='Only to be edited by superusers.', verbose_name='Organisation is allowed to become a reporting organisation.'),
            preserve_default=True,
        ),
    ]
