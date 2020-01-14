# -*- coding: utf-8 -*-


from django.db import migrations

def empty_iati_import(apps, schema_editor):
    IatiImport = apps.get_model('rsr', 'IatiImport')
    iati_import = IatiImport.objects.all()
    iati_import.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0045_auto_20151209_0632'),
    ]

    operations = [
        migrations.RunPython(empty_iati_import),
    ]
