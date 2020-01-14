# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0029_auto_20150824_1452'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='partnership',
            name='partner_type',
        ),
    ]
