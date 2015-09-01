# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.models.iati_import
from django.conf import settings
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0031_auto_20150825_1109'),
    ]

    operations = [
        migrations.CreateModel(
            name='IatiImport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.URLField(verbose_name='url', blank=True)),
                ('local_file', models.FileField(upload_to=akvo.rsr.models.iati_import.file_path, verbose_name='local file', blank=True)),
                ('status', models.PositiveSmallIntegerField(default=1, verbose_name='status')),
                ('start_date', models.DateTimeField(null=True, verbose_name='start date', blank=True)),
                ('end_date', models.DateTimeField(null=True, verbose_name='end date', blank=True)),
            ],
            options={
                'verbose_name': 'IATI import',
                'verbose_name_plural': 'IATI imports',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IatiImportLog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', akvo.rsr.fields.ValidXMLTextField(verbose_name='text')),
                ('error', models.BooleanField(default=False, verbose_name='error')),
                ('iati_import', models.ForeignKey(related_name='iati_import_logs', verbose_name='iati_import', to='rsr.IatiImport')),
                ('project', models.ForeignKey(related_name='iati_project_import_logs', verbose_name='project', blank=True, to='rsr.Project', null=True)),
            ],
            options={
                'verbose_name': 'IATI import log',
                'verbose_name_plural': 'IATI import logs',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IatiProjectImport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('action', models.PositiveSmallIntegerField(verbose_name='action')),
                ('status', models.PositiveSmallIntegerField(default=1, verbose_name='status')),
                ('start_date', models.DateTimeField(null=True, verbose_name='start date', blank=True)),
                ('end_date', models.DateTimeField(null=True, verbose_name='end date', blank=True)),
                ('errors', models.BooleanField(default=False, verbose_name='errors')),
                ('iati_import', models.ForeignKey(related_name='iati_project_imports', verbose_name='iati_import', to='rsr.IatiImport')),
                ('project', models.ForeignKey(related_name='iati_project_imports', verbose_name='project', to='rsr.Project')),
            ],
            options={
                'verbose_name': 'IATI project import',
                'verbose_name_plural': 'IATI project imports',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='projects',
            field=models.ManyToManyField(to='rsr.Project', verbose_name='projects', through='rsr.IatiProjectImport', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='reporting_organisation',
            field=models.ForeignKey(related_name='iati_imports', verbose_name='reporting organisation', to='rsr.Organisation'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='user',
            field=models.ForeignKey(related_name='iati_imports', verbose_name='user', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
