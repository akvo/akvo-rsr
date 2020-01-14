# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0033_unique_iati_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='iati_activity_id',
            field=akvo.rsr.fields.ValidXMLCharField(null=True, max_length=100, blank=True, help_text='This should be the official unique IATI Identifier for the project. The identifier consists of the IATI organisation identifier and the (organisations internal) project identifier, e.g. NL-KVK-31156201-TZ1234. (100 characters)<br>Note that \'projects\' in this form are the same as \'activities\' in IATI.<br><a href="http://iatistandard.org/activity-standard/iati-activities/iati-activity/iati-identifier" target="_blank">How to create</a>', unique=True, verbose_name='IATI Project Identifier', db_index=True),
            preserve_default=True,
        ),
    ]
