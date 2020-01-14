# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0011_auto_20150630_0823'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnersite',
            name='show_keyword_logos',
            field=models.BooleanField(default=False, verbose_name='Show keyword logos on project pages'),
            preserve_default=True,
        ),
    ]
