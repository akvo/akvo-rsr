# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def unique_iati_id(apps, schema_editor):
    """
    Make the Project.iati_activity_id field unique for all projects.
    If it is not filled in, set it to None.
    """
    Project = apps.get_model('rsr', 'Project')
    similar_iati_ids = {}

    for project in Project.objects.all():
        if not project.iati_activity_id:
            project.iati_activity_id = None
            project.save(update_fields=['iati_activity_id'])
        else:
            same_iati_id = Project.objects.filter(iati_activity_id=project.iati_activity_id)
            if same_iati_id.count() > 1:
                similar_iati_ids[project.iati_activity_id] = same_iati_id

    for iati_id in similar_iati_ids.keys():
        for count, project in enumerate(similar_iati_ids[iati_id]):
            if count == 0:
                continue
            else:
                project.iati_activity_id = iati_id + ' (%s)' % str(count + 1)
                project.save(update_fields=['iati_activity_id'])


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0032_auto_20151001_0956'),
    ]

    operations = [
        migrations.RunPython(
            unique_iati_id
        ),
    ]
