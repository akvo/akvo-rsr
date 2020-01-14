# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0068_iaticheck'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='background',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='This should describe the geographical, political, environmental, social and/or cultural context of the project, and any related activities that have already taken place or are underway. For links and styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.', verbose_name='background', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='current_status',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Describe the situation at the start of the project. For links and styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.', verbose_name='baseline situation', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='goals_overview',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Provide a brief description of the overall project goals. For links and styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.', verbose_name='goals overview', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='project_plan',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Detailed information about the implementation of the project: the what, how, who and when. For links and styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.', verbose_name='project plan', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='sustainability',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Describe how you aim to guarantee sustainability of the project until 10 years after project implementation. Think about the institutional setting, capacity-building, a cost recovery plan, products used, feasible arrangements for operation and maintenance, anticipation of environmental impact and social integration. For links and styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.', verbose_name='sustainability', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='target_group',
            field=akvo.rsr.fields.ProjectLimitedTextField(help_text='This should include information about the people, organisations or resources that are being impacted by this project. For links and styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.', verbose_name='target group', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectdocument',
            name='title',
            field=akvo.rsr.fields.ValidXMLCharField(default='Untitled document', help_text='Enter the title of your document.', max_length=100, verbose_name='document title', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='activity_description',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A description that qualifies the activity taking place at the location. This should not duplicate information provided in the main activity description, and should typically be used to distinguish between activities at multiple locations within a single iati-activity record.', max_length=2000, verbose_name='activity description', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='description',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='This provides free text space for providing an additional description, if needed, of the actual target of the activity. A description that qualifies the location, not the activity.', max_length=2000, verbose_name='location description', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='sector',
            name='sector_code',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Please select DAC-5 or DAC-3 as the sector vocabulary first, then this field will be populated with the corresponding codes. For other vocabularies, it is possible to fill in any code. See these lists for the DAC-5 and DAC-3 sector codes: <a href="http://iatistandard.org/202/codelists/Sector/" target="_blank">DAC-5 sector codes</a> and <a href="http://iatistandard.org/202/codelists/SectorCategory/" target="_blank">DAC-3 sector codes</a>.', max_length=25, verbose_name='sector code', blank=True),
            preserve_default=True,
        ),
    ]
