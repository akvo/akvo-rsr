# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0131_userprojects'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='default_aid_type_vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'1', choices=[('1', '1 - OECD DAC'), ('2', '2 - Earmarking Category'), ('3', '3 - Earmarking Modality')], max_length=1, blank=True, help_text='This is the IATI identifier for the type of vocabulary being used for describing the type of the aid being supplied or activity being undertaken. For reference, please visit: <a href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target="_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.', verbose_name='default aid type vocabulary'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='default_aid_type',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='This is the IATI identifier for the type of aid being supplied or activity being undertaken. This element specifies a default for all the project\u2019s financial transactions. This can be overridden at the individual transaction level. For reference, please visit: <a href="http://iatistandard.org/202/codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/AidType/</a>.', max_length=3, verbose_name='default aid type', blank=True),
            preserve_default=True,
        ),
    ]
