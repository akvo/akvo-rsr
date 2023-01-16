# Generated by Django 3.2.10 on 2022-05-03 16:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0223_project_tree'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='iatiactivityimport',
            name='iati_import_job',
        ),
        migrations.RemoveField(
            model_name='iatiactivityimport',
            name='project',
        ),
        migrations.RemoveField(
            model_name='iatiimport',
            name='user',
        ),
        migrations.RemoveField(
            model_name='iatiimportjob',
            name='iati_import',
        ),
        migrations.RemoveField(
            model_name='iatiimportjob',
            name='projects',
        ),
        migrations.RemoveField(
            model_name='iatiimportlog',
            name='iati_activity_import',
        ),
        migrations.RemoveField(
            model_name='iatiimportlog',
            name='iati_import_job',
        ),
        migrations.RemoveField(
            model_name='iatiimportlog',
            name='project',
        ),
        migrations.DeleteModel(
            name='CordaidZipIatiImportJob',
        ),
        migrations.DeleteModel(
            name='IatiActivityImport',
        ),
        migrations.DeleteModel(
            name='IatiImport',
        ),
        migrations.DeleteModel(
            name='IatiImportJob',
        ),
        migrations.DeleteModel(
            name='IatiImportLog',
        ),
    ]
