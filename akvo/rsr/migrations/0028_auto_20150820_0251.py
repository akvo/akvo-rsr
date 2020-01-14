# -*- coding: utf-8 -*-


from django.db import migrations

def keywords_from_sponsor_partners(apps, schema_editor):
    Keyword = apps.get_model('rsr', 'Keyword')
    Project = apps.get_model('rsr', 'Project')

    projects = Project.objects.filter(partnerships__partner_type='sponsor')
    for project in projects:
        for sponsor in project.partnerships.filter(partner_type='sponsor'):
            keyword, created = Keyword.objects.get_or_create(
                label="{}:{}".format(
                    sponsor.organisation.id,
                    sponsor.organisation.name,
                )
            )
            project.keywords.add(keyword)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0027_auto_20150820_0144'),
    ]

    operations = [
        migrations.RunPython(
            keywords_from_sponsor_partners
        ),
    ]
