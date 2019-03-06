# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0139_auto_20181127_1252'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='administrativelocation',
            options={'ordering': ('pk',), 'verbose_name': 'location administrative', 'verbose_name_plural': 'location administratives'},
        ),
        migrations.AlterModelOptions(
            name='budgetitem',
            options={'ordering': ('pk',), 'verbose_name': 'budget item', 'verbose_name_plural': 'budget items'},
        ),
        migrations.AlterModelOptions(
            name='countrybudgetitem',
            options={'ordering': ('pk',), 'verbose_name': 'country budget item', 'verbose_name_plural': 'country budget items'},
        ),
        migrations.AlterModelOptions(
            name='crsadd',
            options={'ordering': ('pk',), 'verbose_name': 'CRS reporting', 'verbose_name_plural': 'CRS reporting'},
        ),
        migrations.AlterModelOptions(
            name='crsaddotherflag',
            options={'ordering': ('pk',), 'verbose_name': 'CRS other flag', 'verbose_name_plural': 'CRS other flags'},
        ),
        migrations.AlterModelOptions(
            name='disaggregation',
            options={'ordering': ('id',), 'verbose_name': 'disaggregated value', 'verbose_name_plural': 'disaggregated values'},
        ),
        migrations.AlterModelOptions(
            name='fss',
            options={'ordering': ('pk',), 'verbose_name': 'FSS', 'verbose_name_plural': 'FSS'},
        ),
        migrations.AlterModelOptions(
            name='fssforecast',
            options={'ordering': ('pk',), 'verbose_name': 'FSS forecast', 'verbose_name_plural': 'FSS forecasts'},
        ),
        migrations.AlterModelOptions(
            name='humanitarianscope',
            options={'ordering': ('pk',), 'verbose_name': 'humanitarian scope', 'verbose_name_plural': 'humanitarian scopes'},
        ),
        migrations.AlterModelOptions(
            name='iatiexport',
            options={'ordering': ('id',), 'verbose_name': 'IATI export', 'verbose_name_plural': 'IATI exports'},
        ),
        migrations.AlterModelOptions(
            name='indicatorperiodactualdimension',
            options={'ordering': ('pk',), 'verbose_name': 'indicator period actual dimension', 'verbose_name_plural': 'indicator period actual dimensions'},
        ),
        migrations.AlterModelOptions(
            name='indicatorperiodactuallocation',
            options={'ordering': ('pk',), 'verbose_name': 'indicator period actual location', 'verbose_name_plural': 'indicator period actual locations'},
        ),
        migrations.AlterModelOptions(
            name='indicatorperiodtargetdimension',
            options={'ordering': ('pk',), 'verbose_name': 'indicator period target dimension', 'verbose_name_plural': 'indicator period target dimensions'},
        ),
        migrations.AlterModelOptions(
            name='indicatorperiodtargetlocation',
            options={'ordering': ('pk',), 'verbose_name': 'indicator period target location', 'verbose_name_plural': 'indicator period target locations'},
        ),
        migrations.AlterModelOptions(
            name='indicatorreference',
            options={'ordering': ('pk',), 'verbose_name': 'indicator reference', 'verbose_name_plural': 'indicator references'},
        ),
        migrations.AlterModelOptions(
            name='legacydata',
            options={'ordering': ('pk',), 'verbose_name': 'legacy data', 'verbose_name_plural': 'legacy data'},
        ),
        migrations.AlterModelOptions(
            name='link',
            options={'ordering': ('pk',), 'verbose_name': 'link', 'verbose_name_plural': 'links'},
        ),
        migrations.AlterModelOptions(
            name='narrativereport',
            options={'ordering': ('id',), 'verbose_name': 'narrative report', 'verbose_name_plural': 'narrative reports'},
        ),
        migrations.AlterModelOptions(
            name='planneddisbursement',
            options={'ordering': ('pk',), 'verbose_name': 'planned disbursement', 'verbose_name_plural': 'planned disbursements'},
        ),
        migrations.AlterModelOptions(
            name='policymarker',
            options={'ordering': ('pk',), 'verbose_name': 'policy marker', 'verbose_name_plural': 'policy markers'},
        ),
        migrations.AlterModelOptions(
            name='projectcondition',
            options={'ordering': ('pk',), 'verbose_name': 'condition', 'verbose_name_plural': 'conditions'},
        ),
        migrations.AlterModelOptions(
            name='projectcontact',
            options={'ordering': ('id',), 'verbose_name': 'contact', 'verbose_name_plural': 'contacts'},
        ),
        migrations.AlterModelOptions(
            name='recipientregion',
            options={'ordering': ('pk',), 'verbose_name': 'recipient region', 'verbose_name_plural': 'recipient regions'},
        ),
        migrations.AlterModelOptions(
            name='transaction',
            options={'ordering': ('pk',), 'verbose_name': 'transaction', 'verbose_name_plural': 'transactions'},
        ),
        migrations.AlterModelOptions(
            name='transactionsector',
            options={'ordering': ('pk',), 'verbose_name': 'transaction sector', 'verbose_name_plural': 'transaction sectors'},
        ),
        migrations.AlterField(
            model_name='loginlog',
            name='email',
            field=models.EmailField(max_length=75, verbose_name='user email'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectcontact',
            name='email',
            field=models.EmailField(max_length=75, verbose_name='contact email', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of his/her group.', verbose_name='groups'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='user',
            name='last_login',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='last login'),
            preserve_default=True,
        ),
    ]
