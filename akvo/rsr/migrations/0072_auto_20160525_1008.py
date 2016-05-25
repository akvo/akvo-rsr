# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


# convert old rsr statuses to equivalent iati status codes
# # see http://iatistandard.org/202/codelists/ActivityStatus/
STATUS_TO_CODE = {
    'N': '6',
    'H': '1',
    'A': '2',
    'C': '3',
    'L': '5',
    'R': '6',
}

# update new field with existing values
def populate_iati_status(apps, schema_editor):
    Project = apps.get_model('rsr', 'Project')
    for p in Project.objects.all():
        p.iati_status = STATUS_TO_CODE[p.status]
        p.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0071_auto_20160525_1006'),
    ]

    operations = [
        migrations.RunPython(populate_iati_status),
    ]
