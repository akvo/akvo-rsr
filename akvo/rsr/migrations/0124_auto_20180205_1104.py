# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


def migrate_disaggregations(apps, schema_editor):
    IndicatorDimensionName = apps.get_model('rsr', 'IndicatorDimensionName')
    IndicatorDimensionValue = apps.get_model('rsr', 'IndicatorDimensionValue')
    Disaggregation = apps.get_model('rsr', 'Disaggregation')

    print (u"\nProject ID\tDimension ID\tDimension name\tAxis ID\tAxis name\tCreated?\t"
           u"Disaggregation ID\tUpdate ID\tOld dimension ID\tOld dimension Name\t"
           u"Old dimension Value")

    for disagg in Disaggregation.objects.all().select_related(
            'update__period__indicator__result__project'):
        name = disagg.dimension.name.strip()
        value = disagg.dimension.value.strip()
        if not (name and value):
            print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t".format(
                "", "", "", "", "", "Error", disagg.pk, "", "", name, value,
            ))
            continue
        project = disagg.update.period.indicator.result.project

        dimension_name, _created = IndicatorDimensionName.objects.get_or_create(
            project=project,
            name=name,
        )
        print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
            project.pk, dimension_name.pk, dimension_name.name, "", "",
            "Yes" if _created else "No", "", "", "", "", "",).encode('utf-8'))
        dimension_name.indicators.add(disagg.update.period.indicator)

        dimension_value, _created = IndicatorDimensionValue.objects.get_or_create(
            name=dimension_name,
            value=value,
        )
        print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
            project.pk, dimension_name.pk, dimension_name.name, dimension_value.pk,
            dimension_value.value, "Yes" if _created else "No",
            disagg.pk, disagg.update.pk, disagg.dimension.pk, "", "", "",).encode('utf-8'))
        disagg.dimension_value = dimension_value
        disagg.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0123_periodactualvalue_perioddisaggregation'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndicatorDimensionName',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(help_text='The name of a category to be used when disaggregating (e.g "Age").', max_length=100, verbose_name='dimension name')),
                ('project', models.ForeignKey(related_name='dimension_names', verbose_name='project', to='rsr.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'indicator dimension name',
                'verbose_name_plural': 'indicator dimension names',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IndicatorDimensionValue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', akvo.rsr.fields.ValidXMLCharField(help_text='A value in the category being disaggregated (e.g. "Older than 60 years").', max_length=100, verbose_name='dimension value')),
                ('name', models.ForeignKey(related_name='dimension_values', verbose_name='dimension name', to='rsr.IndicatorDimensionName')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'indicator dimension value',
                'verbose_name_plural': 'indicator dimension values',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='indicator',
            name='dimension_names',
            field=models.ManyToManyField(related_name='indicators', to='rsr.IndicatorDimensionName'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='disaggregation',
            name='dimension_value',
            field=models.ForeignKey(related_name='disaggregations',
                                    to='rsr.IndicatorDimensionValue', null=True),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='indicatordimensionname',
            unique_together=set([('project', 'name')]),
        ),
        migrations.AlterUniqueTogether(
            name='indicatordimensionvalue',
            unique_together=set([('name', 'value')]),
        ),
        migrations.RunPython(migrate_disaggregations, lambda x, y: None),
        migrations.RemoveField(
            model_name='disaggregation',
            name='dimension',
        ),
        migrations.RemoveField(
            model_name='indicatordimension',
            name='indicator',
        ),
        migrations.DeleteModel(
            name='IndicatorDimension',
        ),
    ]
