# -*- coding: utf-8 -*-


from django.db import models, migrations


# Convert old rsr statuses to equivalent iati status codes
# See http://iatistandard.org/202/codelists/ActivityStatus/
STATUS_TO_CODE = {
    'N': '',
    'H': '1',
    'A': '2',
    'C': '3',
    'L': '5',
    'R': '3'
}

# Some 'Archived' projects should be mapped to either 'None' or 'Cancelled'.
# Otherwise, 'Archived' projects use the regular mapping (to 'Completion').
SPECIAL_ARCHIVED_MAPPING = {
    18: '5',
    31: '',
    33: '',
    34: '',
    35: '',
    37: '',
    44: '5',
    45: '5',
    52: '5',
    66: '',
    81: '5',
    83: '5',
    84: '5',
    85: '5',
    86: '5',
    87: '5',
    88: '5',
    89: '5',
    90: '5',
    91: '5',
    92: '5',
    93: '5',
    95: '5',
    96: '5',
    97: '5',
    98: '5',
    99: '5',
    100: '5',
    103: '5',
    109: '5',
    110: '5',
    111: '5',
    114: '5',
    117: '5',
    118: '5',
    119: '',
    122: '5',
    123: '5',
    124: '5',
    125: '5',
    126: '5',
    127: '5',
    132: '',
    144: '5',
    156: '',
    159: '',
    160: '',
    173: '',
    176: '',
    177: '5',
    200: '5',
    234: '',
    271: '5',
    279: '',
    280: '',
    281: '',
    283: '',
    455: '',
    308: '',
    309: '',
    1010: '',
}


def populate_iati_status(apps, schema_editor):
    """
    Update new field with existing values. If a project is mentioned in the special mapping and
    this project has the status 'Archived' (this is a double-check), then use the special mapping.

    Otherwise, the regular mapping of STATUS_TO_CODE is applied.
    """
    Project = apps.get_model('rsr', 'Project')
    for p in Project.objects.all():
        if p.id in SPECIAL_ARCHIVED_MAPPING and p.status == 'R':
            p.iati_status = SPECIAL_ARCHIVED_MAPPING[p.id]
            p.save()
        else:
            p.iati_status = STATUS_TO_CODE[p.status]
            p.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0075_auto_20160525_1006'),
    ]

    operations = [
        migrations.RunPython(populate_iati_status, populate_iati_status),
        migrations.RunSQL(
            "UPDATE rsr_projecteditorvalidation SET validation = 'rsr_project.iati_status' "
            "WHERE validation = 'rsr_project.status';",
            "UPDATE rsr_projecteditorvalidation SET validation = 'rsr_project.status' "
            "WHERE validation = 'rsr_project.iati_status';"
        )
    ]
