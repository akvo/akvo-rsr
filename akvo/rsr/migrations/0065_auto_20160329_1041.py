# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0064_auto_20160317_1238'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='is_impact_project',
            field=models.BooleanField(default=True, help_text='Determines whether the results framework is active for this project.', verbose_name='is rsr impact project'),
            preserve_default=True,
        ),
    ]
