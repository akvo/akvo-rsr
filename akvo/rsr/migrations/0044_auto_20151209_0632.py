# -*- coding: utf-8 -*-


from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0043_auto_20151208_0545'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectEditorValidation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('validation', models.CharField(max_length=255, verbose_name='validation')),
                ('action', models.PositiveSmallIntegerField(db_index=True, verbose_name='action', choices=[(1, 'Mandatory'), (2, 'Hidden'), (3, 'Read only')])),
            ],
            options={
                'verbose_name': 'project editor validation',
                'verbose_name_plural': 'project editor validations',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProjectEditorValidationSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('description', models.TextField(max_length=5000, verbose_name='description')),
            ],
            options={
                'verbose_name': 'project editor validation set',
                'verbose_name_plural': 'project editor validation sets',
                'ordering': ('id',),
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='projecteditorvalidation',
            name='validation_set',
            field=models.ForeignKey(related_name='validations', verbose_name='validation set', to='rsr.ProjectEditorValidationSet'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='project',
            name='validations',
            field=models.ManyToManyField(related_name='projects', verbose_name='validations', to='rsr.ProjectEditorValidationSet'),
            preserve_default=True,
        ),
    ]
