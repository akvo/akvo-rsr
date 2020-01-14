# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0010_auto_20150615_1149'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisation',
            name='can_become_reporting',
            field=models.BooleanField(default=False, help_text='Organisation is allowed to become a reporting organisation. Can be set by superusers.', verbose_name='Reportable'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The main language of the organisation', max_length=2, verbose_name='language', choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='default_language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', max_length=5, verbose_name='Site UI default language', choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The main language of the project.', max_length=2, choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdate',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The language of the update', max_length=2, choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdate',
            name='title',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='80 characters', max_length=80, verbose_name='title', db_index=True),
            preserve_default=True,
        ),
    ]
