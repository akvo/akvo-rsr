This page is to provide you with a basic file template that can be used to populate Projects and Organisations in RSR using the Akvo API.

In addition we have the RSR API Implementation Schedule that has been created and displays the all this information in a tabular format:

[RSR Implementation Schedule Oct 2013](https://www.dropbox.com/s/jzfi9tkwuty4323/RSR_Implementation_Schedule_Oct2013.xlsx)

# Project File

```
<iati-activity xmlns:akvo="http://www.akvo.org" xml:lang="en" default-currency="EUR">
<!--
 The Akvo Namespace, Language and Currency identifiers for the Activity
-->
<iati-identifier akvo:internal-project-id="751">NL-KVK-819794727-11111</iati-identifier>
<!--
 IATI Activity ID and the Partner ID as present in own PMS or System are mentioned 
-->
<title>Project Title</title>
<!--  Project Title max 45 characters  -->
<description type="1" akvo:type="4">Project Subtitle</description>
<!--
 Project Subtitle - not officially within IATI, use the Akvo namespace - max 75 characters 
-->
<activity-status code="3">Implementation</activity-status>
<!--
Project Status based on IATI Codes http://iatistandard.org/codelists/activity_status/
IATI to Akvo RSR Status mapping:
Pipeline/identification => Needs Funding
Implementation => Active
Completion => Completed
Post-completion => Completed
Cancelled => Cancelled 
-->
<activity-date type="start-actual">2013-01-01</activity-date>
<!--  Start Date in yyyy-mm-dd format  -->
<activity-date type="end-planned">2015-01-01</activity-date>
<!--  End Date in yyyy-mm-dd format  -->
<description type="1" akvo:type="5">This is a short summary of the project</description>
<!--
 Project Summary - not officially within IATI, use the Akvo namespace - max 400 characters 
-->
<description type="1" akvo:type="6">This is the background of the project</description>
<!--
 Project Background (also known as Context) - not officially within IATI, use the Akvo namespace - max 1000 characters 
-->
<description type="1" akvo:type="9">This is the current status of the project</description>
<!--
 Current Status - not officially within IATI, use the Akvo namespace - max 600 characters 
-->
<description type="1" akvo:type="7">This is the plan of the project</description>
<!--
 Project Plan - not officially within IATI, use the Akvo namespace 
-->
<description type="1" akvo:type="10">This is the Sustainability plan of the project</description>
<!--
 Sustainability - not officially within IATI, use the Akvo namespace 
-->
<description type="2" akvo:type="8">This is the overview of goals of the project</description>
<!--
 Goals Overview - not officially within IATI, use the Akvo namespace - max 600 characters 
-->
<document-link akvo:photo-id="751.png" akvo:photo-credit="Credit for the photo" akvo:caption="Photo Caption" url="" format="application/pdf" category="A08">
<!--
 Used to add an image to a Project. Either enter the Filename of an accompanying file, or enter the URL of a publicly accessible image file. Photo Credit and Caption - max 50 characters per field.

Format field should contain the MIME File Type of the Image being submitted. A list of supported types is available here: http://www.freeformatter.com/mime-types-list.html

Document Category should be selected from the IATI List available at: http://iatistandard.org/codelists/document_category/. We recommend the use of A06, A07 or A08, but any applicable code from the list can be used.

-->
</document-link>
<result type="1">
<title>This is the first goal</title>
<!--
 Goals = Result Type 1. Allowed up to 8 x Goals - max 100 characters 
-->
</result>
<result type="1">
<title>This is the second goal</title>
</result>
<result type="1">
<title>This is the third goal</title>
</result>
<location>
<location-type code="PPLC">Capital of a political entity</location-type>
<!--
 Location Type from IATI: http://iatistandard.org/codelists/location_type/ 
-->
<name>Amsterdam</name>
<!--
 Name for the Location Type. This will be mapped to the correct RSR Field based on Location Type 
-->
<administrative country="NL">Netherlands</administrative>
<!--
 Country should include ISO3166 2 digit Country Code 
-->
<coordinates latitude="52.372292" longitude="4.90798"/>
<!--
 Coordinates in standard format with decimal point and up to 6 figures after the decimal 
-->
</location>
<budget type="1">
<!--
 Budget Type from IATI: http://iatistandard.org/codelists/budget_type/ 
-->
<period-start iso-date="2013-01-01"/>
<!--
 Start Date for the Budget. If not including separated budgets, use the Project Start Date 
-->
<period-end iso-date="2015-01-01"/>
<!--
 Start Date for the Budget. If not including separated budgets, use the Project End Date 
-->
<value value-date="2015-01-01" akvo:type="Equipment">200</value>
<!--
 Individual Budget Items - Use the Akvo Namespace for Type and Choose from the list available here: https://gist.github.com/zzgvh/7008240
-->
<value value-date="2015-01-01" akvo:type="Other">5</value>
<value value-date="2015-01-01">205</value>
</budget>
<participating-org role="Accountable" ref="NL-KVK-819794727" type="60" akvo:internal-org-ref="SUPP1">Akvo</participating-org>
<!--
 Add the Organisation Role as per the IATI Codelist: http://iatistandard.org/codelists/organisation_role/. These will be mapped as follows:
	Accountable => Support, Implementing => Field, Funding => Funding, Extending => Sponsor	
	Reference included should be IATI Organisation ID if known
	Type is taken from the IATI Codelist: http://iatistandard.org/codelists/organisation_type/
	Internal Reference used by an Organisation to Idetify it's Partners can be used inside the Akvo Namespace. Each time a partner is refereced the same Internal ID Must be used
	Name of Organisation - max 75 characters 
-->
<participating-org role="Funding" ref="NL-KVK-1234567" type="21" akvo:internal-org-ref="FUND1">Funding Partner</participating-org>
<participating-org role="Implementing" ref="NL-KVK-7654321" type="23" akvo:internal-org-ref="FIELD1">Field Partner</participating-org>
<transaction>
<transaction-type code="IF">Incoming Funds</transaction-type>
<provider-org ref="NL-KVK-1234567">Funding Partner</provider-org>
<value>205</value>
</transaction>
<!--
Transactions included here refer to displaying the Funding information for a project/activity. Additional Transactions can be used for other IATI Purposes, that may not be displayed in Akvo RSR.
-->
<result type="2">
<indicator measure="1" akvo:subject="People" akvo:effect="Trained" akvo:category="12261">
<title>People trained in Health Education</title>
<period>
<target value="20"/>
</period>
</indicator>
<!--
 Indicators = Result Type 2.
		Indicator Mesasure from IATI Codelist: http://iatistandard.org/codelists/indicator_measure/
		Subject and Effect - not available in IATI, use the Akvo Namespace. List available here: https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#indicator-and-categories
		Category comes from IATI DAC Codelist: http://iatistandard.org/codelists/sector/
		Title - max 80 characters 
-->
<indicator measure="1" akvo:subject="People" akvo:effect="Trained" akvo:category="12261">
<title>Students received higher level training</title>
<period>
<target value="10"/>
</period>
</indicator>
</result>
</iati-activity>
```

# Organisation File

```
<organisation>
<org_id type="integer">105435</org_id><!-- must be unique for all projects -->
<iati_org_id>BR-AAA-111111</iati_org_id><!-- IATI Organisation Identifier -->
<name>APROSSA</name><!--  * max 25 -->
<long_name>Afrique Verte Burkina</long_name><!-- * max 75 -->
<language>fr</language><!-- * en/nl/fr/es/de/ru -->
<iati_organisation_type type="integer">22</iati_organisation_type><!-- * CODE LIST 1 -->
<description>L’Association pour la Promotion de la Sécurité et de la Souveraineté Alimentaires au Burkina (APROSSA - Afrique Verte Burkina) a été créée en juillet 2005.APROSSA est présente dans les zones du Sahel, Centre-Est, Centre Nord, Boucle du Mouhoun, Hauts Bassins, Est, Centre, Cascades pour l'appui aux organisations paysannes, aux transformatrices. A Banfora  un projet d’appui aux artisans a été conduit de 2009 à 2011. Les zones d'intervention varient selon les financements en cours.APROSSA apporte ainsi un appui à plus de 160 organisations paysannes céréalières fédérées en 5 unions régionales, ainsi qu'à une soixantaine d'unités de transformation féminines, fédérées en un réseau national dénommé Réseau des Transformatrices de céréales du Faso (RTCF).</description><!-- unlimited -->
<contact_person>Philippe KI</contact_person><!-- max 25 -->
<phone>0022650341139</phone><!-- max 25 -->
<fax>0022650343624</fax><!-- max 25 -->
<contact_email>afrique.verte@gmail.com</contact_email><!-- max 25 -->
<mobile>0022670423431</mobile><!-- max 25 -->
<url>http://www.afriqueverte.org/</url><!-- max 25 -->
<logo_id type="integer">105435</logo_id><!-- must be unique and identify the logo file -->
<locations type="list">
	<object>
		<primary type="boolean">True</primary><!-- * 1 x TRUE per Organisation -->
		<latitude type="float">12.363101</latitude><!-- * valid decimal geo-location -->
		<longitude type="float">-1.526456</longitude><!-- * valid decimal geo-location -->
		<address_1/><!-- max 255 -->
		<address_2/><!-- max 255 -->
		<city>Ouagadougou</city><!-- max 255 -->
		<state/><!-- max 255 -->
		<postcode/><!-- max 10 -->
		<country>Burkina Faso</country><!-- * CODE LIST 2 ISO 3166 -->
		<iso_code>bf</iso_code><!-- * CODE LIST 2 ISO 3166 -->
		<continent>Africa</continent><!-- CODE LIST 3 -->
		<continent_code>af</continent_code><!-- CODE LIST 3 -->
	</object>
</locations>
</organisation>
<!-- CODE LIST 1 - IATI_LIST_ORGANISATION_TYPE
10	Government
15	Other Public Sector
21	International NGO
22	National NGO
23	Regional NGO
30	Public Private Partnership
40	Multilateral
60	Foundation
70	Private Sector
80	Academic, Training and Research
-->
<!-- CODE LIST 2 ISO 3166 COUNTRY LIST
AF	AFGHANISTAN
AX	ÅLAND ISLANDS
AL	ALBANIA
DZ	ALGERIA
AS	AMERICAN SAMOA
AD	ANDORRA
AO	ANGOLA
AI	ANGUILLA
AQ	ANTARCTICA
AG	ANTIGUA AND BARBUDA
AR	ARGENTINA
AM	ARMENIA
AW	ARUBA
AU	AUSTRALIA
AT	AUSTRIA
AZ	AZERBAIJAN
BS	BAHAMAS
BH	BAHRAIN
BD	BANGLADESH
BB	BARBADOS
BY	BELARUS
BE	BELGIUM
BZ	BELIZE
BJ	BENIN
BM	BERMUDA
BT	BHUTAN
BO	BOLIVIA, PLURINATIONAL STATE OF
BQ	BONAIRE, SINT EUSTATIUS AND SABA
BA	BOSNIA AND HERZEGOVINA
BW	BOTSWANA
BV	BOUVET ISLAND
BR	BRAZIL
IO	BRITISH INDIAN OCEAN TERRITORY
BN	BRUNEI DARUSSALAM
BG	BULGARIA
BF	BURKINA FASO
BI	BURUNDI
KH	CAMBODIA
CM	CAMEROON
CA	CANADA
CV	CAPE VERDE
KY	CAYMAN ISLANDS
CF	CENTRAL AFRICAN REPUBLIC
TD	CHAD
CL	CHILE
CN	CHINA
CX	CHRISTMAS ISLAND
CC	COCOS (KEELING) ISLANDS
CO	COLOMBIA
KM	COMOROS
CG	CONGO
CD	CONGO, THE DEMOCRATIC REPUBLIC OF THE
CK	COOK ISLANDS
CR	COSTA RICA
CI	CÔTE D'IVOIRE
HR	CROATIA
CU	CUBA
CW	CURAÇAO
CY	CYPRUS
CZ	CZECH REPUBLIC
DK	DENMARK
DJ	DJIBOUTI
DM	DOMINICA
DO	DOMINICAN REPUBLIC
EC	ECUADOR
EG	EGYPT
SV	EL SALVADOR
GQ	EQUATORIAL GUINEA
ER	ERITREA
EE	ESTONIA
ET	ETHIOPIA
FK	FALKLAND ISLANDS (MALVINAS)
FO	FAROE ISLANDS
FJ	FIJI
FI	FINLAND
FR	FRANCE
GF	FRENCH GUIANA
PF	FRENCH POLYNESIA
TF	FRENCH SOUTHERN TERRITORIES
GA	GABON
GM	GAMBIA
GE	GEORGIA
DE	GERMANY
GH	GHANA
GI	GIBRALTAR
GR	GREECE
GL	GREENLAND
GD	GRENADA
GP	GUADELOUPE
GU	GUAM
GT	GUATEMALA
GG	GUERNSEY
GN	GUINEA
GW	GUINEA-BISSAU
GY	GUYANA
HT	HAITI
HM	HEARD ISLAND AND MCDONALD ISLANDS
VA	HOLY SEE (VATICAN CITY STATE)
HN	HONDURAS
HK	HONG KONG
HU	HUNGARY
IS	ICELAND
IN	INDIA
ID	INDONESIA
IR	IRAN, ISLAMIC REPUBLIC OF
IQ	IRAQ
IE	IRELAND
IM	ISLE OF MAN
IL	ISRAEL
IT	ITALY
JM	JAMAICA
JP	JAPAN
JE	JERSEY
JO	JORDAN
KZ	KAZAKHSTAN
KE	KENYA
KI	KIRIBATI
KP	KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF
KR	KOREA, REPUBLIC OF
KW	KUWAIT
KG	KYRGYZSTAN
LA	LAO PEOPLE'S DEMOCRATIC REPUBLIC
LV	LATVIA
LB	LEBANON
LS	LESOTHO
LR	LIBERIA
LY	LIBYA
LI	LIECHTENSTEIN
LT	LITHUANIA
LU	LUXEMBOURG
MO	MACAO
MK	MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF
MG	MADAGASCAR
MW	MALAWI
MY	MALAYSIA
MV	MALDIVES
ML	MALI
MT	MALTA
MH	MARSHALL ISLANDS
MQ	MARTINIQUE
MR	MAURITANIA
MU	MAURITIUS
YT	MAYOTTE
MX	MEXICO
FM	MICRONESIA, FEDERATED STATES OF
MD	MOLDOVA, REPUBLIC OF
MC	MONACO
MN	MONGOLIA
ME	MONTENEGRO
MS	MONTSERRAT
MA	MOROCCO
MZ	MOZAMBIQUE
MM	MYANMAR
NA	NAMIBIA
NR	NAURU
NP	NEPAL
NL	NETHERLANDS
NC	NEW CALEDONIA
NZ	NEW ZEALAND
NI	NICARAGUA
NE	NIGER
NG	NIGERIA
NU	NIUE
NF	NORFOLK ISLAND
MP	NORTHERN MARIANA ISLANDS
NO	NORWAY
OM	OMAN
PK	PAKISTAN
PW	PALAU
PS	PALESTINE, STATE OF
PA	PANAMA
PG	PAPUA NEW GUINEA
PY	PARAGUAY
PE	PERU
PH	PHILIPPINES
PN	PITCAIRN
PL	POLAND
PT	PORTUGAL
PR	PUERTO RICO
QA	QATAR
RE	RÉUNION
RO	ROMANIA
RU	RUSSIAN FEDERATION
RW	RWANDA
BL	SAINT BARTHÉLEMY
SH	SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
KN	SAINT KITTS AND NEVIS
LC	SAINT LUCIA
MF	SAINT MARTIN (FRENCH PART)
PM	SAINT PIERRE AND MIQUELON
VC	SAINT VINCENT AND THE GRENADINES
WS	SAMOA
SM	SAN MARINO
ST	SAO TOME AND PRINCIPE
SA	SAUDI ARABIA
SN	SENEGAL
RS	SERBIA
SC	SEYCHELLES
SL	SIERRA LEONE
SG	SINGAPORE
SX	SINT MAARTEN (DUTCH PART)
SK	SLOVAKIA
SI	SLOVENIA
SB	SOLOMON ISLANDS
SO	SOMALIA
ZA	SOUTH AFRICA
GS	SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
SS	SOUTH SUDAN
ES	SPAIN
LK	SRI LANKA
SD	SUDAN
SR	SURINAME
SJ	SVALBARD AND JAN MAYEN
SZ	SWAZILAND
SE	SWEDEN
CH	SWITZERLAND
SY	SYRIAN ARAB REPUBLIC
TW	TAIWAN, PROVINCE OF CHINA
TJ	TAJIKISTAN
TZ	TANZANIA, UNITED REPUBLIC OF
TH	THAILAND
TL	TIMOR-LESTE
TG	TOGO
TK	TOKELAU
TO	TONGA
TT	TRINIDAD AND TOBAGO
TN	TUNISIA
TR	TURKEY
TM	TURKMENISTAN
TC	TURKS AND CAICOS ISLANDS
TV	TUVALU
UG	UGANDA
UA	UKRAINE
AE	UNITED ARAB EMIRATES
GB	UNITED KINGDOM
US	UNITED STATES
UM	UNITED STATES MINOR OUTLYING ISLANDS
UY	URUGUAY
UZ	UZBEKISTAN
VU	VANUATU
VE	VENEZUELA, BOLIVARIAN REPUBLIC OF
VN	VIET NAM
VG	VIRGIN ISLANDS, BRITISH
VI	VIRGIN ISLANDS, U.S.
WF	WALLIS AND FUTUNA
EH	WESTERN SAHARA
YE	YEMEN
ZM	ZAMBIA
ZW	ZIMBABWE
-->
<!-- CODE LIST 3 CONTINENT LIST
af	Africa
as	Asia
eu	Europe
na	North America
sa	South America
oc	Oceania
an	Antarctica
-->
```