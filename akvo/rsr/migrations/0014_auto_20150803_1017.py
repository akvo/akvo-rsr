# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


def unique_organisation_names(apps, schema_editor):
    """Make sure that the organisation.name and organisation.long_name are unique."""
    Organisation = apps.get_model('rsr', 'Organisation')

    org_double_name = {}
    org_double_long_name = {}

    for organisation in Organisation.objects.all():
        org_names = Organisation.objects.filter(name=organisation.name)
        if org_names.count() > 1 and organisation.name not in org_double_name:
            org_double_name[organisation.name] = org_names

        org_long_names = Organisation.objects.filter(long_name=organisation.long_name)
        if org_long_names.count() > 1 and organisation.long_name not in org_double_long_name:
            org_double_long_name[organisation.long_name] = org_long_names

    for double_name in org_double_name:
        org_qs = org_double_name[double_name]
        for i, org in enumerate(org_qs):
            if not i == 0:
                if len(org.name) > 21:
                    org.name = org.name[:-4] + u' (' + unicode(i + 1) + u')'
                else:
                    org.name += u' (' + unicode(i + 1) + u')'
                org.save()

    for double_long_name in org_double_long_name:
        org_ln_qs = org_double_long_name[double_long_name]
        for j, org in enumerate(org_ln_qs):
            if not j == 0:
                if len(org.long_name) > 71:
                    org.long_name = org.long_name[:-4] + u' (' + unicode(j + 1) + u')'
                else:
                    org.long_name += u' (' + unicode(j + 1) + u')'
                org.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0013_auto_20150803_0905'),
    ]

    operations = [
        migrations.RunPython(
            unique_organisation_names
        ),
        migrations.AlterField(
            model_name='organisation',
            name='long_name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Full name of organisation (75 characters).', unique=True, max_length=75, verbose_name='long name', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Short name which will appear in organisation and partner listings (25 characters).', unique=True, max_length=25, verbose_name='name', db_index=True),
            preserve_default=True,
        ),
    ]
