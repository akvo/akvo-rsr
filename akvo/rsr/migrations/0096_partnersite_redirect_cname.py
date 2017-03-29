# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0095_auto_20170309_0901'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnersite',
            name='redirect_cname',
            field=models.BooleanField(default=False, help_text="Indicate if we should redirect to the Hostname when the request is made to the CNAME. This is for sites that don't yet have a valid TLS certificate for the CNAME."),
            preserve_default=True,
        ),
    ]
