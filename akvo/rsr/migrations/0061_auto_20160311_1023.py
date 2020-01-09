# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0060_remove_projectdocument_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crsadd',
            name='commitment_date',
            field=models.DateField(null=True, verbose_name='loan terms commitment date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='interest_arrears',
            field=models.DecimalField(null=True, verbose_name='loan status interest arrears', max_digits=10, decimal_places=2, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='interest_received',
            field=models.DecimalField(null=True, verbose_name='loan status interest received', max_digits=10, decimal_places=2, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_status_currency',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, max_length=3, verbose_name='loan status currency', choices=[('AED', 'AED - UAE Dirham'), ('AFN', 'AFN - Afghani'), ('ALL', 'ALL - Lek'), ('AMD', 'AMD - Armenian Dram'), ('ANG', 'ANG - Netherlands Antillian Guilder'), ('AOA', 'AOA - Kwanza'), ('ARS', 'ARS - Argentine Peso'), ('AUD', 'AUD - Australian Dollar'), ('AWG', 'AWG - Aruban Guilder'), ('AZN', 'AZN - Azerbaijanian Manat'), ('BAM', 'BAM - Convertible Marks'), ('BBD', 'BBD - Barbados Dollar'), ('BDT', 'BDT - Taka'), ('BGN', 'BGN - Bulgarian Lev'), ('BHD', 'BHD - Bahraini Dinar'), ('BIF', 'BIF - Burundi Franc'), ('BMD', 'BMD - Bermudian Dollar'), ('BND', 'BND - Brunei Dollar'), ('BOB', 'BOB - Boliviano'), ('BOV', 'BOV - Mvdol'), ('BRL', 'BRL - Brazilian Real'), ('BSD', 'BSD - Bahamian Dollar'), ('BTN', 'BTN - Ngultrum'), ('BWP', 'BWP - Pula'), ('BYR', 'BYR - Belarussian Ruble'), ('BZD', 'BZD - Belize Dollar'), ('CAD', 'CAD - Canadian Dollar'), ('CDF', 'CDF - Congolese Franc'), ('CHF', 'CHF - Swiss Franc'), ('CLF', 'CLF - Unidades de fomento'), ('CLP', 'CLP - Chilean Peso'), ('CNY', 'CNY - Yuan Renminbi'), ('COP', 'COP - Colombian Peso'), ('COU', 'COU - Unidad de Valor Real'), ('CRC', 'CRC - Costa Rican Colon'), ('CUC', 'CUC - Peso Convertible'), ('CUP', 'CUP - Cuban Peso'), ('CVE', 'CVE - Cape Verde Escudo'), ('CZK', 'CZK - Czech Koruna'), ('DJF', 'DJF - Djibouti Franc'), ('DKK', 'DKK - Danish Krone'), ('DOP', 'DOP - Dominican Peso'), ('DZD', 'DZD - Algerian Dinar'), ('EEK', 'EEK - Kroon'), ('EGP', 'EGP - Egyptian Pound'), ('ERN', 'ERN - Nakfa'), ('ETB', 'ETB - Ethiopian Birr'), ('EUR', 'EUR - Euro'), ('FJD', 'FJD - Fiji Dollar'), ('FKP', 'FKP - Falkland Islands Pound'), ('GBP', 'GBP - Pound Sterling'), ('GEL', 'GEL - Lari'), ('GHS', 'GHS - Cedi'), ('GIP', 'GIP - Gibraltar Pound'), ('GMD', 'GMD - Dalasi'), ('GNF', 'GNF - Guinea Franc'), ('GTQ', 'GTQ - Quetzal'), ('GYD', 'GYD - Guyana Dollar'), ('HKD', 'HKD - Hong Kong Dollar'), ('HNL', 'HNL - Lempira'), ('HRK', 'HRK - Kuna'), ('HTG', 'HTG - Gourde'), ('HUF', 'HUF - Forint'), ('IDR', 'IDR - Rupiah'), ('ILS', 'ILS - New Israeli Sheqel'), ('INR', 'INR - Indian Rupee'), ('IQD', 'IQD - Iraqi Dinar'), ('IRR', 'IRR - Iranian Rial'), ('ISK', 'ISK - Iceland Krona'), ('JMD', 'JMD - Jamaican Dollar'), ('JOD', 'JOD - Jordanian Dinar'), ('JPY', 'JPY - Yen'), ('KES', 'KES - Kenyan Shilling'), ('KGS', 'KGS - Som'), ('KHR', 'KHR - Riel'), ('KMF', 'KMF - Comoro Franc'), ('KPW', 'KPW - North Korean Won'), ('KRW', 'KRW - Won'), ('KWD', 'KWD - Kuwaiti Dinar'), ('KYD', 'KYD - Cayman Islands Dollar'), ('KZT', 'KZT - Tenge'), ('LAK', 'LAK - Kip'), ('LBP', 'LBP - Lebanese Pound'), ('LKR', 'LKR - Sri Lanka Rupee'), ('LRD', 'LRD - Liberian Dollar'), ('LSL', 'LSL - Loti'), ('LTL', 'LTL - Lithuanian Litas'), ('LVL', 'LVL - Latvian Lats'), ('LYD', 'LYD - Libyan Dinar'), ('MAD', 'MAD - Moroccan Dirham'), ('MDL', 'MDL - Moldovan Leu'), ('MGA', 'MGA - Malagasy Ariary'), ('MKD', 'MKD - Denar'), ('MMK', 'MMK - Kyat'), ('MNT', 'MNT - Tugrik'), ('MOP', 'MOP - Pataca'), ('MRO', 'MRO - Ouguiya'), ('MUR', 'MUR - Mauritius Rupee'), ('MVR', 'MVR - Rufiyaa'), ('MWK', 'MWK - Malawi Kwacha'), ('MXN', 'MXN - Mexican Peso'), ('MXV', 'MXV - Mexican Unidad de Inversion (UDI)'), ('MYR', 'MYR - Malaysian Ringgit'), ('MZN', 'MZN - Metical'), ('NAD', 'NAD - Namibia Dollar'), ('NGN', 'NGN - Naira'), ('NIO', 'NIO - Cordoba Oro'), ('NOK', 'NOK - Norwegian Krone'), ('NPR', 'NPR - Nepalese Rupee'), ('NZD', 'NZD - New Zealand Dollar'), ('OMR', 'OMR - Rial Omani'), ('PAB', 'PAB - Balboa'), ('PEN', 'PEN - Nuevo Sol'), ('PGK', 'PGK - Kina'), ('PHP', 'PHP - Philippine Peso'), ('PKR', 'PKR - Pakistan Rupee'), ('PLN', 'PLN - Zloty'), ('PYG', 'PYG - Guarani'), ('QAR', 'QAR - Qatari Rial'), ('RON', 'RON - Romanian Leu'), ('RSD', 'RSD - Serbian Dinar'), ('RUB', 'RUB - Russian Ruble'), ('RWF', 'RWF - Rwanda Franc'), ('SAR', 'SAR - Saudi Riyal'), ('SBD', 'SBD - Solomon Islands Dollar'), ('SCR', 'SCR - Seychelles Rupee'), ('SDG', 'SDG - Sudanese Pound'), ('SEK', 'SEK - Swedish Krona'), ('SGD', 'SGD - Singapore Dollar'), ('SHP', 'SHP - Saint Helena Pound'), ('SLL', 'SLL - Leone'), ('SOS', 'SOS - Somali Shilling'), ('SSP', 'SSP - South Sudanese Pound'), ('SRD', 'SRD - Surinam Dollar'), ('STD', 'STD - Dobra'), ('SVC', 'SVC - El Salvador Colon'), ('SYP', 'SYP - Syrian Pound'), ('SZL', 'SZL - Lilangeni'), ('THB', 'THB - Baht'), ('TJS', 'TJS - Somoni'), ('TMT', 'TMT - Manat'), ('TND', 'TND - Tunisian Dinar'), ('TOP', 'TOP - Paanga'), ('TRY', 'TRY - Turkish Lira'), ('TTD', 'TTD - Trinidad and Tobago Dollar'), ('TWD', 'TWD - New Taiwan Dollar'), ('TZS', 'TZS - Tanzanian Shilling'), ('UAH', 'UAH - Hryvnia'), ('UGX', 'UGX - Uganda Shilling'), ('USD', 'USD - US Dollar'), ('USN', 'USN - US Dollar (Next day)'), ('USS', 'USS - US Dollar (Same day)'), ('UYI', 'UYI - Uruguay Peso en Unidades Indexadas'), ('UYU', 'UYU - Peso Uruguayo'), ('UZS', 'UZS - Uzbekistan Sum'), ('VEF', 'VEF - Bolivar'), ('VND', 'VND - Dong'), ('VUV', 'VUV - Vatu'), ('WST', 'WST - Tala'), ('XAF', 'XAF - CFA Franc BEAC'), ('XBT', 'XBT - Bitcoin'), ('XCD', 'XCD - East Caribbean Dollar'), ('XDR', 'XDR - International Monetary Fund (IMF) Special Drawing Right (SDR)'), ('XOF', 'XOF - CFA Franc BCEAO'), ('XPF', 'XPF - CFP Franc'), ('YER', 'YER - Yemeni Rial'), ('ZAR', 'ZAR - Rand'), ('ZMK', 'ZMK - Zambian Kwacha'), ('ZWL', 'ZWL - Zimbabwe Dollar')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_terms_rate1',
            field=models.DecimalField(decimal_places=2, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], max_digits=5, blank=True, null=True, verbose_name='loan terms rate 1'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='loan_terms_rate2',
            field=models.DecimalField(decimal_places=2, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], max_digits=5, blank=True, null=True, verbose_name='loan terms rate 2'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='principal_arrears',
            field=models.DecimalField(null=True, verbose_name='loan status principal arrears', max_digits=10, decimal_places=2, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='principal_outstanding',
            field=models.DecimalField(null=True, verbose_name='loan status principal outstanding', max_digits=10, decimal_places=2, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_final_date',
            field=models.DateField(null=True, verbose_name='loan terms final repayment date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_first_date',
            field=models.DateField(null=True, verbose_name='loan terms first repayment date', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_plan',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, max_length=2, verbose_name='loan terms repayment plan', choices=[('1', '1 - Annual'), ('2', '2 - Semi-annual'), ('4', '4 - Quarterly'), ('12', '12 - Monthly')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='crsadd',
            name='repayment_type',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, max_length=1, verbose_name='loan terms repayment type', choices=[('1', '1 - Equal Principal Payments (EPP)'), ('2', '2 - Annuity'), ('3', '3 - Lump sum'), ('5', '5 - Other')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='humanitarianscope',
            name='code',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A code for the event or action from the vocabulary specified. More information on the vocabularies can be found here: <a href="http://glidenumber.net/glide/public/search/search.jsp" target="_blank">Glide</a> and <a href="http://fts.unocha.org/docs/IATICodelist_HS2-1.csv" target="_blank">Humanitarian plan</a>.', max_length=25, verbose_name='humanitarian scope code', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='humanitarianscope',
            name='vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='A recognised vocabulary of terms classifying the event or action. See the <a href="http://iatistandard.org/202/codelists/HumanitarianScopeVocabulary/" target="_blank">IATI codelist</a>.', max_length=3, verbose_name='humanitarian scope vocabulary', choices=[('1-1', '1-1 - UN OCHA FTS'), ('1-2', '1-2 - Glide'), ('2-1', '2-1 - Humanitarian Plan'), ('99', '99 - Reporting Organisation')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperiodactualdimension',
            name='value',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The value that is being being disaggregated (e.g. "Older than 60 years").', max_length=100, verbose_name='dimension value', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperiodactuallocation',
            name='location',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A location of the actual of this indicator period. The location must be the reference of an existing location of the current project.', max_length=25, verbose_name='location', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperiodtargetdimension',
            name='value',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The value that is being being disaggregated (e.g. "Older than 60 years").', max_length=100, verbose_name='dimension value', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperiodtargetlocation',
            name='location',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A location of the target of this indicator period. The location must be the reference of an existing location of the current project.', max_length=25, verbose_name='location', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorreference',
            name='reference',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='A code for an indicator defined in the specified vocabulary specified. For more information on the indicator reference, see the <a href="http://iatistandard.org/202/codelists/IndicatorVocabulary/" target="_blank">IATI codelist</a>.', max_length=25, verbose_name='reference code', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorreference',
            name='vocabulary',
            field=akvo.rsr.fields.ValidXMLCharField(blank=True, help_text='This is the code for the vocabulary used to describe the sector. Sectors should be mapped to DAC sectors to enable international comparison. For more information on the indicator reference, see the <a href="http://iatistandard.org/202/codelists/IndicatorVocabulary/" target="_blank">IATI codelist</a>.', max_length=2, verbose_name='reference vocabulary', choices=[('1', '1 - WHO Registry'), ('2', '2 - Sphere Handbook'), ('3', '3 - US Foreign Assistance Framework'), ('4', '4 - World Bank World Development Indicators'), ('5', '5 - UN Millennium Development Goals Indicators'), ('6', '6 - UNOCHA Humanitarian Response Indicators'), ('7', '7 - HIV/AIDS Indicator Registry'), ('99', '99 - Reporting Organisation')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorreference',
            name='vocabulary_uri',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.', max_length=1000, verbose_name='reference indicator URI', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='legacydata',
            name='iati_equivalent',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=1000, verbose_name='iati equivalent', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='legacydata',
            name='name',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=1000, verbose_name='name', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='legacydata',
            name='value',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=1000, verbose_name='value', blank=True),
            preserve_default=True,
        ),
    ]
