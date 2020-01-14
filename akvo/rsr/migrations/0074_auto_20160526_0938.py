# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0073_auto_20160525_1541'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employment',
            name='country',
        ),
        migrations.RenameField(
            model_name='employment',
            old_name='new_country_field',
            new_name='country',
        ),
    ]
