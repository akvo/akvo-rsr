# -*- coding: utf-8 -*-


from django.db import models, migrations

MANDATORY_ACTION = 1
HIDDEN_ACTION = 2
READ_ONLY_ACTION = 3

def add_rsr_validations(apps, schema_editor):
    """ Adds the RSR validations. To make sure the ProjectEditorValidationSet for RSR gets pk=1
        this migration should run immediately after 0044
    """
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")

    rsr_validation_set = ProjectEditorValidationSet.objects.create(
        name='RSR',
        description='The default RSR validation set which indicates the mandatory fields to '
                    'publish a project in RSR and hides all advanced IATI fields.',
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.title',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.subtitle',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.status',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.date_start_planned||rsr_project.date_start_actual',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.current_image',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership.organisation',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership.iati_organisation_role',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership.funding_amount',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.project_plan_summary',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.goals_overview',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.latitude',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.longitude',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.country',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.amount',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.label',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.sector_code',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.vocabulary',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.iati_activity_id',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.hierarchy',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_aid_type',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_flow_type',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_tied_status',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_tied_status',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.collaboration_type',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_finance_type',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_result.description',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_result.aggregation_status',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.description',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.ascending',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.baseline_year',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.baseline_value',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.baseline_comment',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectcondition',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.capital_spend_percentage',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.type',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.period_start',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.period_end',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.value_date',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_countrybudgetitem',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_transaction',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_planneddisbursement',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.project_scope',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.name',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.reference',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.location_code',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.description',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.activity_description',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.exactness',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.location_reach',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.location_class',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.feature_designation',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_locationadministrative',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_recipientcountry',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_recipientregion',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_recipientregion',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.percentage',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.text',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_policymarker',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectdocument.format',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectdocument.category',
        action=HIDDEN_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectdocument.language',
        action=HIDDEN_ACTION,
    )


def add_iati_validations(apps, schema_editor):
    """Adds the IATI validations."""
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")

    iati_validation_set = ProjectEditorValidationSet.objects.create(
        name='IATI',
        description='The IATI validation set which indicates the mandatory fields to '
                    'publish a project to IATI and shows all fields available in RSR.',
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.title',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.iati_activity_id',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.status',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.date_start_planned||rsr_project.date_start_actual',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_partnership',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_partnership.organisation',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_partnership.iati_organisation_role',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.project_plan_summary',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientcountry.country',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientcountry.percentage',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientregion.region',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientregion.percentage',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector.sector_code',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector.vocabulary',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector.percentage',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_policymarker.policy_marker',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_policymarker.significance',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.amount',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.period_start',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.period_end',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.value_date',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.value',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.period_start',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.period_end',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.value_date',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.transaction_type',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.transaction_date',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.value',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.value_date',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.url||rsr_projectdocument.document',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.format',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.title',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.category',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_relatedproject.related_project||rsr_relatedproject.related_iati_id',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_relatedproject.relation',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectcondition.type',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectcondition.text',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_result.type',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_result.title',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicator',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicator.measure',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicator.title',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicatorperiod.period_start',
        action=MANDATORY_ACTION,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicatorperiod.period_end',
        action=MANDATORY_ACTION,
    )


def add_rsr_validation_to_projects(apps, schema_editor):
    """Adds the RSR validations to all projects."""
    Project = apps.get_model("rsr", "Project")
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")

    rsr_validation = ProjectEditorValidationSet.objects.get(pk=1)

    for project in Project.objects.all():
        project.validations.add(rsr_validation)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0044_auto_20151209_0632'),
    ]

    operations = [
        migrations.RunPython(add_rsr_validations),
        migrations.RunPython(add_iati_validations),
        migrations.RunPython(add_rsr_validation_to_projects),
    ]
