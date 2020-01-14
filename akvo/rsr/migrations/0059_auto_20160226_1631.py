# -*- coding: utf-8 -*-


from django.db import models, migrations


def move_document_categories(apps, schema_editor):
    """
    Moves the project document categories into its' own model.
    """
    ProjectDocument = apps.get_model('rsr', 'ProjectDocument')
    ProjectDocumentCategory = apps.get_model('rsr', 'ProjectDocumentCategory')

    for doc in ProjectDocument.objects.all():
        if doc.category:
            ProjectDocumentCategory.objects.create(document=doc, category=doc.category)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0058_auto_20160226_1623'),
    ]

    operations = [
        migrations.RunPython(
            move_document_categories
        ),
    ]
