# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def aggregate_donations(apps, schema_editor):
    # We can't import the models directly as they may be a newer version than
    # this migration expects. We use the historical versions.
    Project = apps.get_model("rsr", "Project")
    Invoice = apps.get_model("rsr", "Invoice")

    for project in Project.objects.all():
        STATUS_COMPLETE = 3
        project_invoices = Invoice.objects.filter(project__exact=project.id)
        completed_invoices = project_invoices.filter(status__exact=STATUS_COMPLETE).exclude(test=True)
        donations = completed_invoices.aggregate(models.Sum('amount_received'))['amount_received__sum']
        if donations is not None:
            project.donations = donations
            project.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0084_auto_20160920_1045'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='donate_button',
        ),
        migrations.AddField(
            model_name='project',
            name='donate_url',
            field=models.URLField(help_text='Add a donation url for this project. If no URL is added, it is not possible to donate to this project through RSR.', null=True, verbose_name='donate url', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='project',
            name='donations',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=14, blank=True, help_text='The total sum of donations the project has already recieved.', null=True, db_index=True),
            preserve_default=True,
        ),
        # Reverse migrations don't work by default if there's no reverse_code
        migrations.RunPython(aggregate_donations, reverse_code=lambda x, y: None)
    ]
