# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-10-15 03:25
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0189_indicatordisaggregationtarget'),
    ]

    operations = [
        migrations.RunSQL(
            '''
            CREATE INDEX IF NOT EXISTS django_admin_log_content_id_object_id
                ON public.django_admin_log USING btree (object_id, content_type_id);
            ''',
            reverse_sql='DROP INDEX django_admin_log_content_id_object_id;',
        ),
    ]
