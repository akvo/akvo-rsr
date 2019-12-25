# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function

from django.db import models, migrations

MANDATORY_ACTION = 1


def make_link_url_mandatory(apps, schema_editor):
    ProjectEditorValidationSet = apps.get_model('rsr', 'ProjectEditorValidationSet')
    ProjectEditorValidation = apps.get_model('rsr', 'ProjectEditorValidation')

    validation_set = ProjectEditorValidationSet.objects.get(name__iexact='rsr')
    ProjectEditorValidation.objects.get_or_create(
        validation_set=validation_set,
        validation='rsr_link.url',
        action=MANDATORY_ACTION
    )


def delete_links_without_url(apps, schema_editor):
    Link = apps.get_model('rsr', 'Link')
    links = Link.objects.filter(url='')
    print('Deleting {} links without a url'.format(links.count()))
    links.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0107_auto_20170913_0904'),
    ]

    operations = [
        migrations.RunPython(delete_links_without_url, reverse_code=lambda x, y: None),
        migrations.AlterField(
            model_name='link',
            name='url',
            field=models.URLField(help_text="Enter the link to an external website you wish to redirect to from your project page. The URL should start with 'http://' or 'https://'.", verbose_name='link url'),
            preserve_default=True,
        ),
        migrations.RunPython(make_link_url_mandatory, reverse_code=lambda x, y: None),
    ]
