# -*- coding: utf-8 -*-


from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0038_auto_20151008_1257'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='sync_owner',
        ),
        migrations.RemoveField(
            model_name='project',
            name='sync_owner_secondary_reporter',
        ),
        migrations.AddField(
            model_name='project',
            name='primary_organisation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='rsr.Organisation', null=True),
            preserve_default=True,
        ),
    ]
