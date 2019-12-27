# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0136_auto_20180829_1134'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisation',
            name='enable_restrictions',
            field=models.BooleanField(default=False, help_text='Toggle user access restrictions for projects with this organisation as reporting partner. Can be turned off only if all the restricted employees have another employment.', verbose_name='enable restrictions'),
            preserve_default=True,
        ),
    ]
