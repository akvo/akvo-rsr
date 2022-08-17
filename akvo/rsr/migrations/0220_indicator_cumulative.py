# Generated by Django 3.2.10 on 2022-08-16 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0219_iatiactivityvalidationjob_iatiorganisationvalidationjob'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='cumulative',
            field=models.BooleanField(default=False, help_text='Select if indicators report a running total so that each reported actual includes the previously reported actual and adds any progress made since the last reporting period.', verbose_name='cumulative'),
        ),
    ]
