# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def fix_results(apps, schema_editor):
    Benchmark = apps.get_model("rsr", "Benchmark")
    Benchmarkname = apps.get_model("rsr", "Benchmarkname")
    Result = apps.get_model("rsr", "Result")
    for result in Result.objects.all():
        if not result.title and result.indicators.all().count() == 1:
            project = result.project
            indicator = result.indicators.all()[0]
            if indicator.periods.all().count() == 1:
                period = indicator.periods.all()[0]
                value = period.actual_value
                benchmark_name_text = indicator.title

                try:
                    benchmark_name = Benchmarkname.objects.get(
                        name=benchmark_name_text
                    )
                    benchmark = Benchmark.objects.get(
                        project=project,
                        name=benchmark_name,
                        value=value,
                    )
                    result.title = benchmark.category.name
                    result.save()
                except:
                    continue


def reverse_hierarchy(apps, schema_editor):
    RelatedProject = apps.get_model("rsr", "RelatedProject")
    for related_project in RelatedProject.objects.all():
        if related_project.relation == '1':
            related_project.relation = '2'
            related_project.save()
        elif related_project.relation == '2':
            related_project.relation = '1'
            related_project.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0002_auto_20150331_1006'),
    ]

    operations = [
        migrations.RunPython(fix_results),
        migrations.RunPython(reverse_hierarchy),
    ]
