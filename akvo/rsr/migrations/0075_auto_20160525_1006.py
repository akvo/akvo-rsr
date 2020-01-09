# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0074_auto_20160526_0938'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='iati_status',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, choices=[('1', '1 - Pipeline/identification'), ('2', '2 - Implementation'), ('3', '3 - Completion'), ('4', '4 - Post-completion'), ('5', '5 - Cancelled'), ('6', '6 - Suspended')], max_length=1, help_text='There are six different project statuses:<br/>1) Pipeline/identification: the project is being scoped or planned<br/>2) Implementation: the project is currently being implemented<br/>3) Completion: the project is complete or the final disbursement has been made<br/>4) Post-completion: the project is complete or the final disbursement has been made, but the project remains open pending financial sign off or M&E<br/>5) Cancelled: the project has been cancelled<br/>6) Suspended: the project has been temporarily suspended or the reporting partner no longer uses RSR.', verbose_name='status', db_index=True),
            preserve_default=True,
        ),
    ]
