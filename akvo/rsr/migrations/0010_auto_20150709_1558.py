# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


def null_locations(apps, schema_editor):
    Project = apps.get_model("rsr", "Project")
    Organisation = apps.get_model("rsr", "Organisation")
    ProjectUpdate = apps.get_model("rsr", "ProjectUpdate")
    ProjectLocation = apps.get_model("rsr", "ProjectLocation")
    OrganisationLocation = apps.get_model("rsr", "OrganisationLocation")
    ProjectUpdateLocation = apps.get_model("rsr", "ProjectUpdateLocation")

    test_project = Project.objects.get(pk=2)
    test_organisation = Organisation.objects.get(pk=832)
    test_update = ProjectUpdate.objects.get(pk=7)

    for null_project_location in ProjectLocation.objects.filter(location_target=None):
        null_project_location.location_target = test_project
        null_project_location.save()

    for null_org_location in OrganisationLocation.objects.filter(location_target=None):
        null_org_location.location_target = test_organisation
        null_org_location.save()

    for null_update_location in ProjectUpdateLocation.objects.filter(location_target=None):
        null_update_location.location_target = test_update
        null_update_location.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0009_auto_20150528_1413'),
    ]

    operations = [
        migrations.RunPython(
            null_locations,
        ),

        migrations.RemoveField(
            model_name='project',
            name='project_rating',
        ),
        migrations.AlterField(
            model_name='budgetitem',
            name='amount',
            field=models.DecimalField(null=True, verbose_name='amount', max_digits=10, decimal_places=2),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='budgetitem',
            name='label',
            field=models.ForeignKey(verbose_name='project budget', to='rsr.BudgetItemLabel', help_text="Select the budget item. Use the 'Other' fields to custom budget items.", null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='link',
            name='caption',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=50, verbose_name='caption', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='link',
            name='kind',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'E', max_length=1, verbose_name='kind', choices=[(b'A', 'Akvopedia entry'), (b'E', 'External link')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='link',
            name='url',
            field=models.URLField(verbose_name='URL', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='can_become_reporting',
            field=models.BooleanField(default=False, help_text='Organisation is allowed to become a reporting organisation. Can be set by superusers.', verbose_name='Reportable'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The main language of the organisation', max_length=2, verbose_name='language', choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='country',
            field=models.ForeignKey(verbose_name='country', to='rsr.Country', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=0, help_text="Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> to get the decimal coordinates of your project.", null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='location_target',
            field=models.ForeignKey(related_name='locations', to='rsr.Organisation'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=0, help_text="Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> to get the decimal coordinates of your project.", null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnership',
            name='organisation',
            field=models.ForeignKey(related_name='partnerships', verbose_name='organisation', to='rsr.Organisation', help_text='Select an organisation that is taking an active role in the project.', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnership',
            name='partner_type',
            field=akvo.rsr.fields.ValidXMLCharField(choices=[('field', 'Field partner'), ('funding', 'Funding partner'), ('sponsor', 'Sponsor partner'), ('support', 'Support partner')], max_length=8, blank=True, help_text='Select the role that the organisation is taking within the project.', verbose_name='partner type', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='default_language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', max_length=5, verbose_name='Site UI default language', choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='goals_overview',
            field=akvo.rsr.fields.ProjectLimitedTextField(help_text='Provide a brief description of the overall project goals. (600 characters)', verbose_name='goals overview', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The main language of the project.', max_length=2, choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='partners',
            field=models.ManyToManyField(related_name='projects', verbose_name='partners', to='rsr.Organisation', through='rsr.Partnership', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='project_plan_summary',
            field=akvo.rsr.fields.ProjectLimitedTextField(help_text='Enter a brief summary. The summary should explain: (400 characters)<br>- Why the project is being carried out;<br>- Where it is taking place;<br>- Who will benefit and/or participate;<br>- What it specifically hopes to accomplish;<br>- How those specific goals will be reached', verbose_name='summary of project plan', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='subtitle',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The title and subtitle fields are the newspaper headline for your project. Use them to attract attention to what you are doing. (75 characters)', max_length=75, verbose_name='subtitle', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='sustainability',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Describe plans for sustaining/maintaining results after implementation is complete. (unlimited)', verbose_name='sustainability', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The title and subtitle fields are the newspaper headline for your project. Use them to attract attention to what you are doing. (45 characters)', max_length=45, verbose_name='title', db_index=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='country',
            field=models.ForeignKey(verbose_name='country', to='rsr.Country', help_text='Select the country.', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=0, help_text="Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> to get the decimal coordinates of your project.", null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='location_target',
            field=models.ForeignKey(related_name='locations', to='rsr.Project'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=0, help_text="Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> to get the decimal coordinates of your project.", null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdate',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The language of the update', max_length=2, choices=[(b'en', b'English'), (b'es', b'Spanish'), (b'fr', b'French')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=0, help_text="Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> to get the decimal coordinates of your project.", null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='location_target',
            field=models.ForeignKey(related_name='locations', to='rsr.ProjectUpdate'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=0, help_text="Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> to get the decimal coordinates of your project.", null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='relatedproject',
            name='relation',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text="The relation between a project and related project. (E.g. select the 'Parent' relation when the selected project here is the parent of this project).", max_length=1, verbose_name='relation', choices=[('1', '1 - Parent'), ('2', '2 - Child'), ('3', '3 - Sibling'), ('4', '4 - Co-funded'), ('5', '5 - Third Party')]),
            preserve_default=True,
        ),
    ]
