# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def add_rsr_validations(apps, schema_editor):
    """Adds the RSR validations with ID 1."""
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")

    rsr_validation_set = ProjectEditorValidationSet.objects.create(
        # pk=1,
        name='RSR',
        description='This progress bar indicates the number of completed mandatory fields for Akvo '
                    'RSR. It is only possible to publish a project when this progress bar is green '
                    'and fully filled, meaning that all mandatory fields have been completed.',
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.title',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.subtitle',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.status',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.date_start_planned||rsr_project.date_start_actual',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.current_image',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership.organisation',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership.iati_organisation_role',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_partnership.funding_amount',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.project_plan_summary',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.goals_overview',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.latitude',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.longitude',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.country',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.amount',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.label',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.sector_code',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.vocabulary',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.iati_activity_id',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.hierarchy',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_aid_type',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_flow_type',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_tied_status',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_tied_status',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.collaboration_type',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.default_finance_type',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_result.description',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_result.aggregation_status',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.description',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.ascending',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.baseline_year',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.baseline_value',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_indicator.baseline_comment',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectcondition',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.capital_spend_percentage',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.type',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.period_start',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.period_end',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_budgetitem.value_date',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_countrybudgetitem',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_transaction',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_planneddisbursement',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_project.project_scope',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.name',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.reference',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.location_code',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.description',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.activity_description',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.exactness',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.location_reach',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.location_class',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectlocation.feature_designation',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_locationadministrative',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_recipientcountry',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_recipientregion',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_recipientregion',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.percentage',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_sector.text',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_policymarker',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectdocument.format',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectdocument.category',
        action=2,
    )

    ProjectEditorValidation.objects.create(
        validation_set=rsr_validation_set,
        validation='rsr_projectdocument.language',
        action=2,
    )


def add_iati_validations(apps, schema_editor):
    """Adds the IATI validations."""
    ProjectEditorValidationSet = apps.get_model("rsr", "ProjectEditorValidationSet")
    ProjectEditorValidation = apps.get_model("rsr", "ProjectEditorValidation")

    iati_validation_set = ProjectEditorValidationSet.objects.create(
        name='International Aid Transparency Initiative',
        description='This progress bar indicates the number of completed mandatory fields for '
                    'IATI. It is only possible to publish a project to a valid IATI file when this '
                    'progress bar is green and fully filled, meaning that all mandatory IATI '
                    'fields have been completed.',
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.title',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.iati_activity_id',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.status',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.date_start_planned||rsr_project.date_start_actual',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_partnership',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_partnership.organisation',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_partnership.iati_organisation_role',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_project.project_plan_summary',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientcountry.country',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientcountry.percentage',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientregion.region',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_recipientregion.percentage',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector.sector_code',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector.vocabulary',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_sector.percentage',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_policymarker.policy_marker',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_policymarker.significance',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.amount',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.period_start',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.period_end',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_budgetitem.value_date',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.value',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.period_start',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.period_end',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_planneddisbursement.value_date',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.transaction_type',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.transaction_date',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.value',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_transaction.value_date',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.url||rsr_projectdocument.document',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.format',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.title',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectdocument.category',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_relatedproject.related_project||rsr_relatedproject.related_iati_id',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_relatedproject.relation',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectcondition.type',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_projectcondition.text',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_result.type',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_result.title',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicator',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicator.measure',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicator.title',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicatorperiod.period_start',
        action=1,
    )

    ProjectEditorValidation.objects.create(
        validation_set=iati_validation_set,
        validation='rsr_indicatorperiod.period_end',
        action=1,
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
