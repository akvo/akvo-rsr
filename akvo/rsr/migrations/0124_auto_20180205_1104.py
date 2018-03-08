# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


def migrate_disaggregations(apps, schema_editor):
    Dimension = apps.get_model('rsr', 'Dimension')
    DimensionValue = apps.get_model('rsr', 'DimensionValue')
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

        dimension, _created = Dimension.objects.get_or_create(
            project=project,
            name=name,
        )
        print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
            project.pk, dimension.pk, dimension.name, "", "",
            "Yes" if _created else "No", "", "", "", "", "",).encode('utf-8'))
        dimension.indicators.add(disagg.update.period.indicator)

        dimension_value, _created = DimensionValue.objects.get_or_create(
            dimension=dimension,
            value=value,
        )
        print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
            project.pk, dimension.pk, dimension.name, dimension_value.pk,
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
            name='Dimension',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(help_text='The name of a category to be used when disaggregating (e.g "Age").', max_length=100, verbose_name='dimension')),
                ('project', models.ForeignKey(related_name='dimensions', verbose_name='project', to='rsr.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'dimension',
                'verbose_name_plural': 'dimensions',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DimensionValue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', akvo.rsr.fields.ValidXMLCharField(help_text='A value in the category being disaggregated (e.g. "Older than 60 years").', max_length=100, verbose_name='dimension value')),
                ('dimension', models.ForeignKey(related_name='dimension_values', verbose_name='dimension name', to='rsr.Dimension')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'dimension value',
                'verbose_name_plural': 'dimension values',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='indicator',
            name='dimensions',
            field=models.ManyToManyField(related_name='indicators', to='rsr.Dimension'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='disaggregation',
            name='dimension_value',
            field=models.ForeignKey(related_name='disaggregations',
                                    to='rsr.DimensionValue', null=True),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='dimension',
            unique_together=set([('project', 'name')]),
        ),
        migrations.AlterUniqueTogether(
            name='dimensionvalue',
            unique_together=set([('dimension', 'value')]),
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
