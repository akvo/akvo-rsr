# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0132_auto_20180719_1948'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='aid_type_vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'1', choices=[('1', '1 - OECD DAC'), ('2', '2 - Earmarking Category'), ('3', '3 - Earmarking Modality')], max_length=1, blank=True, help_text='Enter the type of vocabulary being used to describe the aid type For reference, please visit: <a href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target="_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.', verbose_name='transaction aid type vocabulary'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='aid_type',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Enter the type of aid being supplied. For reference, please visit: <a href="http://iatistandard.org/202/codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/AidType/</a>.', max_length=3, verbose_name='transaction aid type', blank=True),
            preserve_default=True,
        ),
    ]
