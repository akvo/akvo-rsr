# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0103_auto_20170731_1334'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndicatorLabel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('indicator', models.ForeignKey(related_name='labels', verbose_name='indicator', to='rsr.Indicator')),
            ],
            options={
                'verbose_name': 'indicator label',
                'verbose_name_plural': 'indicator labels',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='OrganisationIndicatorLabel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('label', akvo.rsr.fields.ValidXMLCharField(max_length=100, verbose_name='label')),
                ('organisation', models.ForeignKey(related_name='indicator_labels', verbose_name='organisation', to='rsr.Organisation')),
            ],
            options={
                'verbose_name': 'organisation indicator label',
                'verbose_name_plural': 'organisation indicator labels',
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='organisationindicatorlabel',
            unique_together=set([('organisation', 'label')]),
        ),
        migrations.AddField(
            model_name='indicatorlabel',
            name='label',
            field=models.ForeignKey(related_name='indicators', verbose_name='label', to='rsr.OrganisationIndicatorLabel'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='value',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=300, null=True, verbose_name='quantitative indicator value', blank=True),
            preserve_default=True,
        ),
    ]
