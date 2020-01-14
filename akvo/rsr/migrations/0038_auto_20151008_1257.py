# -*- coding: utf-8 -*-


from django.db import models, migrations


def add_projects_creators(apps, schema_editor):
    project_creators = [
        8, # Simavi
        42, # Akvo
        43,  # Aqua for All
        273, # Cordaid
        360, # CommonSites
        405,  # ICCO
        415,  # ICRAF Kenya
        428,  # UNDP (2)
        678,  # VEI
        881,  # SNV Kenya
        882,  # Netherlands Embassy Kenya
        912,  # SRHR Alliance
        1060,  # Football for Water
        1297,  # Cordaid Memisa
        1686,  #NWP
        1909,  # Ministry for Foreign Affa
        1977,  # Dutch Foreign Affairs ICE
        1994,  # SNV Mali
        2121,  # GNWP
        2238,  # PIND Foundation
        2382,  # Rutgers WPF
        2555,  # Plan Finland
        2744,  # UNICEF Côte d'Ivoire
        2763,  # Akvo South Asia -Nepal
        2842,  # KNVB
    ]
    Organisation = apps.get_model("rsr", "Organisation")
    for creator_pk in project_creators:
        try:
            org = Organisation.objects.get(pk=creator_pk)
            org.can_create_projects = True
            org.save()
        except Exception as e:
            pass


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0037_auto_20151008_1256'),
    ]

    operations = [
        migrations.RunPython(
            add_projects_creators,
        ),
    ]
