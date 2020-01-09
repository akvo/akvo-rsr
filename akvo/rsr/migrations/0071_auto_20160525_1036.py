# -*- coding: utf-8 -*-


from django.core.exceptions import MultipleObjectsReturned
from django.db import models, migrations


def remove_country_from_validation_sets(apps, schema_editor):
    """
    Removes the rsr_projectlocation.country field from all validation sets.
    """
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    validations_to_be_deleted = []

    for validation_set in ProjectEditorValidationSet.objects.all():
        for validation in validation_set.validations.all():
            if 'rsr_projectlocation.country' in validation.validation:
                validations_to_be_deleted.append(validation)

    for delete_validation in validations_to_be_deleted:
        delete_validation.delete()


def add_country_to_rsr_validation_set(apps, schema_editor):
    """
    Adds the rsr_projectlocation.country field to the RSR validation set, as mandatory field.
    """
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")
    try:
        rsr_validation_set = ProjectEditorValidationSet.objects.get(pk=1)
        ProjectEditorValidation.objects.get_or_create(
            validation_set=rsr_validation_set,
            validation='rsr_projectlocation.country',
            action=1
        )
    except (ProjectEditorValidationSet.DoesNotExist, MultipleObjectsReturned):
        # The RSR validation set (id = 1) can not be deleted and should always exist
        pass


def do_not_hide_recipient_countries_and_regions(apps, schema_editor):
    """
    In the RSR validations set (id is always 1), remove the settings to hide the
    rsr_recipientcountry and rsr_recipientregion models. Do hide some of the specific fields in
    these models, such as the free text, percentage, vocabulary and vocabulary_uri.
    """
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")
    validations_to_be_deleted = []
    validations_to_be_added = [
        ['rsr_recipientcountry', ['percentage', 'text']],
        ['rsr_recipientregion', ['percentage', 'text', 'region_vocabulary',
                                 'region_vocabulary_uri']],
    ]

    try:
        rsr_validation_set = ProjectEditorValidationSet.objects.get(id=1)
        for validation in rsr_validation_set.validations.all():
            if validation.validation in ["rsr_recipientcountry", "rsr_recipientregion"] and \
                    validation.action == 2:
                validations_to_be_deleted.append(validation)

        for delete_validation in validations_to_be_deleted:
            delete_validation.delete()

        for add_validation in validations_to_be_added:
            model_name = add_validation[0]
            field_names = add_validation[1]
            for field_name in field_names:
                ProjectEditorValidation.objects.get_or_create(
                    validation_set=rsr_validation_set,
                    validation="{0}.{1}".format(model_name, field_name),
                    action=2
                )
    except (ProjectEditorValidationSet.DoesNotExist, MultipleObjectsReturned):
        # The RSR validation set (id = 1) can not be deleted and should always exist
        pass


def hide_recipient_countries_and_regions(apps, schema_editor):
    """
    In the RSR validations set (id is always 1), re-add the settings to hide the
    rsr_recipientcountry and rsr_recipientregion models.
    """
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")

    try:
        rsr_validation_set = ProjectEditorValidationSet.objects.get(pk=1)
        ProjectEditorValidation.objects.get_or_create(
            validation_set=rsr_validation_set,
            validation='rsr_recipientcountry',
            action=2
        )
        ProjectEditorValidation.objects.get_or_create(
            validation_set=rsr_validation_set,
            validation='rsr_recipientregion',
            action=2
        )
    except (ProjectEditorValidationSet.DoesNotExist, MultipleObjectsReturned):
        # The RSR validation set (id = 1) can not be deleted and should always exist
        pass


def convert_locations_to_recipient_countries(apps, schema_editor):
    """
    For each project retrieve the country code from the location and add a new recipient country
    object if it does not exist yet.
    """
    Project = apps.get_model("rsr", "Project")
    RecipientCountry = apps.get_model("rsr", "RecipientCountry")

    for project in Project.objects.all():
        country_codes = []
        for location in project.locations.all():
            country = location.country
            if country:
                country_codes.append(country.iso_code.upper())

        for country_code in list(set(country_codes)):
            try:
                RecipientCountry.objects.get_or_create(project=project, country=country_code)
            except MultipleObjectsReturned:
                # This could happen when a project has the same country specified as a recipient
                # country multiple times
                pass


def revert_locations_to_recipient_countries(apps, schema_editor):
    """
    Unfortunately we can't be sure which recipient country stems from a location, or whether it
    already existed originally. Therefore we can only ignore it.
    """
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0070_auto_20160519_1205'),
    ]

    operations = [
        migrations.RunPython(remove_country_from_validation_sets,
                             add_country_to_rsr_validation_set),
        migrations.RunPython(do_not_hide_recipient_countries_and_regions,
                             hide_recipient_countries_and_regions),
        migrations.RunPython(convert_locations_to_recipient_countries,
                             revert_locations_to_recipient_countries),
    ]
