# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0021_auto_20150813_1426'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisationcustomfield',
            name='order',
            field=models.PositiveSmallIntegerField(default=1, help_text='The order of the fields as they will be displayed in the project editor. Must be a positive number, and the lowest number will be shown on top.', verbose_name='order'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='organisationcustomfield',
            name='type',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'text', help_text='Select the type of custom field. Text will show a text area in the project editor, and checkbox will show a checkbox.', max_length=20, verbose_name='type', choices=[(b'text', 'Text'), (b'boolean', 'Checkbox')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectcustomfield',
            name='order',
            field=models.PositiveSmallIntegerField(default=1, help_text='The order of the fields as they will be displayed in the project editor. Must be a positive number, and the lowest number will be shown on top.', verbose_name='order'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='projectcustomfield',
            name='type',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'text', help_text='Select the type of custom field. Text will show a text area in the project editor, and checkbox will show a checkbox.', max_length=20, verbose_name='type', choices=[(b'text', 'Text'), (b'boolean', 'Checkbox')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationcustomfield',
            name='max_characters',
            field=models.IntegerField(help_text='Set the maximum amount of characters that the user is allowed to fill in. Leave empty or fill in 0 if there is no character limit.', null=True, verbose_name='maximum characters', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectcustomfield',
            name='max_characters',
            field=models.IntegerField(help_text='Set the maximum amount of characters that the user is allowed to fill in. Leave empty or fill in 0 if there is no character limit.', null=True, verbose_name='maximum characters', blank=True),
            preserve_default=True,
        ),
    ]
