# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0019_auto_20150727_1508'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='donate_button',
            field=models.BooleanField(default=False, help_text='Show donate button for this project. If not selected, it is not possible to donate to this project and the donate button will not be shown.', verbose_name='donate button'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The main language of the project.', max_length=2, blank=True, choices=[(b'de', 'German'), (b'en', 'English'), (b'es', 'Spanish'), (b'fr', 'French'), (b'nl', 'Dutch'), (b'ru', 'Russian')]),
            preserve_default=True,
        ),
    ]
