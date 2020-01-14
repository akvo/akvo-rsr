# -*- coding: utf-8 -*-


from django.db import models, migrations


def types_to_roles(apps, schema_editor):
    from akvo.rsr.models import Partnership as ps
    Partnership = apps.get_model("rsr", "Partnership")
    partnerships = Partnership.objects.all()
    for partnership in partnerships:
        if partnership.partner_type:
            partnership.iati_organisation_role = ps.PARTNER_TYPES_TO_ROLES_MAP[
                partnership.partner_type
            ]
            partnership.save()

class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0028_auto_20150820_0251'),
    ]

    operations = [
        migrations.RunPython(
            types_to_roles,
        ),
    ]
