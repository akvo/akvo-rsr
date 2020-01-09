# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0016_auto_20150721_1343'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnership',
            name='partner_type',
            field=akvo.rsr.fields.ValidXMLCharField(choices=[('field', 'Implementing partner'), ('funding', 'Funding partner'), ('sponsor', 'Sponsor partner'), ('support', 'Accountable partner'), ('extending', 'Extending partner')], max_length=9, blank=True, help_text='Select the role that the organisation is taking within the project.', verbose_name='partner type', db_index=True),
            preserve_default=True,
        ),
    ]
