# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0048_auto_20160119_1347'),
    ]

    operations = [
        migrations.AlterField(
            model_name='iatiimportjob',
            name='status',
            field=models.PositiveSmallIntegerField(default=10, verbose_name='status', choices=[(10, 'pending'), (12, 'in progress'), (11, 'retrieving'), (13, 'completed'), (14, 'cancelled'), (15, 'no changes')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='iatiimportlog',
            name='message_type',
            field=models.PositiveSmallIntegerField(default=30, verbose_name='type of message', choices=[(1, 'create action'), (2, 'update action'), (3, 'delete action'), (10, 'status pending'), (11, 'status retrieving'), (12, 'status in progress'), (13, 'status complete'), (14, 'status cancelled'), (15, 'status no changes'), (20, 'information'), (30, 'critical error'), (21, 'value not saved'), (22, 'value partly saved')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='current_image_caption',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Briefly describe who or what you see in the photo.', max_length=60, verbose_name='photo caption', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='current_image_credit',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Enter who took the photo.', max_length=60, verbose_name='photo credit', blank=True),
            preserve_default=True,
        ),
    ]
