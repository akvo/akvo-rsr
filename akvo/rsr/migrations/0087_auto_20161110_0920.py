# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def fix_employment_groups(apps, schema_editor):
    # We can't import the Employment or Group model directly as it may be a
    # newer version than this migration expects. We use the historical version.
    Group = apps.get_model("auth", "Group")
    Employment = apps.get_model("rsr", "Employment")
    for employment in Employment.objects.filter(group=None):
        employment.group = Group.objects.get(name='Users')
        employment.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0086_auto_20160921_0947'),
    ]

    operations = [
        migrations.RunPython(fix_employment_groups),
    ]
