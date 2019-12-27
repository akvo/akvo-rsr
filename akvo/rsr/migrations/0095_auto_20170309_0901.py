# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0094_auto_20170220_1510'),
    ]

    operations = [
        migrations.AlterField(
            model_name='keyword',
            name='label',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Select keywords in case you are using an Akvo Page. Keywords linked to a project will determine if a project appears on the Akvo Page or not.', unique=True, max_length=100, verbose_name='label', db_index=True),
            preserve_default=True,
        ),
    ]
