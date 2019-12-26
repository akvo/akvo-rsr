# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from akvo.codelists.store import codelists_v202

from django.db import models, migrations


def add_v202_codelists(apps, schema_editor):
    """
    Load the IATI v2.02 codelists in the database.
    """
    # Add new version first
    Version = apps.get_model('codelists', 'Version')
    v202, created = Version.objects.get_or_create(code='2.02', url='http://iatistandard.org/202/')

    # Add all new codelists, linked to the v2.02 version
    for codelist in codelists_v202.codelist_list:
        if codelist != 'VERSION':
            codelist_tuples = getattr(codelists_v202, codelist, None)
            if codelist_tuples is not None:
                codelist_fields = codelist_tuples[0]
                for codelist_entry in codelist_tuples[1:]:
                    codelist_dict = {}
                    codelist_dict['version'] = v202
                    for index, field in enumerate(codelist_fields):
                        codelist_dict[field] = codelist_entry[index]
                    Model = apps.get_model('codelists', codelist.replace('_', ''))
                    Model.objects.get_or_create(**codelist_dict)


class Migration(migrations.Migration):

    dependencies = [
        ('codelists', '0002_auto_20160226_1207'),
    ]

    operations = [
        migrations.RunPython(
            add_v202_codelists
        ),
    ]
