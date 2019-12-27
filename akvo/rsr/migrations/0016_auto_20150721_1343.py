# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0015_auto_20150714_0854'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrganisationCustomField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(help_text='(max 255 characters)', max_length=255, verbose_name='name')),
                ('section', models.IntegerField(help_text='Select the section of the admin where the custom field should be displayed', verbose_name='admin section', choices=[(1, '01 - General information'), (2, '02 - Contact information'), (3, '03 - Project partners'), (4, '04 - Project descriptions'), (5, '05 - Results and indicators'), (6, '06 - Finance'), (7, '07 - Project locations'), (8, '08 - Project focus'), (9, '09 - Links and documents'), (10, '10 - Project comments')])),
                ('max_characters', models.IntegerField(help_text='Set the maximum amount of characters that the user is allowed to fill in. This needs to be a positive number, unless there is no character limit, then use 0.', verbose_name='maximum characters')),
                ('help_text', akvo.rsr.fields.ValidXMLTextField(help_text='The help text to be displayed with the field in the admin. Leave empty if there is no need for a help text. (max 1000 characters)', max_length=1000, verbose_name='help text', blank=True)),
                ('organisation', models.ForeignKey(related_name='custom_fields', verbose_name='organisation', to='rsr.Organisation')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProjectCustomField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(help_text='(max 255 characters)', max_length=255, verbose_name='name')),
                ('section', models.IntegerField(help_text='Select the section of the admin where the custom field should be displayed', verbose_name='admin section', choices=[(1, '01 - General information'), (2, '02 - Contact information'), (3, '03 - Project partners'), (4, '04 - Project descriptions'), (5, '05 - Results and indicators'), (6, '06 - Finance'), (7, '07 - Project locations'), (8, '08 - Project focus'), (9, '09 - Links and documents'), (10, '10 - Project comments')])),
                ('max_characters', models.IntegerField(help_text='Set the maximum amount of characters that the user is allowed to fill in. This needs to be a positive number, unless there is no character limit, then use 0.', verbose_name='maximum characters')),
                ('help_text', akvo.rsr.fields.ValidXMLTextField(help_text='The help text to be displayed with the field in the admin. Leave empty if there is no need for a help text. (max 1000 characters)', max_length=1000, verbose_name='help text', blank=True)),
                ('value', akvo.rsr.fields.ValidXMLTextField(verbose_name='value', blank=True)),
                ('project', models.ForeignKey(related_name='custom_fields', verbose_name='project', to='rsr.Project')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='customfield',
            name='project',
        ),
        migrations.DeleteModel(
            name='CustomField',
        ),
        migrations.AddField(
            model_name='user',
            name='show_admin_help',
            field=models.BooleanField(default=True, verbose_name='Show help text in project admin'),
            preserve_default=True,
        ),
    ]
