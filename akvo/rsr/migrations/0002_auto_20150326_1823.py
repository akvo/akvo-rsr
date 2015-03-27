# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import akvo.rsr.fields
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdministrativeLocation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', akvo.rsr.fields.ValidXMLCharField(max_length=25, verbose_name='administrative code', blank=True)),
                ('vocabulary', akvo.rsr.fields.ValidXMLCharField(max_length=2, verbose_name='administrative vocabulary', blank=True)),
                ('level', models.PositiveSmallIntegerField(max_length=1, null=True, verbose_name='administrative level', blank=True)),
                ('location', models.ForeignKey(related_name='administratives', verbose_name='location', to='rsr.ProjectLocation')),
            ],
            options={
                'verbose_name': 'location administrative',
                'verbose_name_plural': 'location administratives',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CrsAdd',
            fields=[
                ('project', models.OneToOneField(primary_key=True, serialize=False, to='rsr.Project')),
                ('loan_terms_rate1', models.DecimalField(decimal_places=2, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], max_digits=5, blank=True, null=True, verbose_name='rate 1')),
                ('loan_terms_rate2', models.DecimalField(decimal_places=2, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], max_digits=5, blank=True, null=True, verbose_name='rate 2')),
                ('repayment_type', akvo.rsr.fields.ValidXMLCharField(max_length=1, verbose_name='repayment type')),
                ('repayment_plan', akvo.rsr.fields.ValidXMLCharField(max_length=2, verbose_name='repayment plan')),
                ('commitment_date', models.DateField(null=True, verbose_name='commitment date', blank=True)),
                ('repayment_first_date', models.DateField(null=True, verbose_name='first repayment date', blank=True)),
                ('repayment_final_date', models.DateField(null=True, verbose_name='final repayment date', blank=True)),
                ('loan_status_year', models.PositiveIntegerField(max_length=4, null=True, verbose_name='loan status year', blank=True)),
                ('loan_status_currency', akvo.rsr.fields.ValidXMLCharField(max_length=3, verbose_name='currency', blank=True)),
                ('loan_status_value_date', models.DateField(null=True, verbose_name='loan status value date', blank=True)),
                ('interest_received', models.DecimalField(null=True, verbose_name='interest received', max_digits=10, decimal_places=2, blank=True)),
                ('principal_outstanding', models.DecimalField(null=True, verbose_name='principal outstanding', max_digits=10, decimal_places=2, blank=True)),
                ('principal_arrears', models.DecimalField(null=True, verbose_name='principal arrears', max_digits=10, decimal_places=2, blank=True)),
                ('interest_arrears', models.DecimalField(null=True, verbose_name='interest arrears', max_digits=10, decimal_places=2, blank=True)),
            ],
            options={
                'verbose_name': 'CRS reporting',
                'verbose_name_plural': 'CRS reporting',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CrsAddOtherFlag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', akvo.rsr.fields.ValidXMLCharField(max_length=1, verbose_name='code')),
                ('significance', models.NullBooleanField(verbose_name='significance')),
                ('crs', models.ForeignKey(related_name='other_flags', verbose_name='crs', to='rsr.CrsAdd')),
            ],
            options={
                'verbose_name': 'CRS other flag',
                'verbose_name_plural': 'CRS other flags',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Fss',
            fields=[
                ('project', models.OneToOneField(primary_key=True, serialize=False, to='rsr.Project')),
                ('extraction_date', models.DateField(null=True, verbose_name='extraction date', blank=True)),
                ('priority', models.NullBooleanField(verbose_name='priority')),
                ('phaseout_year', models.PositiveIntegerField(max_length=4, null=True, verbose_name='phaseout year', blank=True)),
            ],
            options={
                'verbose_name': 'FSS',
                'verbose_name_plural': 'FSS',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FssForecast',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('year', models.PositiveIntegerField(max_length=4, null=True, verbose_name='year', blank=True)),
                ('value_date', models.DateField(null=True, verbose_name='value date', blank=True)),
                ('currency', akvo.rsr.fields.ValidXMLCharField(max_length=3, verbose_name='currency', blank=True)),
                ('value', models.DecimalField(null=True, verbose_name='interest received', max_digits=10, decimal_places=2, blank=True)),
                ('fss', models.ForeignKey(related_name='forecasts', verbose_name='fss', to='rsr.Fss')),
            ],
            options={
                'verbose_name': 'FSS forecast',
                'verbose_name_plural': 'FSS forecasts',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TransactionSector',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', akvo.rsr.fields.ValidXMLCharField(max_length=5, verbose_name='sector', blank=True)),
                ('text', akvo.rsr.fields.ValidXMLCharField(help_text='(max 100 characters)', max_length=100, verbose_name='description', blank=True)),
                ('vocabulary', akvo.rsr.fields.ValidXMLCharField(max_length=5, verbose_name='vocabulary', blank=True)),
                ('project', models.ForeignKey(related_name='sectors', verbose_name='transaction', to='rsr.Transaction')),
            ],
            options={
                'verbose_name': 'transaction sector',
                'verbose_name_plural': 'transaction sectors',
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='budgetitem',
            name='period_end_text',
        ),
        migrations.RemoveField(
            model_name='budgetitem',
            name='period_start_text',
        ),
        migrations.RemoveField(
            model_name='countrybudgetitem',
            name='vocabulary',
        ),
        migrations.RemoveField(
            model_name='indicator',
            name='description_type',
        ),
        migrations.RemoveField(
            model_name='projectcondition',
            name='attached',
        ),
        migrations.RemoveField(
            model_name='projectlocation',
            name='administrative_code',
        ),
        migrations.RemoveField(
            model_name='projectlocation',
            name='administrative_level',
        ),
        migrations.RemoveField(
            model_name='projectlocation',
            name='administrative_vocabulary',
        ),
        migrations.RemoveField(
            model_name='result',
            name='description_type',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='aid_type_text',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='disbursement_channel_text',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='finance_type_text',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='flow_type_text',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='tied_status_text',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='transaction_type_text',
        ),
        migrations.AddField(
            model_name='project',
            name='country_budget_vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=1, verbose_name='country budget vocabulary', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='relatedproject',
            name='related_iati_id',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The IATI Identifier for the related project.<br>Fill this in if the related project does not exist in RSR', max_length=100, verbose_name='related project IATI identifier', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='transaction',
            name='recipient_country',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=2, verbose_name='recipient country', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='transaction',
            name='recipient_region',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=3, verbose_name='recipient region', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='transaction',
            name='recipient_region_vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=1, verbose_name='recipient region vocabulary', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='relatedproject',
            name='related_project',
            field=models.ForeignKey(related_name='related_to_projects', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='rsr.Project', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='relatedproject',
            name='relation',
            field=akvo.rsr.fields.ValidXMLCharField(help_text="The relation between a project and related project. (E.g. select the 'Parent' relation when the selected project here is the parent of this project).", max_length=1, verbose_name='relation'),
            preserve_default=True,
        ),
    ]
