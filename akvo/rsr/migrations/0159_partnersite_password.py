# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2019-07-19 12:06


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0158_indicator_period_data_on_delete_protect'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnersite',
            name='password',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='password'),
        ),
    ]
