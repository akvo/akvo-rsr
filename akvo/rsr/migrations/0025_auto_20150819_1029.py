# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0024_auto_20150817_1120'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='partnership',
            options={'ordering': ['iati_organisation_role'], 'verbose_name': 'project partner', 'verbose_name_plural': 'project partners'},
        ),
        migrations.AddField(
            model_name='partnership',
            name='iati_organisation_role',
            field=models.PositiveSmallIntegerField(db_index=True, null=True, verbose_name='Organisation role', choices=[(1, 'Funding partner'), (2, 'Accountable partner'), (3, 'Extending partner'), (4, 'Implementing partner'), (100, 'Sponsor partner')]),
            preserve_default=True,
        ),
    ]
