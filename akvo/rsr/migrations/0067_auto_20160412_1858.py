# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0066_auto_20160329_1042'),
    ]

    operations = [
        migrations.CreateModel(
            name='IatiActivityExport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(db_index=True, auto_now_add=True, null=True)),
                ('last_modified_at', models.DateTimeField(db_index=True, auto_now=True, null=True)),
                ('status', models.PositiveSmallIntegerField(default=1, verbose_name='status')),
                ('iati_export', models.ForeignKey(related_name='iati_activity_exports', to='rsr.IatiExport')),
                ('project', models.ForeignKey(related_name='iati_project_exports', verbose_name='project', to='rsr.Project', null=True)),
            ],
            options={
                'verbose_name': 'IATI activity export',
                'verbose_name_plural': 'IATI activity exports',
            },
            bases=(models.Model,),
        ),
        migrations.AlterModelOptions(
            name='organisationdocumentcountry',
            options={'ordering': ['-id'], 'verbose_name': 'document country', 'verbose_name_plural': 'document countries'},
        ),
        migrations.AlterField(
            model_name='iatiexport',
            name='version',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'2.02', max_length=4, verbose_name='version'),
            preserve_default=True,
        ),
    ]
