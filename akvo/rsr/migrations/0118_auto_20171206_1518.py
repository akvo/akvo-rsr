# -*- coding: utf-8 -*-


from django.db import models, migrations
import django.db.models.deletion
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0117_auto_20171201_0913'),
    ]

    operations = [
        migrations.CreateModel(
            name='NarrativeReport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', akvo.rsr.fields.ValidXMLTextField(help_text='The text of the narrative report.', verbose_name='narrative report text', blank=True)),
                ('published', models.BooleanField(default=False, verbose_name='locked')),
                ('period_start', models.DateField(help_text='The start date of the reporting period for this narrative report.', verbose_name='period start')),
                ('period_end', models.DateField(help_text='The end date of the reporting period for this narrative report.', verbose_name='period end')),
                ('category', models.ForeignKey(related_name='narrative_reports', on_delete=django.db.models.deletion.PROTECT, verbose_name='category', to='rsr.OrganisationIndicatorLabel')),
                ('project', models.ForeignKey(related_name='narrative_reports', verbose_name='project', to='rsr.Project')),
            ],
            options={
                'verbose_name': 'narrative report',
                'verbose_name_plural': 'narrative reports',
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='narrativereport',
            unique_together=set([('project', 'category', 'period_start', 'period_end')]),
        ),
    ]
