# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def add_language_to_validations(apps, schema_editor):
    """
    Add the language field as a mandatory field for the IATI validation sets.
    """
    ProjectEditorValidationSet = apps.get_model('rsr', 'ProjectEditorValidationSet')
    ProjectEditorValidation = apps.get_model('rsr', 'ProjectEditorValidation')

    for validation_set in ProjectEditorValidationSet.objects.filter(name__icontains="iati"):
        ProjectEditorValidation.objects.get_or_create(
            validation_set=validation_set,
            validation='rsr_project.language',
            action=1,
        )


def remove_language_from_validations(apps, schema_editor):
    """
    Remove the language field as a mandatory field from the IATI validation sets.
    """
    ProjectEditorValidationSet = apps.get_model('rsr', 'ProjectEditorValidationSet')
    ProjectEditorValidation = apps.get_model('rsr', 'ProjectEditorValidation')

    for validation_set in ProjectEditorValidationSet.objects.filter(name__icontains="iati"):
        try:
            validation = ProjectEditorValidation.objects.get(
                validation_set=validation_set,
                validation='rsr_project.language',
                action=1,
            )
            validation.delete()
        except ProjectEditorValidation.DoesNotExist:
            pass


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0081_auto_20160721_0945'),
    ]

    operations = [
        migrations.RunPython(add_language_to_validations, remove_language_from_validations),
    ]
