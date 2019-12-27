# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0006_auto_20150506_1245'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnersite',
            name='all_maps',
            field=models.BooleanField(default=False, verbose_name='Show all projects, updates and organisations on the maps.'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='new_organisation_type',
            field=models.IntegerField(default=22, help_text='Check that this field is set to an organisation type that matches your organisation.', db_index=True, verbose_name='IATI organisation type', choices=[(10, '10 - Government'), (15, '15 - Other Public Sector'), (21, '21 - International NGO'), (22, '22 - National NGO'), (23, '23 - Regional NGO'), (30, '30 - Public Private Partnership'), (40, '40 - Multilateral'), (60, '60 - Foundation'), (70, '70 - Private Sector'), (80, '80 - Academic, Training and Research')]),
            preserve_default=True,
        ),
    ]
