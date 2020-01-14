# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0018_auto_20150723_0930'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='show_admin_help',
        ),
    ]
