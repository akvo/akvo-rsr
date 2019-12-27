# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0135_organisation_include_restricted'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='organisation',
            name='include_restricted',
        ),
        migrations.AddField(
            model_name='organisation',
            name='enable_restrictions',
            field=models.BooleanField(default=False, help_text='Toggle user access restrictions for projects with this organisation as reporting partner', verbose_name='enable restrictions'),
            preserve_default=True,
        ),
    ]
