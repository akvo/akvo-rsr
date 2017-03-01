# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


def create_report_formats(apps, schema_editor):
    """Create the Report Formats."""

    ReportFormat = apps.get_model("rsr", "ReportFormat")
    ReportFormat.objects.create(name='pdf', display_name='PDF', icon='file-pdf-o')
    ReportFormat.objects.create(name='excel', display_name='Excel', icon='file-excel-o')
    ReportFormat.objects.create(name='word', display_name='Word', icon='file-word-o')
    ReportFormat.objects.create(name='html', display_name='HTML', icon='code')


def create_reports(apps, schema_editor):
    """Create the existing Report Types."""

    Report = apps.get_model("rsr", "Report")
    ReportFormat = apps.get_model("rsr", "ReportFormat")

    pdf = ReportFormat.objects.get(name='pdf')
    excel = ReportFormat.objects.get(name='excel')

    report = Report.objects.create(
        name='results-framework',
        title='Results and indicators overview',
        description=("This report gives an overview of the status of your project's "
                     "results and indicators."),
        url='/en/reports/project_results/{project}?format={format}&download=true',
    )
    report.formats.add(pdf)

    report = Report.objects.create(
        name='results-simple-table',
        title='Results and indicators table',
        description=("This report provides a view of your project's results and "
                     "indicators data in a table."),
        url='/en/reports/project_results_simple_table/{project}?format={format}&download=true',
    )
    report.formats.add(excel)

    report = Report.objects.create(
        name='projects-overview',
        title='Projects overview',
        description=("This report provides information about your organisation's "
                     "projects: amount of updates, country, total budgets, project "
                     "statuses, start- and end dates."),
        url='/en/reports/project_overview/{organisation}?format={format}&download=true',
    )
    report.formats.add(pdf, excel)

    report = Report.objects.create(
        name='data-quality',
        title='Data quality overview',
        description=("This report gives an overview of your organisation's projects "
                     "that have passed the planned end date, need funding or that "
                     "haven't been edited or updated for 3 months."),
        url='/en/reports/data_quality/{organisation}?format={format}&download=true',
    )
    report.formats.add(pdf, excel)

    report = Report.objects.create(
        name='plan-finland',
        title='Plan Finland report',
        description=("This custom MFA report for Plan Finland gives an overview of the "
                     "hierarchy of Plan Finland's projects and their results."),
        url='/en/reports/plan_finland/{project}?format={format}&download=true',
    )
    report.formats.add(pdf)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0092_auto_20170216_1209'),
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(unique=True, max_length=100, verbose_name='name')),
                ('title', akvo.rsr.fields.ValidXMLCharField(max_length=200, verbose_name='title')),
                ('description', akvo.rsr.fields.ValidXMLTextField(help_text='Describe the report.', verbose_name='description', blank=True)),
                ('url', akvo.rsr.fields.ValidXMLCharField(help_text='Enter the parametrized path for downloading the report', max_length=200, verbose_name='url')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReportFormat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(unique=True, max_length=30, verbose_name='name')),
                ('display_name', akvo.rsr.fields.ValidXMLCharField(unique=True, max_length=30, verbose_name='display name')),
                ('icon', akvo.rsr.fields.ValidXMLCharField(max_length=30, verbose_name='icon')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='report',
            name='formats',
            field=models.ManyToManyField(to='rsr.ReportFormat'),
            preserve_default=True,
        ),
        migrations.RunPython(create_report_formats, reverse_code=lambda x, y: None),
        migrations.RunPython(create_reports, reverse_code=lambda x, y: None),
    ]
