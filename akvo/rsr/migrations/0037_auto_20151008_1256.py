# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0036_auto_20151016_1222'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisation',
            name='can_create_projects',
            field=models.BooleanField(default=False, help_text='Partner editors of this organisation can create new projects, and publish projects it is a partner of.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='partnership',
            name='is_secondary_reporter',
            field=models.NullBooleanField(help_text='This indicates whether the reporting organisation is a secondary publisher: publishing data for which it is not directly responsible.', verbose_name='secondary reporter'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnership',
            name='iati_organisation_role',
            field=models.PositiveSmallIntegerField(db_index=True, null=True, verbose_name='Organisation role', choices=[(1, 'Funding partner'), (2, 'Accountable partner'), (3, 'Extending partner'), (4, 'Implementing partner'), (100, 'Sponsor partner'), (101, 'Reporting organisation')]),
            preserve_default=True,
        ),
    ]
