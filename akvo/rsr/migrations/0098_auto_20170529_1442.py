# -*- coding: utf-8 -*-


from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0097_partnersite_redirect_cname'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicatorperioddata',
            name='approved_by',
            field=models.ForeignKey(related_name='approved_period_updates', verbose_name='approved by', blank=True, to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='user',
            field=models.ForeignKey(related_name='created_period_updates', verbose_name='user', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
