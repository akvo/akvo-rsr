# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-08-10 14:13
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0181_auto_20200810_1250'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='organisation',
            name='enable_restrictions',
        ),
    ]
