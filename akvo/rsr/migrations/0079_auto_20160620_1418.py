# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def sector_validation(apps, schema_editor):
    """ Remove sector from RSR validation set """
    ProjectEditorValidation = apps.get_model('rsr', 'ProjectEditorValidation')

    sector_validators = ['rsr_sector', 'rsr_sector.sector_code', 'rsr_sector.vocabulary']

    for v in sector_validators:
        ProjectEditorValidation.objects.filter(validation_set_id=1).get(validation__exact=v).delete()

def undo_sector_validation(apps, schema_editor):
    """ Remove sector from RSR validation set """
    ProjectEditorValidation = apps.get_model('rsr', 'ProjectEditorValidation')

    sector_validators = ['rsr_sector', 'rsr_sector.sector_code', 'rsr_sector.vocabulary']

    for v in sector_validators:
        ProjectEditorValidation(validation=v, action=1, validation_set_id = 1).save()


class Migration(migrations.Migration):

    dependencies = [
        # ('rsr', '0077_auto_20160608_1227'),
        ('rsr', '0078_auto_20160613_1428'),
    ]

    operations = [
        migrations.RunPython(sector_validation, undo_sector_validation),
    ]
