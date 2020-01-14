# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0067_auto_20160412_1858'),
    ]

    operations = [
        migrations.CreateModel(
            name='IatiCheck',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.PositiveSmallIntegerField(verbose_name='status')),
                ('description', akvo.rsr.fields.ValidXMLTextField(verbose_name='description')),
                ('project', models.ForeignKey(related_name='iati_checks', verbose_name='project', to='rsr.Project')),
            ],
            options={
                'verbose_name': 'IATI check',
                'verbose_name_plural': 'IATI checks',
            },
            bases=(models.Model,),
        ),
    ]
