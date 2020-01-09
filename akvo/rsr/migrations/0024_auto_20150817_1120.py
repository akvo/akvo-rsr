# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0023_auto_20150821_1145'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='organisation',
            name='partner_types',
        ),
        migrations.DeleteModel(
            name='PartnerType',
        ),
    ]
