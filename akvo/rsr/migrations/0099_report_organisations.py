# -*- coding: utf-8 -*-


from django.db import models, migrations


def create_organisation_results_report(apps, schema_editor):
    Report = apps.get_model("rsr", "Report")
    ReportFormat = apps.get_model("rsr", "ReportFormat")
    excel = ReportFormat.objects.get(name='excel')
    report, _ = Report.objects.get_or_create(
        name='organisation-results-export',
        defaults={
            'title': 'Results export',
            'description': "Results export for all projects within your organisation",
            'url': '/en/reports/orgresults/{organisation}?format={format}&download=true',
        }
    )
    report.formats.add(excel)

    # Currently, the report is shown only to EUTF users
    Organisation = apps.get_model("rsr", "Organisation")
    try:
        eutf = Organisation.objects.get(id=3394)
    except Organisation.DoesNotExist:
        print("EUTF organisation not in DB.")
    else:
        report.organisations.add(eutf)


def add_organisation_for_plan_finland_report(apps, schema_editor):
    """Add organisation for the plan-finland report."""

    Report = apps.get_model("rsr", "Report")
    Organisation = apps.get_model("rsr", "Organisation")

    try:
        plan_finland = Organisation.objects.get(id=2555)
        plan_finland_report = Report.objects.get(name='plan-finland')
    except Organisation.DoesNotExist:
        print("Plan Finland organisation not in DB.")
    except Report.DoesNotExist:
        print("plan-finland report not in DB.")
    else:
        plan_finland_report.organisations.add(plan_finland)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0098_auto_20170529_1442'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='organisations',
            field=models.ManyToManyField(to='rsr.Organisation', blank=True),
            preserve_default=True,
        ),
        migrations.RunPython(create_organisation_results_report, reverse_code=lambda x, y: None),
        migrations.RunPython(add_organisation_for_plan_finland_report, reverse_code=lambda x, y: None),
    ]
