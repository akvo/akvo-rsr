# -*- coding: utf-8 -*-


from django.db import models, migrations

from ..models.project import Project

def add_primary_organisations(apps, schema_editor):
    Project = apps.get_model("rsr", "Project")

    for project in Project.objects.all():
        primary_organisation = None

        # Pick the partner that can publish the project first
        if project.partners.filter(can_create_projects=True):
            primary_organisation = project.partners.filter(can_create_projects=True)[0]

        # Otherwise, if we have a reporting-org then we choose that
        elif project.partnerships.filter(iati_organisation_role=101):
            primary_organisation = project.partnerships.filter(
                iati_organisation_role=101)[0].organisation

        # Otherwise, grab the first accountable partner we find
        elif project.partnerships.filter(iati_organisation_role=2):
            primary_organisation = project.partnerships.filter(
                iati_organisation_role=2)[0].organisation

        # Panic mode: grab the first partner we find
        elif project.partners.all():
            primary_organisation = project.partners.all()[0]

        project.primary_organisation = primary_organisation
        project.save(update_fields=['primary_organisation'])


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0039_auto_20151111_1246'),
    ]

    operations = [
        migrations.RunPython(
            add_primary_organisations,
        ),
    ]
