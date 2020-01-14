# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0034_auto_20150916_1402'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisation',
            name='iati_org_id',
            field=akvo.rsr.fields.ValidXMLCharField(null=True, default=None, max_length=75, blank=True, unique=True, verbose_name='IATI organisation ID', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='long_name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Full name of organisation (75 characters).', unique=True, max_length=75, verbose_name='long name', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='organisation_type',
            field=akvo.rsr.fields.ValidXMLCharField(choices=[(b'N', 'NGO'), (b'G', 'Governmental'), (b'C', 'Commercial'), (b'K', 'Knowledge institution')], max_length=1, blank=True, null=True, verbose_name='organisation type', db_index=True),
            preserve_default=True,
        ),
    ]
