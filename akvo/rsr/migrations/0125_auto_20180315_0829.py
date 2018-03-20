# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

ORIGINAL_URL = '/en/reports/project_results/{project}?format={format}&download=true'
NEW_URL = ORIGINAL_URL + '&p_StartDate={start_date}&p_EndDate={end_date}'
REPORT_ID = 1


def add_start_end_dates_report_url(apps, schema):
    Report = apps.get_model('rsr', 'Report')
    project_results_report = Report.objects.get(id=REPORT_ID)
    project_results_report.url = NEW_URL
    project_results_report.save()


def remove_start_end_dates_report_url(apps, schema):
    Report = apps.get_model('rsr', 'Report')
    project_results_report = Report.objects.get(id=REPORT_ID)
    project_results_report.url = ORIGINAL_URL
    project_results_report.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0124_auto_20180309_0923'),
    ]

    operations = [
        migrations.RunPython(add_start_end_dates_report_url, remove_start_end_dates_report_url)
    ]
