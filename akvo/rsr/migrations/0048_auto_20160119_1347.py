# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0047_auto_20160115_1039'),
    ]

    operations = [
        migrations.AlterField(
            model_name='countrybudgetitem',
            name='code',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='This item encodes the alignment of activities with both the functional and administrative classifications used in the recipient country\u2019s Chart of Accounts. This applies to both on- and off-budget activities.', max_length=10, verbose_name='country budget item', choices=[('1.1.1', '1.1.1 - Executive - executive'), ('1.2.1', '1.2.1 - Legislative - legislative'), ('1.3.1', '1.3.1 - Accountability - macroeconomic policy'), ('1.3.2', '1.3.2 - Accountability - budgeting'), ('1.3.3', '1.3.3 - Accountability - planning'), ('1.3.4', '1.3.4 - Accountability - Treasury/Accounts'), ('1.3.5', '1.3.5 - Accountability - debt and aid management'), ('1.3.6', '1.3.6 - Accountability - tax policy'), ('1.3.7', '1.3.7 - Accountability - tax collection'), ('1.3.8', '1.3.8 - Accountability - local government finance'), ('1.3.9', '1.3.9 - Accountability - other central transfers to institutions '), ('1.3.10', '1.3.10 - Accountability - national audit'), ('1.3.11', '1.3.11 - Accountability - national monitoring and evaluation'), ('1.3.12', '1.3.12 - Accountability - monetary institutions'), ('1.3.13', '1.3.13 - Accountability - financial sector policy and regulation'), ('1.4.1', '1.4.1 - External Affairs - foreign affairs '), ('1.4.2', '1.4.2 - External Affairs - diplomatic missions'), ('1.4.3', '1.4.3 - External Affairs - official development assistance'), ('1.5.1', '1.5.1 - General Personnel Services - general personnel services'), ('1.6.1', '1.6.1 - Statistics - statistics'), ('1.7.1', '1.7.1 - Other General Services - support to civil society '), ('1.7.2', '1.7.2 - Other General Services - central procurement'), ('1.7.3', '1.7.3 - Other General Services - Local Government Administration'), ('1.7.4', '1.7.4 - Other General Services - other general services'), ('1.8.1', '1.8.1 - Elections - elections'), ('2.1.1', '2.1.1 - Justice, Law and Order - policy, planning and administration'), ('2.1.2', '2.1.2 - Justice, Law and Order - police'), ('2.1.2', '2.1.2 - Justice, Law and Order - fire'), ('2.1.3', '2.1.3 - Justice, Law and Order - judicial affairs'), ('2.1.4', '2.1.4 - Justice, Law and Order - Ombudsman'), ('2.1.5', '2.1.5 - Justice, Law and Order - human rights affairs'), ('2.1.6', '2.1.6 - Justice, Law and Order - immigration'), ('2.1.7', '2.1.7 - Justice, Law and Order - anti corruption'), ('2.1.8', '2.1.8 - Justice, Law and Order - prisons'), ('2.1.9', '2.1.9 - Justice, Law and Order - peace building'), ('2.1.10', '2.1.10 - Justice, Law and Order - demobilisation'), ('2.2.1', '2.2.1 - Defence - policy, planning and administration'), ('2.2.2', '2.2.2 - Defence - military'), ('2.2.3', '2.2.3 - Defence - civil defence'), ('2.2.4', '2.2.4 - Defence - foreign military aid'), ('3.1.1', '3.1.1 - General Economic, Commercial and Labour Affairs - policy, planning and administration'), ('3.1.2', '3.1.2 - General Economic, Commercial and Labour Affairs - general economic affairs'), ('3.1.3', '3.1.3 - General Economic, Commercial and Labour Affairs - investment promotion'), ('3.1.4', '3.1.4 - General Economic, Commercial and Labour Affairs - privatisation'), ('3.1.5', '3.1.5 - General Economic, Commercial and Labour Affairs - trade'), ('3.1.6', '3.1.6 - General Economic, Commercial and Labour Affairs - labour'), ('3.1.7', '3.1.7 - General Economic, Commercial and Labour Affairs - national standards development'), ('3.2.1', '3.2.1 - Public Works - policy, planning and administration'), ('3.2.2', '3.2.2 - Public Works - construction regulation'), ('3.2.3', '3.2.3 - Public Works - mechanical services'), ('3.3.1', '3.3.1 - Agriculture - policy, planning and administration'), ('3.3.2', '3.3.2 - Agriculture - irrigation'), ('3.3.3', '3.3.3 - Agriculture - inputs'), ('3.3.4', '3.3.4 - Agriculture - food crop'), ('3.3.5', '3.3.5 - Agriculture - industrial crop'), ('3.3.6', '3.3.6 - Agriculture - livestock'), ('3.3.7', '3.3.7 - Agriculture - agricultural training and extension'), ('3.3.8', '3.3.8 - Agriculture - research'), ('3.3.9', '3.3.9 - Agriculture - other services'), ('3.4.1', '3.4.1 - Forestry - policy, planning and administration'), ('3.4.2', '3.4.2 - Forestry - development and services'), ('3.4.3', '3.4.3 - Forestry - education/training'), ('3.4.4', '3.4.4 - Forestry - research'), ('3.5.1', '3.5.1 - Fishing and Hunting - policy, planning and administration'), ('3.5.2', '3.5.2 - Fishing and Hunting - development and services'), ('3.5.3', '3.5.3 - Fishing and Hunting - education and training'), ('3.5.4', '3.5.4 - Fishing and Hunting - research'), ('3.6.1', '3.6.1 - Energy - policy, planning and administration'), ('3.6.2', '3.6.2 - Energy - education and training'), ('3.6.3', '3.6.3 - Energy - energy regulation'), ('3.6.4', '3.6.4 - Energy - electricity transmission'), ('3.6.5', '3.6.5 - Energy - nuclear'), ('3.6.6', '3.6.6 - Energy - power generation'), ('3.6.7', '3.6.7 - Energy - gas '), ('3.7.1', '3.7.1 - Mining and Mineral Development - policy, planning and administration'), ('3.7.2', '3.7.2 - Mining and Mineral Development - prospection and exploration'), ('3.7.3', '3.7.3 - Mining and Mineral Development - coal and other solid mineral fuels'), ('3.7.4', '3.7.4 - Mining and Mineral Development - petroleum and gas'), ('3.7.6', '3.7.6 - Mining and Mineral Development - other fuel'), ('3.7.7', '3.7.7 - Mining and Mineral Development - non fuel minerals'), ('3.8.1', '3.8.1 - Transport - policy, planning and administration'), ('3.8.2', '3.8.2 - Transport - transport regulation'), ('3.8.3', '3.8.3 - Transport - feeder road construction'), ('3.8.4', '3.8.4 - Transport - feeder road maintenance'), ('3.8.5', '3.8.5 - Transport - national road construction'), ('3.8.6', '3.8.6 - Transport - national road maintenance'), ('3.8.7', '3.8.7 - Transport - rail'), ('3.8.8', '3.8.8 - Transport - water'), ('3.8.9', '3.8.9 - Transport - air'), ('3.8.10', '3.8.10 - Transport - pipeline'), ('3.8.11', '3.8.11 - Transport - storage and distribution'), ('3.8.12', '3.8.12 - Transport - public transport services'), ('3.8.13', '3.8.13 - Transport - meteorological services'), ('3.8.14', '3.8.14 - Transport - education and training'), ('3.9.1', '3.9.1 - Industry - policy, planning and administration'), ('3.9.2', '3.9.2 - Industry - development and services'), ('3.9.3', '3.9.3 - Industry - industrial research'), ('3.9.4', '3.9.4 - Industry - (investment in industry)'), ('3.10.1', '3.10.1 - Communications - policy, planning and administration'), ('3.10.2', '3.10.2 - Communications - ICT Infrastructure'), ('3.10.3', '3.10.3 - Communications - telecoms and postal services'), ('3.10.4', '3.10.4 - Communications - information services'), ('3.11.1', '3.11.1 - Tourism - policy, planning and administration'), ('3.11.2', '3.11.2 - Tourism - services'), ('3.12.1', '3.12.1 - Microfinance and financial services - Microfinance and financial services'), ('4.1.1', '4.1.1 - Water supply and Sanitation - policy, planning and administration'), ('4.1.2', '4.1.2 - Water supply and Sanitation - education/training'), ('4.1.3', '4.1.3 - Water supply and Sanitation - rural water supply and sanitation'), ('4.1.4', '4.1.4 - Water supply and Sanitation - urban water supply and sanitation'), ('4.1.5', '4.1.5 - Water supply and Sanitation - rural water supply'), ('4.1.6', '4.1.6 - Water supply and Sanitation - urban water supply'), ('4.1.7', '4.1.7 - Water supply and Sanitation - rural sanitation'), ('4.1.8', '4.1.8 - Water supply and Sanitation - urban sanitation'), ('4.1.9', '4.1.9 - Water supply and Sanitation - sewage and waste management'), ('4.2.1', '4.2.1 - Environment - policy, planning and administration'), ('4.2.2', '4.2.2 - Environment - research/ education and training'), ('4.2.3', '4.2.3 - Environment - natural resource management'), ('4.2.4', '4.2.4 - Environment - water resources management'), ('4.2.5', '4.2.5 - Environment - wildlife protection, parks and site preservation'), ('5.1.1', '5.1.1 - Health - policy, planning and administration'), ('5.2.1', '5.2.1 - Recreation, Culture and Religion - recreation and sport'), ('5.2.2', '5.2.2 - Recreation, Culture and Religion - culture'), ('5.2.3', '5.2.3 - Recreation, Culture and Religion - broadcasting and publishing'), ('5.2.4', '5.2.4 - Recreation, Culture and Religion - religion'), ('5.3.1', '5.3.1 - Education - administration, policy and planning'), ('5.3.2', '5.3.2 - Education - research'), ('5.3.3', '5.3.3 - Education - pre-primary'), ('5.3.4', '5.3.4 - Education - primary'), ('5.3.5', '5.3.5 - Education - lower secondary'), ('5.3.6', '5.3.6 - Education - upper secondary'), ('5.3.7', '5.3.7 - Education - post secondary non tertiary '), ('5.3.8', '5.3.8 - Education - tertiary'), ('5.3.9', '5.3.9 - Education - vocational training'), ('5.3.10', '5.3.10 - Education - advanced technical and managerial training'), ('5.3.11', '5.3.11 - Education - basic adult education'), ('5.3.12', '5.3.12 - Education - teacher training'), ('5.3.13', '5.3.13 - Education - subsidiary services'), ('5.4.1', '5.4.1 - Social Protection, Land Housing and Community Amenities - policy, planning and administration'), ('5.4.2', '5.4.2 - Social Protection, Land Housing and Community Amenities - social security (excl pensions)'), ('5.4.3', '5.4.3 - Social Protection, Land Housing and Community Amenities - general pensions'), ('5.4.4', '5.4.4 - Social Protection, Land Housing and Community Amenities - civil service and military pensions'), ('5.4.5', '5.4.5 - Social Protection, Land Housing and Community Amenities - social services (incl youth development and women+ children)'), ('5.4.6', '5.4.6 - Social Protection, Land Housing and Community Amenities - land policy and management'), ('5.4.7', '5.4.7 - Social Protection, Land Housing and Community Amenities - rural devt'), ('5.4.8', '5.4.8 - Social Protection, Land Housing and Community Amenities - urban devt'), ('5.4.9', '5.4.9 - Social Protection, Land Housing and Community Amenities - housing and community amenities'), ('5.4.10', '5.4.10 - Social Protection, Land Housing and Community Amenities - emergency relief'), ('5.4.11', '5.4.11 - Social Protection, Land Housing and Community Amenities - disaster prevention and preparedness'), ('5.4.12', '5.4.12 - Social Protection, Land Housing and Community Amenities - support to refugees and internally displaced persons'), ('6.1.1', '6.1.1 - Development Partner affairs - policy planning and administration'), ('6.1.2', '6.1.2 - Development Partner affairs - Technical staff services'), ('7.1.1', '7.1.1 - External to government sector - External to general government sector'), ('7.2.1', '7.2.1 - General Budget Support - General Budget Support')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicator',
            name='title',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Within each result indicators can be defined. Indicators should be items that can be counted and evaluated as the project continues and is completed.', max_length=500, verbose_name='indicator title', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='long_name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Full name of organisation (75 characters).', unique=True, max_length=100, verbose_name='long name', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Short name which will appear in organisation and partner listings (25 characters).', unique=True, max_length=40, verbose_name='name', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnership',
            name='iati_activity_id',
            field=akvo.rsr.fields.ValidXMLCharField(db_index=True, max_length=100, null=True, verbose_name='IATI activity ID', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnership',
            name='related_activity_id',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=100, verbose_name='related IATI activity ID', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='policymarker',
            name='policy_marker',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='A policy or theme addressed by the activity, based on DAC policy markers. These indicators track key policy issues, like gender equality, environment, and trade development.', max_length=25, verbose_name='policy marker', choices=[('1', '1 - Gender Equality'), ('2', '2 - Aid to Environment'), ('3', '3 - Participatory Development/Good Governance'), ('4', '4 - Trade Development'), ('5', '5 - Aid Targeting the Objectives of the Convention on Biological Diversity'), ('6', '6 - Aid Targeting the Objectives of the Framework Convention on Climate Change - Mitigation'), ('7', '7 - Aid Targeting the Objectives of the Framework Convention on Climate Change - Adaptation'), ('8', '8 - Aid Targeting the Objectives of the Convention to Combat Desertification'), ('9', '9 - Reproductive, Maternal, Newborn and Child Health (RMNCH)')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='background',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='This should describe the geographical, political, environmental, social and/or cultural context of the project, and any related activities that have already taken place or are underway.', verbose_name='background', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='current_status',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Describe the situation at the start of the project.', verbose_name='baseline situation', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='goals_overview',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Provide a brief description of the overall project goals.', verbose_name='goals overview', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='project_plan_summary',
            field=akvo.rsr.fields.ProjectLimitedTextField(help_text='Enter a brief summary, try to restrict the number of characters to 400 in order to display the summary nicely on the project page. The summary should explain:<br>- Why the project is being carried out;<br>- Where it is taking place;<br>- Who will benefit and/or participate;<br>- What it specifically hopes to accomplish;<br>- How those specific goals will be reached', max_length=2000, verbose_name='summary of project plan', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='subtitle',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=200, verbose_name='project subtitle', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='target_group',
            field=akvo.rsr.fields.ProjectLimitedTextField(help_text='This should include information about the people, organisations or resources that are being impacted by this project.', verbose_name='target group', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=akvo.rsr.fields.ValidXMLCharField(db_index=True, max_length=200, verbose_name='project title', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='recipientregion',
            name='region',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='This identifies the region in which the activity takes place. Regions can be supra-national (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) or \'global\' (activities benefiting substantially all developing countries). For the codes to use, please see <a href="http://iatistandard.org/201/codelists/Region/" target="_blank">http://iatistandard.org/201/codelists/Region/</a>.', max_length=25, verbose_name='recipient region', choices=[('88', '88 - States Ex-Yugoslavia unspecified'), ('89', '89 - Europe, regional'), ('189', '189 - North of Sahara, regional'), ('289', '289 - South of Sahara, regional'), ('298', '298 - Africa, regional'), ('380', '380 - West Indies, regional'), ('389', '389 - North and Central America, regional'), ('489', '489 - South America, regional'), ('498', '498 - America, regional'), ('589', '589 - Middle East, regional'), ('619', '619 - Central Asia, regional'), ('679', '679 - South Asia, regional'), ('689', '689 - South and Central Asia, regional'), ('789', '789 - Far East Asia, regional'), ('798', '798 - Asia, regional'), ('889', '889 - Oceania, regional'), ('998', '998 - Developing countries, unspecified')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='recipientregion',
            name='region_vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='The vocabulary from which the region code is drawn. If it is not present 1 \u2013 \'OECD DAC\' is assumed. For more information, see <a href="http://iatistandard.org/201/codelists/RegionVocabulary/" target="_blank">http://iatistandard.org/201/codelists/RegionVocabulary/</a>.', max_length=2, verbose_name='recipient region vocabulary', choices=[('1', '1 - OECD DAC'), ('2', '2 - UN')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='result',
            name='title',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The aim of the project in one sentence. This doesn\u2019t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project.', max_length=500, verbose_name='result title', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='sector',
            name='sector_code',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Please select DAC-5 or DAC-3 as the sector vocabulary first, then this fieldwill be populated with the corresponding codes. For other vocabularies, it is possible to fill in any code. See these lists for the DAC-5 and DAC-3 sector codes: <a href="http://iatistandard.org/201/codelists/Sector/" target="_blank">DAC-5 sector codes</a> and <a href="http://iatistandard.org/201/codelists/SectorCategory/" target="_blank">DAC-3 sector codes</a>.', max_length=25, verbose_name='sector code', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='recipient_region',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='Enter the supranational geopolitical region (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) that will benefit from this transaction. For reference, please visit: <a href="http://iatistandard.org/201/codelists/Region/" target="_blank">http://iatistandard.org/201/codelists/Region/</a>.', max_length=25, verbose_name='transaction recipient region', choices=[('88', '88 - States Ex-Yugoslavia unspecified'), ('89', '89 - Europe, regional'), ('189', '189 - North of Sahara, regional'), ('289', '289 - South of Sahara, regional'), ('298', '298 - Africa, regional'), ('380', '380 - West Indies, regional'), ('389', '389 - North and Central America, regional'), ('489', '489 - South America, regional'), ('498', '498 - America, regional'), ('589', '589 - Middle East, regional'), ('619', '619 - Central Asia, regional'), ('679', '679 - South Asia, regional'), ('689', '689 - South and Central Asia, regional'), ('789', '789 - Far East Asia, regional'), ('798', '798 - Asia, regional'), ('889', '889 - Oceania, regional'), ('998', '998 - Developing countries, unspecified')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='recipient_region_vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, max_length=2, verbose_name='recipient region vocabulary', choices=[('1', '1 - OECD DAC'), ('2', '2 - UN')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transactionsector',
            name='code',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A recognised code, from a recognised vocabulary, classifying the purpose of this transaction. If this element is used then ALL transaction elements should contain a transaction/sector element and iati-activity/sector should NOT be used. This element can be used multiple times, but only one sector can be reported per vocabulary.', max_length=25, verbose_name='transaction sector', blank=True),
            preserve_default=True,
        ),
    ]
