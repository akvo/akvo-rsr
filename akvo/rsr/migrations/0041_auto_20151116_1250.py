# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0040_auto_20151111_1300'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sector',
            options={'ordering': ['sector_code'], 'verbose_name': 'sector', 'verbose_name_plural': 'sectors'},
        ),
        migrations.AddField(
            model_name='project',
            name='is_public',
            field=models.BooleanField(default=True, help_text='Determines whether this project is a public project.', verbose_name='is public project'),
            preserve_default=True,
        ),
    ]
