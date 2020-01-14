# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.models.iati_import_job
import datetime
import django.db.models.deletion
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0046_auto_20160115_1032'),
    ]

    operations = [
        migrations.CreateModel(
            name='IatiActivityImport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(db_index=True, auto_now_add=True, null=True)),
                ('last_modified_at', models.DateTimeField(db_index=True, auto_now=True, null=True)),
                ('activity_xml', models.TextField(verbose_name='activity xml')),
                ('sha1_hexdigest', models.CharField(max_length=40, verbose_name='sha1 hexadecimal digest of the activity XML', blank=True)),
                ('iati_identifier', models.CharField(max_length=100, verbose_name='IATI activity ID')),
            ],
            options={
                'verbose_name': 'IATI activity import',
                'verbose_name_plural': 'IATI activity imports',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IatiImportJob',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('iati_xml_file', models.FileField(upload_to=akvo.rsr.models.iati_import_job.file_path, verbose_name='local file', blank=True)),
                ('status', models.PositiveSmallIntegerField(default=10, verbose_name='status', choices=[(10, 'pending'), (12, 'in progress'), (11, 'retrieving'), (13, 'completed'), (14, 'cancelled')])),
                ('sha1_hexdigest', models.CharField(max_length=40, verbose_name='sha1 hexadecimal digest of the XML file', blank=True)),
                ('iati_import', models.ForeignKey(related_name='jobs', to='rsr.IatiImport')),
                ('projects', models.ManyToManyField(to='rsr.Project', verbose_name='projects', through='rsr.IatiActivityImport', blank=True)),
            ],
            options={
                'get_latest_by': 'iati_import_logs__created_at',
                'verbose_name': 'IATI import job',
                'verbose_name_plural': 'IATI import jobs',
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='iatiprojectimport',
            name='iati_import',
        ),
        migrations.RemoveField(
            model_name='iatiprojectimport',
            name='project',
        ),
        migrations.AddField(
            model_name='iatiactivityimport',
            name='iati_import_job',
            field=models.ForeignKey(related_name='iati_activity_imports', to='rsr.IatiImportJob'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiactivityimport',
            name='project',
            field=models.ForeignKey(related_name='iati_project_imports', verbose_name='project', to='rsr.Project', null=True),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='CordaidZipIatiImportJob',
            fields=[
            ],
            options={
                'proxy': True,
            },
            bases=('rsr.iatiimportjob',),
        ),
        migrations.AlterModelOptions(
            name='iatiimportlog',
            options={'ordering': ('created_at',), 'verbose_name': 'IATI import log', 'verbose_name_plural': 'IATI import logs'},
        ),
        migrations.RemoveField(
            model_name='iatiimport',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='iatiimport',
            name='local_file',
        ),
        migrations.RemoveField(
            model_name='iatiimport',
            name='projects',
        ),
        migrations.DeleteModel(
            name='IatiProjectImport',
        ),
        migrations.RemoveField(
            model_name='iatiimport',
            name='start_date',
        ),
        migrations.RemoveField(
            model_name='iatiimport',
            name='status',
        ),
        migrations.RemoveField(
            model_name='iatiimportlog',
            name='iati_import',
        ),
        migrations.RemoveField(
            model_name='iatiimportlog',
            name='severity',
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='enabled',
            field=models.BooleanField(default=False, help_text=b'Set to enable scheduled running of this import.', verbose_name='scheduled importing enabled'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='frequency',
            field=models.PositiveIntegerField(default=1, choices=[(1, 'hourly'), (2, 'every six hours'), (3, 'daily'), (4, 'every three days'), (5, 'weekly'), (6, 'bi-weekly'), (7, 'every four weeks'), (8, 'every two minutes')]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='label',
            field=models.CharField(default='foo', unique=True, max_length=50, verbose_name='label'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='mapper_prefix',
            field=models.CharField(blank=True, help_text=b'Choose a custom mapper to invoke custom behaviour for this import', max_length=30, verbose_name='Custom mappers', choices=[(b'Cordaid', b'Cordaid'), (b'CordaidZip', b'CordaidZip'), (b'ICCO', b'ICCO')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='next_execution',
            field=models.DateTimeField(null=True, verbose_name='next time the import is run', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='run_immediately',
            field=models.BooleanField(default=False, help_text=b'Run the job immediately. Overrides the enabled state.', verbose_name='run immediately'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimport',
            name='running',
            field=models.BooleanField(default=False, help_text=b'Running is set while the import executes. This is to guarantee that the same import never runs twice (or more) in parallel.', verbose_name='import currently running'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2001, 1, 1, 0, 0), editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='field',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'', max_length=100, verbose_name='field'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='iati_activity_import',
            field=models.ForeignKey(verbose_name='activity', blank=True, to='rsr.IatiActivityImport', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='iati_import_job',
            field=models.ForeignKey(related_name='iati_import_logs', default=0, verbose_name='iati import', to='rsr.IatiImportJob'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='message_type',
            field=models.PositiveSmallIntegerField(default=30, verbose_name='type of message', choices=[(1, 'create action'), (2, 'update action'), (3, 'delete action'), (10, 'status pending'), (11, 'status retrieving'), (12, 'status in progress'), (13, 'status complete'), (14, 'status cancelled'), (20, 'information'), (30, 'critical error'), (21, 'value not saved'), (22, 'value partly saved')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='model',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'', max_length=255, verbose_name='model'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='iatiimportlog',
            name='tag',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'', max_length=100, verbose_name='xml tag'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='administrativelocation',
            name='level',
            field=models.PositiveSmallIntegerField(null=True, verbose_name='administrative level', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='iatiimportlog',
            name='project',
            field=models.ForeignKey(related_name='iati_project_import_logs', on_delete=django.db.models.deletion.SET_NULL, verbose_name='project', blank=True, to='rsr.Project', null=True),
            preserve_default=True,
        ),
    ]
