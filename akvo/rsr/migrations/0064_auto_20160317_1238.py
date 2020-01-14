# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0063_auto_20160316_1256'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crsadd',
            name='channel_code',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='The CRS channel code for this activity. The codelist contains both organisation types and names of organisations. For non-CRS purposes these should be reported using participating organisations. See the <a href="http://iatistandard.org/202/codelists/CRSChannelCode/" target="_blank">IATI codelist</a>.', max_length=5, verbose_name='channel code', choices=[('10000', '10000 - Public Sector Institutions'), ('11000', '11000 - Donor Government'), ('12000', '12000 - Recipient Government'), ('13000', '13000 - Third Country Government (Delegated co-operation)'), ('20000', '20000 - Non-governmental Organisations (NGOs) And Civil Society'), ('21000', '21000 - International NGO'), ('21045', '21045 - African Medical and Research Foundation'), ('21046', '21046 - Agency for Cooperation and Research in Development'), ('21001', '21001 - Association of Geoscientists for International Development'), ('21005', '21005 - Consumer Unity and Trust Society International'), ('21029', '21029 - Doctors Without Borders'), ('47035', '47035 - Environmental Development Action in the Third World'), ('21007', '21007 - Environmental Liaison Centre International'), ('21503', '21503 - Family Health International 360'), ('21011', '21011 - Global Campaign for Education'), ('21013', '21013 - Health Action International'), ('21024', '21024 - Inter Press Service, International Association'), ('21038', '21038 - International Alert'), ('21057', '21057 - International Centre for Transitional Justice'), ('21016', '21016 - International Committee of the Red Cross'), ('21044', '21044 - International Council for the Control of Iodine Deficiency Disorders'), ('21018', '21018 - International Federation of Red Cross and Red Crescent Societies'), ('21020', '21020 - International HIV/AIDS Alliance'), ('21022', '21022 - International Network for Alternative Financial Institutions'), ('21042', '21042 - International Peacebuilding Alliance'), ('21023', '21023 - International Planned Parenthood Federation'), ('21061', '21061 - International Rehabilitation Council for Torture'), ('21504', '21504 - International Relief and Development'), ('21506', '21506 - International Rescue Committee'), ('21034', '21034 - International Union Against Tuberculosis and Lung Disease'), ('21053', '21053 - IPAS-Protecting Women\u2019s Health, Advancing Women\u2019s Reproductive Rights'), ('21054', '21054 - Life and Peace Institute'), ('21501', '21501 - OXFAM International'), ('21507', '21507 - Pact World'), ('21031', '21031 - PANOS Institute'), ('21032', '21032 - Population Services International'), ('21505', '21505 - Save the Children'), ('21041', '21041 - Society for International Development'), ('21062', '21062 - The Nature Conservancy'), ('21036', '21036 - World University Service'), ('21502', '21502 - World Vision'), ('22000', '22000 - Donor country-based NGO'), ('21047', '21047 - AgriCord'), ('21060', '21060 - Association for the Prevention of Torture'), ('21006', '21006 - Development Gateway Foundation'), ('21049', '21049 - European Centre for Development Policy Management'), ('21008', '21008 - Eurostep'), ('47042', '47042 - Foundation for International Training'), ('21050', '21050 - Geneva Call'), ('21014', '21014 - Human Rights Information and Documentation Systems'), ('21015', '21015 - International Catholic Rural Association'), ('21058', '21058 - International Crisis Group'), ('21019', '21019 - International Federation of Settlements and Neighbourhood Centres'), ('21025', '21025 - International Seismological Centre'), ('21026', '21026 - International Service for Human Rights'), ('21027', '21027 - International Trust Fund for Demining and Mine Victims Assistance'), ('21040', '21040 - International Womens Tribune Centre'), ('22501', '22501 - OXFAM - provider country office'), ('22502', '22502 - Save the Children - donor country office'), ('21033', '21033 - Transparency International'), ('21037', '21037 - Womens World Banking'), ('21035', '21035 - World Organisation Against Torture'), ('23000', '23000 - Developing country-based NGO'), ('21059', '21059 - Africa Solidarity Fund'), ('21048', '21048 - Association of African Universities'), ('21010', '21010 - Forum for African Women Educationalists'), ('21051', '21051 - Institut Sup\xe9rieur Panafricaine d\u2019Economie Coop\xe9rative'), ('21028', '21028 - International University Exchange Fund - IUEF Stip. in Africa and Latin America'), ('21003', '21003 - Latin American Council for Social Sciences'), ('21030', '21030 - Pan African Institute for Development'), ('21055', '21055 - Regional AIDS Training Network'), ('30000', '30000 - Public-Private Partnerships (PPPs) And Networks'), ('31000', '31000 - Public-Private Partnership (PPP)'), ('30008', '30008 - Cities Alliance'), ('30016', '30016 - European Fund for Southeast Europe'), ('30007', '30007 - Global Alliance for ICT and Development'), ('30001', '30001 - Global Alliance for Improved Nutrition'), ('30012', '30012 - Global Climate Partnership Fund'), ('47043', '47043 - Global Crop Diversity Trust'), ('30015', '30015 - Global Energy Efficiency and Renewable Energy Fund'), ('30003', '30003 - Global e-Schools and Communities Initiative'), ('30004', '30004 - Global Water Partnership'), ('30005', '30005 - International AIDS Vaccine Initiative'), ('30006', '30006 - International Partnership on Microbicides'), ('30011', '30011 - International Union for the Conservation of Nature'), ('30013', '30013 - Microfinance Enhancement Facility'), ('30014', '30014 - Regional Micro, Small and Medium Enterprise Investment Fund for Sub-Saharan Africa'), ('21056', '21056 - Renewable Energy and Energy Efficiency Partnership'), ('30017', '30017 - SANAD Fund for Micro, Small and Medium Enterprises'), ('30009', '30009 - Small Arms Survey'), ('32000', '32000 - Network'), ('47010', '47010 - Commonwealth Agency for Public Administration and Management'), ('47028', '47028 - Commonwealth Partnership for Technical Management'), ('21043', '21043 - European Parliamentarians for Africa'), ('31004', '31004 - Extractive Industries Transparency Initiative International Secretariat'), ('31001', '31001 - Global Development Network'), ('31002', '31002 - Global Knowledge Partnership'), ('21017', '21017 - International Centre for Trade and Sustainable Development'), ('31003', '31003 - International Land Coalition'), ('31005', '31005 - Parliamentary Network on the World Bank'), ('40000', '40000 - Multilateral Organisations'), ('41000', '41000 - United Nations agency, fund or commission (UN)'), ('41147', '41147 - Central Emergency Response Fund'), ('41101', '41101 - Convention to Combat Desertification'), ('41102', '41102 - Desert Locust Control Organisation for Eastern Africa'), ('41106', '41106 - Economic and Social Commission for Asia and the Pacific'), ('41105', '41105 - Economic and Social Commission for Western Asia'), ('41103', '41103 - Economic Commission for Africa'), ('41104', '41104 - Economic Commission for Latin America and the Caribbean'), ('41301', '41301 - Food and Agricultural Organisation'), ('41318', '41318 - Global Mechanism'), ('41317', '41317 - Green Climate Fund'), ('41312', '41312 - International Atomic Energy Agency - assessed contributions'), ('41107', '41107 - International Atomic Energy Agency (Contributions to Technical Cooperation Fund Only)'), ('41108', '41108 - International Fund for Agricultural Development'), ('41302', '41302 - International Labour Organisation - Assessed Contributions'), ('41144', '41144 - International Labour Organisation - Regular Budget Supplementary Account'), ('41145', '41145 - International Maritime Organization - Technical Co-operation Fund'), ('41303', '41303 - International Telecommunications Union'), ('41110', '41110 - Joint United Nations Programme on HIV/AIDS'), ('41305', '41305 - United Nations'), ('41111', '41111 - United Nations Capital Development Fund'), ('41122', '41122 - United Nations Children\u2019s Fund'), ('41112', '41112 - United Nations Conference on Trade and Development'), ('41142', '41142 - United Nations Democracy Fund'), ('41310', '41310 - United Nations Department of Peacekeeping Operations [only MINURSO, MINUSCA, MINUSMA, MINUSTAH, MONUSCO, UNAMID, UNIFIL, UNIFSA, UNMIK, UNMIL, UNMIS (terminated July 2011), UNMISS, UNMIT (terminated December 2012), UNOCI]. Report contributions mission by mission in CRS++.'), ('41148', '41148 - United Nations Department of Political Affairs, Trust Fund in Support of Political Affairs'), ('41114', '41114 - United Nations Development Programme'), ('41314', '41314 - United Nations Economic Commission for Europe (extrabudgetary contributions only)'), ('41304', '41304 - United Nations Educational, Scientific and Cultural Organisation'), ('41146', '41146 - United Nations Entity for Gender Equality and the Empowerment of Women'), ('41116', '41116 - United Nations Environment Programme'), ('41316', '41316 - United Nations Framework Convention on Climate Change'), ('41313', '41313 - United Nations High Commissioner for Human Rights (extrabudgetary contributions only)'), ('41120', '41120 - United Nations Human Settlement Programme'), ('41123', '41123 - United Nations Industrial Development Organisation'), ('41125', '41125 - United Nations Institute for Training and Research'), ('41315', '41315 - United Nations International Strategy for Disaster Reduction'), ('41126', '41126 - United Nations Mine Action Service'), ('41502', '41502 - United Nations Office for Project Services'), ('41127', '41127 - United Nations Office of Co-ordination of Humanitarian Affairs'), ('41121', '41121 - United Nations Office of the United Nations High Commissioner for Refugees'), ('41128', '41128 - United Nations Office on Drugs and Crime'), ('41311', '41311 - United Nations Peacebuilding Fund (Window One:  Flexible Contributions Only)'), ('41141', '41141 - United Nations Peacebuilding Fund (Window Two:  Restricted Contributions Only)'), ('41119', '41119 - United Nations Population Fund'), ('41501', '41501 - United Nations Reducing Emissions from Deforestation and Forest Degradation'), ('41130', '41130 - United Nations Relief and Works Agency for Palestine Refugees in the Near East'), ('41129', '41129 - United Nations Research Institute for Social Development'), ('41133', '41133 - United Nations Special Initiative on Africa'), ('41131', '41131 - United Nations System Staff College'), ('41132', '41132 - United Nations System Standing Committee on Nutrition'), ('41134', '41134 - United Nations University (including Endowment Fund)'), ('41137', '41137 - United Nations Voluntary Fund for Technical Co-operation in the Field of Human Rights'), ('41138', '41138 - United Nations Voluntary Fund for Victims of Torture'), ('41136', '41136 - United Nations Voluntary Fund on Disability'), ('41135', '41135 - United Nations Volunteers'), ('41306', '41306 - Universal Postal Union'), ('41140', '41140 - World Food Programme'), ('41307', '41307 - World Health Organisation - assessed contributions'), ('41143', '41143 - World Health Organisation - core voluntary contributions account'), ('41308', '41308 - World Intellectual Property Organisation'), ('41309', '41309 - World Meteorological Organisation'), ('42000', '42000 - European Union Institution (EU)'), ('42001', '42001 - European Commission - Development Share of Budget'), ('42003', '42003 - European Commission - European Development Fund'), ('42004', '42004 - European Investment Bank'), ('43000', '43000 - International Monetary Fund (IMF)'), ('43005', '43005 - International Monetary Fund - Post-Catastrophe Debt Relief Trust'), ('43002', '43002 - International Monetary Fund - Poverty Reduction and Growth - Heavily Indebted Poor Countries Debt Relief Initiative Trust Fund [includes HIPC, Extended Credit Facility (ECF), and ECF-HIPC sub-accounts]'), ('43004', '43004 - International Monetary Fund - Poverty Reduction and Growth - Multilateral Debt Relief Initiative Trust'), ('43001', '43001 - International Monetary Fund - Poverty Reduction and Growth Trust'), ('43003', '43003 - International Monetary Fund - Subsidization of Emergency Post Conflict Assistance/Emergency Assistance for Natural Disasters for PRGT-eligible members'), ('44000', '44000 - World Bank Group (WB)'), ('44006', '44006 - Advance Market Commitments'), ('44001', '44001 - International Bank for Reconstruction and Development'), ('44002', '44002 - International Development Association'), ('44003', '44003 - International Development Association - Heavily Indebted Poor Countries Debt Initiative Trust Fund'), ('44007', '44007 - International Development Association - Multilateral Debt Relief Initiative'), ('44004', '44004 - International Finance Corporation'), ('44005', '44005 - Multilateral Investment Guarantee Agency'), ('45000', '45000 - World Trade Organisation'), ('45002', '45002 - World Trade Organisation - Advisory Centre on WTO Law'), ('45003', '45003 - World Trade Organisation - Doha Development Agenda Global Trust Fund'), ('45001', '45001 - World Trade Organisation - International Trade Centre'), ('46000', '46000 - Regional Development Bank'), ('46002', '46002 - African Development Bank'), ('46003', '46003 - African Development Fund'), ('46022', '46022 - African Export Import Bank'), ('46008', '46008 - Andean Development Corporation'), ('46004', '46004 - Asian Development Bank'), ('46005', '46005 - Asian Development Fund'), ('46006', '46006 - Black Sea Trade and Development Bank'), ('46009', '46009 - Caribbean Development Bank'), ('46020', '46020 - Central African States Development Bank'), ('46007', '46007 - Central American Bank for Economic Integration'), ('46024', '46024 - Council of Europe Development Bank'), ('46023', '46023 - Eastern and Southern African Trade and Development Bank'), ('46015', '46015 - European Bank for Reconstruction and Development'), ('46018', '46018 - European Bank for Reconstruction and Development - Early Transition Countries Fund'), ('46017', '46017 - European Bank for Reconstruction and Development \u2013 technical co-operation and special funds (all EBRD countries of operations)'), ('46016', '46016 - European Bank for Reconstruction and Development \u2013 technical co-operation and special funds (ODA-eligible countries only)'), ('46019', '46019 - European Bank for Reconstruction and Development - Western Balkans Joint Trust Fund'), ('46013', '46013 - Inter-American Development Bank, Fund for Special Operations'), ('46012', '46012 - Inter-American Development Bank, Inter-American Investment Corporation and Multilateral Investment Fund'), ('46025', '46025 - Islamic Development Bank'), ('46021', '46021 - West African Development Bank'), ('47000', '47000 - Other multilateral institution'), ('47111', '47111 - Adaptation Fund'), ('47009', '47009 - African and Malagasy Council for Higher Education'), ('47001', '47001 - African Capacity Building Foundation'), ('47137', '47137 - African Risk Capacity Group'), ('47141', '47141 - African Tax Administration Forum'), ('47005', '47005 - African Union (excluding peacekeeping facilities)'), ('21002', '21002 - Agency for International Trade Information and Co-operation'), ('47002', '47002 - Asian Productivity Organisation'), ('47109', '47109 - Asia-Pacific Economic Cooperation Support Fund (except contributions tied to counter-terrorism activities)'), ('47068', '47068 - Asia-Pacific Fishery Commission'), ('47003', '47003 - Association of South East Asian Nations: Economic Co-operation'), ('47011', '47011 - Caribbean Community Secretariat'), ('47012', '47012 - Caribbean Epidemiology Centre'), ('47112', '47112 - Central European Initiative - Special Fund for Climate and Environmental Protection'), ('47015', '47015 - CGIAR Fund'), ('47134', '47134 - Clean Technology Fund'), ('47027', '47027 - Colombo Plan'), ('47105', '47105 - Common Fund for Commodities'), ('47013', '47013 - Commonwealth Foundation'), ('47025', '47025 - Commonwealth of Learning'), ('47132', '47132 - Commonwealth Secretariat (ODA-eligible contributions only)'), ('47026', '47026 - Community of Portuguese Speaking Countries'), ('47022', '47022 - Convention on International Trade in Endangered Species of Wild Flora and Fauna'), ('47138', '47138 - Council of Europe'), ('47037', '47037 - Eastern-Regional Organisation of Public Administration'), ('47113', '47113 - Economic and Monetary Community of Central Africa'), ('47034', '47034 - Economic Community of West African States'), ('47036', '47036 - European and Mediterranean Plant Protection Organisation'), ('47504', '47504 - Forest Carbon Partnership Facility'), ('47040', '47040 - Forum Fisheries Agency'), ('47106', '47106 - Geneva Centre for the Democratic Control of Armed Forces'), ('47123', '47123 - Geneva International Centre for Humanitarian Demining'), ('47503', '47503 - Global Agriculture and Food Security Program'), ('47122', '47122 - Global Alliance for Vaccines and Immunization'), ('47129', '47129 - Global Environment Facility - Least Developed Countries Fund'), ('47130', '47130 - Global Environment Facility - Special Climate Change Fund'), ('47044', '47044 - Global Environment Facility Trust Fund'), ('47502', '47502 - Global Fund for Disaster Risk Reduction'), ('47045', '47045 - Global Fund to Fight AIDS, Tuberculosis and Malaria'), ('47136', '47136 - Global Green Growth Institute'), ('47501', '47501 - Global Partnership for Education'), ('47116', '47116 - Integrated Framework for Trade-Related Technical Assistance to Least Developed Countries'), ('47061', '47061 - Inter-American Institute for Co-operation on Agriculture'), ('47065', '47065 - Intergovernmental Oceanographic Commission'), ('47067', '47067 - Intergovernmental Panel on Climate Change'), ('47019', '47019 - International Centre for Advanced Mediterranean Agronomic Studies'), ('47050', '47050 - International Cotton Advisory Committee'), ('47059', '47059 - International Development Law Organisation'), ('30010', '30010 - International drug purchase facility'), ('47107', '47107 - International Finance Facility for Immunisation'), ('47058', '47058 - International Institute for Democracy and Electoral Assistance'), ('47064', '47064 - International Network for Bamboo and Rattan'), ('47066', '47066 - International Organisation for Migration'), ('47046', '47046 - International Organisation of the Francophonie'), ('47073', '47073 - International Tropical Timber Organisation'), ('47074', '47074 - International Vaccine Institute'), ('47076', '47076 - Justice Studies Centre of the Americas'), ('47127', '47127 - Latin-American Energy Organisation'), ('47077', '47077 - Mekong River Commission'), ('47078', '47078 - Multilateral Fund for the Implementation of the Montreal Protocol'), ('47117', '47117 - New Partnership for Africas Development'), ('47128', '47128 - Nordic Development Fund'), ('47081', '47081 - OECD Development Centre'), ('47142', '47142 - OPEC Fund for International Development'), ('47080', '47080 - Organisation for Economic Co-operation and Development (Contributions to special funds for Technical Co-operation Activities Only)'), ('47079', '47079 - Organisation of American States'), ('47082', '47082 - Organisation of Eastern Caribbean States'), ('47140', '47140 - Organisation of Ibero-American States for Education, Science and Culture'), ('47110', '47110 - Organisation of the Black Sea Economic Cooperation'), ('47131', '47131 - Organization for Security and Co-operation in Europe'), ('47087', '47087 - Pacific Islands Forum Secretariat'), ('47097', '47097 - Pacific Regional Environment Programme'), ('47083', '47083 - Pan-American Health Organisation'), ('47084', '47084 - Pan-American Institute of Geography and History'), ('47086', '47086 - Private Infrastructure Development Group'), ('47118', '47118 - Regional Organisation for the Strengthening of Supreme Audit Institutions of Francophone Sub-Saharan Countries'), ('47119', '47119 - Sahara and Sahel Observatory'), ('47029', '47029 - Sahel and West Africa Club'), ('47096', '47096 - Secretariat of the Pacific Community'), ('47120', '47120 - South Asian Association for Regional Cooperation'), ('47092', '47092 - South East Asian Fisheries Development Centre'), ('47093', '47093 - South East Asian Ministers of Education'), ('47095', '47095 - South Pacific Board for Educational Assessment'), ('47089', '47089 - Southern African Development Community'), ('47135', '47135 - Strategic Climate Fund'), ('47121', '47121 - United Cities and Local Governments of Africa'), ('47098', '47098 - Unrepresented Nations and Peoples\u2019 Organisation'), ('47100', '47100 - West African Monetary Union'), ('47139', '47139 - World Customs Organization Customs Co-operation Fund'), ('50000', '50000 - Other'), ('51000', '51000 - University, college or other teaching institution, research institute or think\u2011tank'), ('47101', '47101 - Africa Rice Centre'), ('47069', '47069 - Bioversity International'), ('47018', '47018 - Centre for International Forestry Research'), ('21004', '21004 - Council for the Development of Economic and Social Research in Africa'), ('47041', '47041 - Food and Fertilizer Technology Centre'), ('21009', '21009 - Forum for Agricultural Research in Africa'), ('47047', '47047 - International African Institute'), ('47051', '47051 - International Centre for Agricultural Research in Dry Areas'), ('47055', '47055 - International Centre for Development Oriented Research in Agriculture'), ('47053', '47053 - International Centre for Diarrhoeal Disease Research, Bangladesh'), ('47017', '47017 - International Centre for Tropical Agriculture'), ('47054', '47054 - International Centre of Insect Physiology and Ecology'), ('47057', '47057 - International Crop Research for Semi-Arid Tropics'), ('51001', '51001 - International Food Policy Research Institute'), ('21021', '21021 - International Institute for Environment and Development'), ('21039', '21039 - International Institute for Sustainable Development'), ('47062', '47062 - International Institute of Tropical Agriculture'), ('47063', '47063 - International Livestock Research Institute'), ('47020', '47020 - International Maize and Wheat Improvement Centre'), ('47021', '47021 - International Potato Centre'), ('47070', '47070 - International Rice Research Institute'), ('47071', '47071 - International Seed Testing Association'), ('47075', '47075 - International Water Management Institute'), ('47099', '47099 - University of the South Pacific'), ('47056', '47056 - World AgroForestry Centre'), ('47103', '47103 - World Maritime University'), ('47008', '47008 - World Vegetable Centre'), ('47104', '47104 - WorldFish Centre'), ('52000', '52000 - Other')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='commitment_date',
            field=models.DateField(help_text='The CRS++ reported commitment date.', null=True, verbose_name='loan terms commitment date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='interest_arrears',
            field=models.DecimalField(decimal_places=2, max_digits=10, blank=True, help_text='Arrears of interest at the end of the year.', null=True, verbose_name='loan status interest arrears'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='interest_received',
            field=models.DecimalField(decimal_places=2, max_digits=10, blank=True, help_text='Interest received during the reporting year.', null=True, verbose_name='loan status interest received'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_status_value_date',
            field=models.DateField(help_text='Enter the specific date (DD/MM/YYYY) for the loan status values.', null=True, verbose_name='loan status value date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_status_year',
            field=models.PositiveIntegerField(help_text='CRS reporting year (CRS++ Column 1).', max_length=4, null=True, verbose_name='loan status year', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_terms_rate1',
            field=models.DecimalField(decimal_places=2, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], max_digits=5, blank=True, help_text='Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2.', null=True, verbose_name='loan terms rate 1'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_terms_rate2',
            field=models.DecimalField(decimal_places=2, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], max_digits=5, blank=True, help_text='Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here.', null=True, verbose_name='loan terms rate 2'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='principal_arrears',
            field=models.DecimalField(decimal_places=2, max_digits=10, blank=True, help_text='Arrears of principal at the end of the year. Included in principal outstanding.', null=True, verbose_name='loan status principal arrears'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='principal_outstanding',
            field=models.DecimalField(decimal_places=2, max_digits=10, blank=True, help_text='The amount of principal owed on the loan at the end of the reporting year.', null=True, verbose_name='loan status principal outstanding'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_final_date',
            field=models.DateField(help_text='The CRS++ reported final repayment date.', null=True, verbose_name='loan terms final repayment date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_first_date',
            field=models.DateField(help_text='The CRS++ reported first repayment date.', null=True, verbose_name='loan terms first repayment date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_plan',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='An IATI codelist tabulating CRS-specified values for the number of repayments per annum. See the <a href="http://iatistandard.org/202/codelists/LoanRepaymentPeriod/" target="_blank">IATI codelist</a>.', max_length=2, verbose_name='loan terms repayment plan', choices=[('1', '1 - Annual'), ('2', '2 - Semi-annual'), ('4', '4 - Quarterly'), ('12', '12 - Monthly')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_type',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='An IATI codelist tabulating CRS-specified values for the type of Repayment. See the <a href="http://iatistandard.org/202/codelists/LoanRepaymentType/" target="_blank">IATI codelist</a>.', max_length=1, verbose_name='loan terms repayment type', choices=[('1', '1 - Equal Principal Payments (EPP)'), ('2', '2 - Annuity'), ('3', '3 - Lump sum'), ('5', '5 - Other')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsaddotherflag',
            name='code',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='An IATI code describing the equivalent CRS++ columns. See the <a href="http://iatistandard.org/202/codelists/CRSAddOtherFlags/" target="_blank">IATI codelist</a>.', max_length=1, verbose_name='code', choices=[('1', '1 - Free standing technical cooperation'), ('2', '2 - Programme-based approach'), ('3', '3 - Investment project'), ('4', '4 - Associated financing')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsaddotherflag',
            name='significance',
            field=models.NullBooleanField(help_text='Indicate whether the flag applies or not.', verbose_name='significance'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='fss',
            name='extraction_date',
            field=models.DateField(help_text="The exact date when the information was collected or extracted from donors' aid management systems.", null=True, verbose_name='extraction date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='fss',
            name='phaseout_year',
            field=models.PositiveIntegerField(help_text='If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements.', max_length=4, null=True, verbose_name='phaseout year', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='fss',
            name='priority',
            field=models.NullBooleanField(help_text='True if the partner country is a priority partner country.', verbose_name='priority'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='fssforecast',
            name='value',
            field=models.DecimalField(decimal_places=2, max_digits=10, blank=True, help_text='The forecast value for each year.', null=True, verbose_name='forecast value'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='fssforecast',
            name='value_date',
            field=models.DateField(help_text='Enter the specific date (DD/MM/YYYY) for the forecast value.', null=True, verbose_name='value date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='fssforecast',
            name='year',
            field=models.PositiveIntegerField(help_text='The calendar year that the forward spend covers.', max_length=4, null=True, verbose_name='year', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorreference',
            name='reference',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A code for an indicator defined in the specified vocabulary specified. For more information on the indicator reference, see the <a href="http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/result/indicator/reference/" target="_blank">IATI codelist</a>.', max_length=25, verbose_name='reference code', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='legacydata',
            name='iati_equivalent',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The name of the equivalent IATI element.', max_length=1000, verbose_name='iati equivalent', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='legacydata',
            name='name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text="The original field name in the reporting organisation's system.", max_length=1000, verbose_name='name', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='legacydata',
            name='value',
            field=akvo.rsr.fields.ValidXMLCharField(help_text="The original field value in the reporting organisation's system.", max_length=1000, verbose_name='value', blank=True),
            preserve_default=True,
        ),
    ]
