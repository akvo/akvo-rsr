# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0034_auto_20150916_1402'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisation',
            name='organisation_type',
            field=akvo.rsr.fields.ValidXMLCharField(choices=[(b'N', 'NGO'), (b'G', 'Governmental'), (b'C', 'Commercial'), (b'K', 'Knowledge institution')], max_length=1, blank=True, null=True, verbose_name='organisation type', db_index=True),
            preserve_default=True,
        ),
    ]
