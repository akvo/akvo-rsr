# -*- coding: utf-8 -*-


from django.db import migrations


def null_locations(apps, schema_editor):
    ProjectLocation = apps.get_model("rsr", "ProjectLocation")
    OrganisationLocation = apps.get_model("rsr", "OrganisationLocation")
    ProjectUpdateLocation = apps.get_model("rsr", "ProjectUpdateLocation")

    ProjectLocation.objects.filter(location_target=None).delete()
    OrganisationLocation.objects.filter(location_target=None).delete()
    ProjectUpdateLocation.objects.filter(location_target=None).delete()


class Migration(migrations.Migration):

    dependencies = [
            ('rsr', '0014_auto_20150803_1017'),
    ]

    operations = [
        migrations.RunPython(
            null_locations,
        ),
    ]
