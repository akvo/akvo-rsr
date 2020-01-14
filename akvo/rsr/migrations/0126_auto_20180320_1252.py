# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.validators


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0125_auto_20180315_0829'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnersite',
            name='hostname',
            field=models.CharField(help_text='<p>Your hostname is used in the default web address of your Akvo page. The web address created from  the hostname <em>myorganisation</em> would be <em>http://myorganisation.akvoapp.org/</em>.</p>', unique=True, max_length=50, verbose_name='hostname', validators=[akvo.rsr.validators.hostname_validator]),
            preserve_default=True,
        ),
    ]
