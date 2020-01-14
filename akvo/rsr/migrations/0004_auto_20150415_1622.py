# -*- coding: utf-8 -*-


from django.db import models, migrations


def combine_results(apps, schema_editor):
    """
    If two (or more) similar results are present in a project, then combine the
    indicators of these results.
    """
    Project = apps.get_model("rsr", "Project")
    for project in Project.objects.all():
        if project.results.all() and project.results.all().count() > 1:
            altered_results = []
            for result in project.results.all():
                if result.indicators.all():
                    for other_result in project.results.filter(
                            title=result.title, type=result.type).exclude(pk=result.pk):
                        for indicator in other_result.indicators.all():
                            indicator.result = result
                            indicator.save()
                        if other_result not in altered_results:
                            altered_results.append(other_result)

            for result in altered_results:
                if not result.indicators.all():
                    result.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0003_auto_20150402_1040'),
    ]

    operations = [
        migrations.RunPython(combine_results),
    ]
