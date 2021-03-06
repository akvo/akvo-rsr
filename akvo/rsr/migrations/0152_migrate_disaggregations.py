# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-27 05:58


from django.db import migrations, models
import django.db.models.deletion


def migrate_disaggregations(apps, schema_editor):
    IndicatorDimensionName = apps.get_model('rsr', 'IndicatorDimensionName')
    IndicatorDimensionValue = apps.get_model('rsr', 'IndicatorDimensionValue')
    Disaggregation = apps.get_model('rsr', 'Disaggregation')

    print("\nProject ID\tDimension ID\tDimension name\tAxis ID\tAxis name\tCreated?\t"
          "Disaggregation ID\tUpdate ID\tOld dimension ID\tOld dimension Name\t"
          "Old dimension Value")

    for disagg in Disaggregation.objects.all().select_related(
            'update__period__indicator__result__project'):
        name = disagg.dimension.name.strip()
        value = disagg.dimension.value.strip()
        if not (name and value):
            print("{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t".format(
                "", "", "", "", "", "Error", disagg.pk, "", "", name, value,
            ))
            continue
        project = disagg.update.period.indicator.result.project

        dimension_name, _created = IndicatorDimensionName.objects.get_or_create(
            project=project,
            name=name,
        )
        print("{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
            project.pk, dimension_name.pk, dimension_name.name, "", "",
            "Yes" if _created else "No", "", "", "", "", "",).encode('utf-8'))
        dimension_name.indicators.add(disagg.update.period.indicator)

        dimension_value, _created = IndicatorDimensionValue.objects.get_or_create(
            name=dimension_name,
            value=value,
        )
        print("{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
            project.pk, dimension_name.pk, dimension_name.name, dimension_value.pk,
            dimension_value.value, "Yes" if _created else "No",
            disagg.pk, disagg.update.pk, disagg.dimension.pk, "", "", "",).encode('utf-8'))
        disagg.dimension_value = dimension_value
        disagg.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0151_dimension_name_and_value_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='disaggregation',
            name='dimension_value',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='disaggregations', to='rsr.IndicatorDimensionValue'),
        ),
        migrations.AlterUniqueTogether(
            name='indicatordimensionname',
            unique_together=set([('project', 'name')]),
        ),
        migrations.AlterUniqueTogether(
            name='indicatordimensionvalue',
            unique_together=set([('name', 'value')]),
        ),
        migrations.RunPython(migrate_disaggregations),
        migrations.RemoveField(
            model_name='disaggregation',
            name='dimension',
        ),
    ]
