# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0104_auto_20170816_1701'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndicatorDimension',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(help_text='The name of a category to be used when disaggregating (e.g "Age")', max_length=100, verbose_name='dimension name', blank=True)),
                ('value', akvo.rsr.fields.ValidXMLCharField(help_text='A value in the category being disaggregated (e.g. "Older than 60 years").', max_length=100, verbose_name='dimension value', blank=True)),
                ('indicator', models.ForeignKey(related_name='dimensions', verbose_name='indicator', to='rsr.Indicator')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'indicator dimension',
                'verbose_name_plural': 'indicator dimensions',
            },
            bases=(models.Model,),
        ),
    ]
