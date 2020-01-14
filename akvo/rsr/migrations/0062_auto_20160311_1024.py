# -*- coding: utf-8 -*-


from django.db import models, migrations


def set_fields(apps, validation_set, fields, action):
    """
    Set the validation fields in the validation set.
    """
    ProjectEditorValidation = apps.get_model('rsr', 'ProjectEditorValidation')

    for field in fields:
        ProjectEditorValidation.objects.get_or_create(
            validation_set=validation_set,
            validation=field,
            action=action
        )


def rsr_validation_set_changes(apps, schema_editor):
    """
    Edit RSR's validation set, based on IATI v2.02 changes.
    """
    ProjectEditorValidationSet = apps.get_model('rsr', 'ProjectEditorValidationSet')

    try:
        # RSR validation set is always pk=1
        rsr_validation_set = ProjectEditorValidationSet.objects.get(pk=1)
        hide_fields = [
            'rsr_project.humanitarian',
            'rsr_humanitarianscope',
            'rsr_partnership.iati_activity_id',
            'rsr_indicatorreference',
            'rsr_indicatorperiodactualdimension',
            'rsr_indicatorperiodactuallocation',
            'rsr_indicatorperiodtargetdimension',
            'rsr_indicatorperiodtargetlocation',
            'rsr_budgetitem.currency',
            'rsr_budgetitem.status',
            'rsr_sector.vocabulary_uri',
            'rsr_projectdocument.title_language',
            'rsr_projectdocument.document_date',
            'rsr_projectdocumentcategory',
            'rsr_crsadd',
            'rsr_fss',
            'rsr_legacydata',
        ]
        set_fields(apps, rsr_validation_set, hide_fields, 2)
    except:
        pass


def iati_validation_set_changes(apps, schema_editor):
    """
    Edit IATI's validation set, based on IATI v2.02 changes.
    """
    ProjectEditorValidationSet = apps.get_model('rsr', 'ProjectEditorValidationSet')

    try:
        # IATI validation set should be named 'IATI'
        iati_validation_set = ProjectEditorValidationSet.objects.get(name='IATI')
        mandatory_fields = [
            'rsr_humanitarianscope.code',
            'rsr_humanitarianscope.type',
            'rsr_humanitarianscope.vocabulary',
            'rsr_projectdocumentcategory',
            'rsr_indicatorreference.reference',
            'rsr_indicatorreference.vocabulary',
            'rsr_crsaddotherflag.code',
            'rsr_crsaddotherflag.significance',
            'rsr_fss.extraction_date',
            'rsr_fssforecast.year',
            'rsr_legacydata.name',
            'rsr_legacydata.value',
        ]
        set_fields(apps, iati_validation_set, mandatory_fields, 1)
    except:
        pass


def dgis_validation_set_changes(apps, schema_editor):
    """
    Edit IATI DGIS's validation set, based on IATI v2.02 changes.
    """
    ProjectEditorValidationSet = apps.get_model('rsr', 'ProjectEditorValidationSet')

    try:
        # DGIS validation set should be named 'DGIS IATI'
        dgis_validation_set = ProjectEditorValidationSet.objects.get(name='DGIS IATI')
        mandatory_fields = [
            'rsr_projectdocumentcategory',
        ]
        set_fields(apps, dgis_validation_set, mandatory_fields, 1)

        hide_fields = [
            'rsr_project.humanitarian',
            'rsr_humanitarianscope',
            'rsr_indicatorreference',
            'rsr_indicatorperiodactualdimension',
            'rsr_indicatorperiodactuallocation',
            'rsr_indicatorperiodtargetdimension',
            'rsr_indicatorperiodtargetlocation',
            'rsr_budgetitem.currency',
            'rsr_budgetitem.status',
            'rsr_transaction.currency',
            'rsr_transaction.humanitarian',
            'rsr_transaction.recipient_region_vocabulary_uri',
            'rsr_planneddisbursement.currency',
            'rsr_recipientcountry.text',
            'rsr_recipientregion.text',
            'rsr_recipientregion.region_vocabulary',
            'rsr_recipientregion.region_vocabulary_uri',
            'rsr_sector.text',
            'rsr_sector.vocabulary_uri',
            'rsr_policymarker.description',
            'rsr_policymarker.vocabulary',
            'rsr_policymarker.vocabulary_uri',
            'rsr_projectdocument.language',
            'rsr_projectdocument.title_language',
            'rsr_projectdocument.document_date',
            'rsr_crsadd',
            'rsr_fss',
            'rsr_legacydata',
        ]
        set_fields(apps, dgis_validation_set, hide_fields, 2)
    except:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0061_auto_20160311_1023'),
    ]

    operations = [
        migrations.RunPython(rsr_validation_set_changes),
        migrations.RunPython(iati_validation_set_changes),
        migrations.RunPython(dgis_validation_set_changes),
    ]
