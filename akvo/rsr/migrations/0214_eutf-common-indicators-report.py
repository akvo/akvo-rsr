# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-09-01 15:53
from __future__ import unicode_literals

from django.db import migrations


REPORT_NAME = 'eutf-common-output-indicators'
RESULT_TITLE = 'EUTF Common Output Indicators'

def make_report(apps, schema_editor):
    Report = apps.get_model('rsr', 'Report')
    ReportFormat = apps.get_model('rsr', 'ReportFormat')
    Organisation = apps.get_model('rsr', 'Organisation')
    Result = apps.get_model('rsr', 'Result')

    eutf = Organisation.objects.filter(id=3394).first()
    common_output_result = Result.objects.filter(project_id=4401, title=RESULT_TITLE).first()

    if common_output_result is None:
        print(f"Specified result '{RESULT_TITLE}' not found. Skipping Report Creation.")
        return

    result_id = common_output_result.id
    url = f"/py-reports/program/{{program}}/eutf-common-output-indicators-table/{result_id}?format={{format}}&download=true"

    new_report = Report.objects.create(
        name=REPORT_NAME,
        title=f'{RESULT_TITLE} Export',
        description="An export of the common output indicators data for all of the projects within EUTF organisation.",
        url=url
    )

    new_report.formats.add(ReportFormat.objects.get(name='excel'))
    new_report.organisations.add(eutf)


def drop_report(apps, schema_editor):
    Report = apps.get_model('rsr', 'Report')
    Report.objects.filter(name=REPORT_NAME).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0213_auto_20210531_1056'),
    ]

    operations = [
        migrations.RunPython(make_report, drop_report)
    ]
