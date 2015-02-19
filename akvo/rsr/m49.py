# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

M49_CODES = (
    (
        u"1",
        u"World"
    ),
    (
        u"2",
        u"Africa"
    ),
    (
        u"3",
        u"North America"
    ),
    (
        u"4",
        u"Afghanistan"
    ),
    (
        u"5",
        u"South America"
    ),
    (
        u"8",
        u"Albania"
    ),
    (
        u"9",
        u"Oceania"
    ),
    (
        u"11",
        u"Western Africa"
    ),
    (
        u"12",
        u"Algeria"
    ),
    (
        u"13",
        u"Central America"
    ),
    (
        u"14",
        u"Eastern Africa"
    ),
    (
        u"15",
        u"Northern Africa"
    ),
    (
        u"16",
        u"American Samoa"
    ),
    (
        u"17",
        u"Middle Africa"
    ),
    (
        u"18",
        u"Southern Africa"
    ),
    (
        u"19",
        u"Americas"
    ),
    (
        u"20",
        u"Andorra"
    ),
    (
        u"21",
        u"Northern America"
    ),
    (
        u"24",
        u"Angola"
    ),
    (
        u"28",
        u"Antigua and Barbuda"
    ),
    (
        u"29",
        u"Caribbean"
    ),
    (
        u"30",
        u"Eastern Asia"
    ),
    (
        u"31",
        u"Azerbaijan"
    ),
    (
        u"32",
        u"Argentina"
    ),
    (
        u"34",
        u"Southern Asia"
    ),
    (
        u"35",
        u"South-Eastern Asia"
    ),
    (
        u"36",
        u"Australia"
    ),
    (
        u"39",
        u"Southern Europe"
    ),
    (
        u"40",
        u"Austria"
    ),
    (
        u"44",
        u"Bahamas"
    ),
    (
        u"48",
        u"Bahrain"
    ),
    (
        u"50",
        u"Bangladesh"
    ),
    (
        u"51",
        u"Armenia"
    ),
    (
        u"52",
        u"Barbados"
    ),
    (
        u"53",
        u"Australia and New Zealand"
    ),
    (
        u"54",
        u"Melanesia"
    ),
    (
        u"56",
        u"Belgium"
    ),
    (
        u"57",
        u"Micronesia"
    ),
    (
        u"60",
        u"Bermuda"
    ),
    (
        u"61",
        u"Polynesia"
    ),
    (
        u"64",
        u"Bhutan"
    ),
    (
        u"68",
        u"Bolivia (Plurinational State of)"
    ),
    (
        u"70",
        u"Bosnia and Herzegovina"
    ),
    (
        u"72",
        u"Botswana"
    ),
    (
        u"76",
        u"Brazil"
    ),
    (
        u"84",
        u"Belize"
    ),
    (
        u"90",
        u"Solomon Islands"
    ),
    (
        u"92",
        u"British Virgin Islands"
    ),
    (
        u"96",
        u"Brunei Darussalam"
    ),
    (
        u"100",
        u"Bulgaria"
    ),
    (
        u"104",
        u"Myanmar"
    ),
    (
        u"108",
        u"Burundi"
    ),
    (
        u"112",
        u"Belarus"
    ),
    (
        u"116",
        u"Cambodia"
    ),
    (
        u"120",
        u"Cameroon"
    ),
    (
        u"124",
        u"Canada"
    ),
    (
        u"132",
        u"Cabo Verde"
    ),
    (
        u"136",
        u"Cayman Islands"
    ),
    (
        u"140",
        u"Central African Republic"
    ),
    (
        u"142",
        u"Asia"
    ),
    (
        u"143",
        u"Central Asia"
    ),
    (
        u"144",
        u"Sri Lanka"
    ),
    (
        u"145",
        u"Western Asia"
    ),
    (
        u"148",
        u"Chad"
    ),
    (
        u"150",
        u"Europe"
    ),
    (
        u"151",
        u"Eastern Europe"
    ),
    (
        u"152",
        u"Chile"
    ),
    (
        u"154",
        u"Northern Europe"
    ),
    (
        u"155",
        u"Western Europe"
    ),
    (
        u"156",
        u"China"
    ),
    (
        u"170",
        u"Colombia"
    ),
    (
        u"174",
        u"Comoros"
    ),
    (
        u"175",
        u"Mayotte"
    ),
    (
        u"178",
        u"Congo"
    ),
    (
        u"180",
        u"Democratic Republic of the Congo"
    ),
    (
        u"184",
        u"Cook Islands"
    ),
    (
        u"188",
        u"Costa Rica"
    ),
    (
        u"191",
        u"Croatia"
    ),
    (
        u"192",
        u"Cuba"
    ),
    (
        u"196",
        u"Cyprus"
    ),
    (
        u"203",
        u"Czech Republic"
    ),
    (
        u"204",
        u"Benin"
    ),
    (
        u"208",
        u"Denmark"
    ),
    (
        u"212",
        u"Dominica"
    ),
    (
        u"214",
        u"Dominican Republic"
    ),
    (
        u"218",
        u"Ecuador"
    ),
    (
        u"222",
        u"El Salvador"
    ),
    (
        u"226",
        u"Equatorial Guinea"
    ),
    (
        u"231",
        u"Ethiopia"
    ),
    (
        u"232",
        u"Eritrea"
    ),
    (
        u"233",
        u"Estonia"
    ),
    (
        u"234",
        u"Faeroe Islands"
    ),
    (
        u"238",
        u"Falkland Islands (Malvinas)"
    ),
    (
        u"242",
        u"Fiji"
    ),
    (
        u"246",
        u"Finland"
    ),
    (
        u"248",
        u"Åland Islands"
    ),
    (
        u"250",
        u"France"
    ),
    (
        u"254",
        u"French Guiana"
    ),
    (
        u"258",
        u"French Polynesia"
    ),
    (
        u"262",
        u"Djibouti"
    ),
    (
        u"266",
        u"Gabon"
    ),
    (
        u"268",
        u"Georgia"
    ),
    (
        u"270",
        u"Gambia"
    ),
    (
        u"275",
        u"State of Palestine"
    ),
    (
        u"276",
        u"Germany"
    ),
    (
        u"288",
        u"Ghana"
    ),
    (
        u"292",
        u"Gibraltar"
    ),
    (
        u"296",
        u"Kiribati"
    ),
    (
        u"300",
        u"Greece"
    ),
    (
        u"304",
        u"Greenland"
    ),
    (
        u"308",
        u"Grenada"
    ),
    (
        u"312",
        u"Guadeloupe"
    ),
    (
        u"316",
        u"Guam"
    ),
    (
        u"320",
        u"Guatemala"
    ),
    (
        u"324",
        u"Guinea"
    ),
    (
        u"328",
        u"Guyana"
    ),
    (
        u"332",
        u"Haiti"
    ),
    (
        u"336",
        u"Holy See"
    ),
    (
        u"340",
        u"Honduras"
    ),
    (
        u"344",
        u"China, Hong Kong Special Administrative Region"
    ),
    (
        u"348",
        u"Hungary"
    ),
    (
        u"352",
        u"Iceland"
    ),
    (
        u"356",
        u"India"
    ),
    (
        u"360",
        u"Indonesia"
    ),
    (
        u"364",
        u"Iran (Islamic Republic of)"
    ),
    (
        u"368",
        u"Iraq"
    ),
    (
        u"372",
        u"Ireland"
    ),
    (
        u"376",
        u"Israel"
    ),
    (
        u"380",
        u"Italy"
    ),
    (
        u"384",
        u"Cote d'Ivoire"
    ),
    (
        u"388",
        u"Jamaica"
    ),
    (
        u"392",
        u"Japan"
    ),
    (
        u"398",
        u"Kazakhstan"
    ),
    (
        u"400",
        u"Jordan"
    ),
    (
        u"404",
        u"Kenya"
    ),
    (
        u"408",
        u"Democratic People's Republic of Korea"
    ),
    (
        u"410",
        u"Republic of Korea"
    ),
    (
        u"414",
        u"Kuwait"
    ),
    (
        u"417",
        u"Kyrgyzstan"
    ),
    (
        u"418",
        u"Lao People's Democratic Republic"
    ),
    (
        u"419",
        u"Latin America and the Caribbean"
    ),
    (
        u"422",
        u"Lebanon"
    ),
    (
        u"426",
        u"Lesotho"
    ),
    (
        u"428",
        u"Latvia"
    ),
    (
        u"430",
        u"Liberia"
    ),
    (
        u"434",
        u"Libya"
    ),
    (
        u"438",
        u"Liechtenstein"
    ),
    (
        u"440",
        u"Lithuania"
    ),
    (
        u"442",
        u"Luxembourg"
    ),
    (
        u"446",
        u"China, Macao Special Administrative Region"
    ),
    (
        u"450",
        u"Madagascar"
    ),
    (
        u"454",
        u"Malawi"
    ),
    (
        u"458",
        u"Malaysia"
    ),
    (
        u"462",
        u"Maldives"
    ),
    (
        u"466",
        u"Mali"
    ),
    (
        u"470",
        u"Malta"
    ),
    (
        u"474",
        u"Martinique"
    ),
    (
        u"478",
        u"Mauritania"
    ),
    (
        u"480",
        u"Mauritius"
    ),
    (
        u"484",
        u"Mexico"
    ),
    (
        u"492",
        u"Monaco"
    ),
    (
        u"496",
        u"Mongolia"
    ),
    (
        u"498",
        u"Republic of Moldova"
    ),
    (
        u"499",
        u"Montenegro"
    ),
    (
        u"500",
        u"Montserrat"
    ),
    (
        u"504",
        u"Morocco"
    ),
    (
        u"508",
        u"Mozambique"
    ),
    (
        u"512",
        u"Oman"
    ),
    (
        u"516",
        u"Namibia"
    ),
    (
        u"520",
        u"Nauru"
    ),
    (
        u"524",
        u"Nepal"
    ),
    (
        u"528",
        u"Netherlands"
    ),
    (
        u"531",
        u"Curaçao"
    ),
    (
        u"533",
        u"Aruba"
    ),
    (
        u"534",
        u"Sint Maarten (Dutch part)"
    ),
    (
        u"535",
        u"Bonaire, Sint Eustatius and Saba"
    ),
    (
        u"540",
        u"New Caledonia"
    ),
    (
        u"548",
        u"Vanuatu"
    ),
    (
        u"554",
        u"New Zealand"
    ),
    (
        u"558",
        u"Nicaragua"
    ),
    (
        u"562",
        u"Niger"
    ),
    (
        u"566",
        u"Nigeria"
    ),
    (
        u"570",
        u"Niue"
    ),
    (
        u"574",
        u"Norfolk Island"
    ),
    (
        u"578",
        u"Norway"
    ),
    (
        u"580",
        u"Northern Mariana Islands"
    ),
    (
        u"583",
        u"Micronesia (Federated States of)"
    ),
    (
        u"584",
        u"Marshall Islands"
    ),
    (
        u"585",
        u"Palau"
    ),
    (
        u"586",
        u"Pakistan"
    ),
    (
        u"591",
        u"Panama"
    ),
    (
        u"598",
        u"Papua New Guinea"
    ),
    (
        u"600",
        u"Paraguay"
    ),
    (
        u"604",
        u"Peru"
    ),
    (
        u"608",
        u"Philippines"
    ),
    (
        u"612",
        u"Pitcairn"
    ),
    (
        u"616",
        u"Poland"
    ),
    (
        u"620",
        u"Portugal"
    ),
    (
        u"624",
        u"Guinea Bissau"
    ),
    (
        u"626",
        u"Timor-Leste"
    ),
    (
        u"630",
        u"Puerto Rico"
    ),
    (
        u"634",
        u"Qatar"
    ),
    (
        u"638",
        u"Réunion"
    ),
    (
        u"642",
        u"Romania"
    ),
    (
        u"643",
        u"Russian Federation"
    ),
    (
        u"646",
        u"Rwanda"
    ),
    (
        u"652",
        u"Saint-Barthélemy"
    ),
    (
        u"654",
        u"Saint Helena"
    ),
    (
        u"659",
        u"Saint Kitts and Nevis"
    ),
    (
        u"660",
        u"Anguilla"
    ),
    (
        u"662",
        u"Saint Lucia"
    ),
    (
        u"663",
        u"Saint Martin (French part)"
    ),
    (
        u"666",
        u"Saint Pierre and Miquelon"
    ),
    (
        u"670",
        u"Saint Vincent and the Grenadines"
    ),
    (
        u"674",
        u"San Marino"
    ),
    (
        u"678",
        u"Sao Tome and Principe"
    ),
    (
        u"682",
        u"Saudi Arabia"
    ),
    (
        u"686",
        u"Senegal"
    ),
    (
        u"688",
        u"Serbia"
    ),
    (
        u"690",
        u"Seychelles"
    ),
    (
        u"694",
        u"Sierra Leone"
    ),
    (
        u"702",
        u"Singapore"
    ),
    (
        u"703",
        u"Slovakia"
    ),
    (
        u"704",
        u"Viet Nam"
    ),
    (
        u"705",
        u"Slovenia"
    ),
    (
        u"706",
        u"Somalia"
    ),
    (
        u"710",
        u"South Africa"
    ),
    (
        u"716",
        u"Zimbabwe"
    ),
    (
        u"724",
        u"Spain"
    ),
    (
        u"728",
        u"South Sudan"
    ),
    (
        u"729",
        u"Sudan"
    ),
    (
        u"732",
        u"Western Sahara"
    ),
    (
        u"740",
        u"Suriname"
    ),
    (
        u"744",
        u"Svalbard and Jan Mayen Islands"
    ),
    (
        u"748",
        u"Swaziland"
    ),
    (
        u"752",
        u"Sweden"
    ),
    (
        u"756",
        u"Switzerland"
    ),
    (
        u"760",
        u"Syrian Arab Republic"
    ),
    (
        u"762",
        u"Tajikistan"
    ),
    (
        u"764",
        u"Thailand"
    ),
    (
        u"768",
        u"Togo"
    ),
    (
        u"772",
        u"Tokelau"
    ),
    (
        u"776",
        u"Tonga"
    ),
    (
        u"780",
        u"Trinidad and Tobago"
    ),
    (
        u"784",
        u"United Arab Emirates"
    ),
    (
        u"788",
        u"Tunisia"
    ),
    (
        u"792",
        u"Turkey"
    ),
    (
        u"795",
        u"Turkmenistan"
    ),
    (
        u"796",
        u"Turks and Caicos Islands"
    ),
    (
        u"798",
        u"Tuvalu"
    ),
    (
        u"800",
        u"Uganda"
    ),
    (
        u"804",
        u"Ukraine"
    ),
    (
        u"807",
        u"The former Yugoslav Republic of Macedonia"
    ),
    (
        u"818",
        u"Egypt"
    ),
    (
        u"826",
        u"United Kingdom of Great Britain and Northern Ireland"
    ),
    (
        u"831",
        u"Guernsey"
    ),
    (
        u"832",
        u"Jersey"
    ),
    (
        u"833",
        u"Isle of Man"
    ),
    (
        u"834",
        u"United Republic of Tanzania"
    ),
    (
        u"840",
        u"United States of America"
    ),
    (
        u"850",
        u"United States Virgin Islands"
    ),
    (
        u"854",
        u"Burkina Faso"
    ),
    (
        u"858",
        u"Uruguay"
    ),
    (
        u"860",
        u"Uzbekistan"
    ),
    (
        u"862",
        u"Venezuela (Bolivarian Republic of)"
    ),
    (
        u"876",
        u"Wallis and Futuna Islands"
    ),
    (
        u"882",
        u"Samoa"
    ),
    (
        u"887",
        u"Yemen"
    ),
    (
        u"894",
        u"Zambia"
    ),
)


# Dictionary of M.49 Alpha country and region codes, based on http://unstats.un.org/unsd/methods/m49/m49regin.htm

M49_HIERARCHY = {
    1: [2, 19, 142, 150, 9],
    2: [14, 17, 15, 18, 11],
    3: [21, 29, 13],
    4: ["AF", ],
    5: [32, 68, 76, 152, 170, 218, 238, 254, 328, 600, 604, 740, 858, 862],
    8: ["AL", ],
    9: [53, 54, 57, 61],
    11: [204, 854, 132, 384, 270, 288, 324, 624, 430, 466, 478, 562, 566, 654, 686, 694, 768],
    12: ["DZ", ],
    13: [84, 188, 222, 320, 340, 484, 558, 591],
    14: [108, 174, 262, 232, 231, 404, 450, 454, 480, 175, 508, 638, 646, 690, 706, 728, 800, 834, 894, 716],
    15: [12, 818, 434, 504, 729, 788, 732],
    16: ["AS", ],
    17: [24, 120, 140, 148, 178, 180, 226, 266, 678],
    18: [72, 426, 516, 710, 748],
    19: [419, 21],
    20: ["AD", ],
    21: [60, 124, 304, 666, 840],
    24: ["AO", ],
    28: ["AG", ],
    29: [660, 28, 533, 44, 52, 535, 92, 136, 192, 531, 212, 214, 308, 312, 332, 388, 474, 500, 630, 652, 659, 662, 663,
         670, 534, 780, 796, 850],
    30: [156, 344, 446, 408, 392, 496, 410],
    31: ["AZ", ],
    32: ["AR", ],
    34: [4, 50, 64, 356, 364, 462, 524, 586, 144],
    35: [96, 116, 360, 418, 458, 104, 608, 702, 764, 626, 704],
    36: ["AU", ],
    39: [8, 20, 70, 191, 292, 300, 336, 380, 470, 499, 620, 674, 688, 705, 724, 807],
    40: ["AT", ],
    44: ["BS", ],
    48: ["BH", ],
    50: ["BD", ],
    51: ["AM", ],
    52: ["BB", ],
    53: [36, 554, 574],
    54: [242, 540, 598, 90, 548],
    56: ["BE", ],
    57: [316, 296, 584, 583, 520, 580, 585],
    60: ["BM", ],
    61: [16, 184, 258, 570, 612, 882, 772, 776, 798, 876],
    64: ["BT", ],
    68: ["BO", ],
    70: ["BA", ],
    72: ["BW", ],
    76: ["BR", ],
    84: ["BZ", ],
    90: ["SB", ],
    92: ["VG", ],
    96: ["BN", ],
    100: ["BG", ],
    104: ["MM", ],
    108: ["BI", ],
    112: ["BY", ],
    116: ["KH", ],
    120: ["CM", ],
    124: ["CA", ],
    132: ["CV", ],
    136: ["KY", ],
    140: ["CF", ],
    142: [143, 30, 34, 35, 145],
    143: [398, 417, 762, 795, 860],
    144: ["LK", ],
    145: [51, 31, 48, 196, 268, 368, 376, 400, 414, 422, 512, 634, 682, 275, 760, 792, 784, 887],
    148: ["TD", ],
    150: [151, 154, 39, 155],
    151: [112, 100, 203, 348, 616, 498, 642, 643, 703, 804],
    152: ["CL", ],
    154: [248, 208, 233, 234, 246, 831, 352, 372, 833, 832, 428, 440, 578, 744, 752, 826],
    155: [40, 56, 250, 276, 438, 442, 492, 528, 756],
    156: ["CN", ],
    170: ["CO", ],
    174: ["KM", ],
    175: ["YT", ],
    178: ["CG", ],
    180: ["CD", ],
    184: ["CK", ],
    188: ["CR", ],
    191: ["HR", ],
    192: ["CU", ],
    196: ["CY", ],
    203: ["CZ", ],
    204: ["BJ", ],
    208: ["DK", ],
    212: ["DM", ],
    214: ["DO", ],
    218: ["EC", ],
    222: ["SV", ],
    226: ["GQ", ],
    231: ["ET", ],
    232: ["ER", ],
    233: ["EE", ],
    234: ["FO", ],
    238: ["FK", ],
    242: ["FJ", ],
    246: ["FI", ],
    248: ["AX", ],
    250: ["FR", ],
    254: ["GF", ],
    258: ["PF", ],
    262: ["DJ", ],
    266: ["GA", ],
    268: ["GE", ],
    270: ["GM", ],
    275: ["PS", ],
    276: ["DE", ],
    288: ["GH", ],
    292: ["GI", ],
    296: ["KI", ],
    300: ["GR", ],
    304: ["GL", ],
    308: ["GD", ],
    312: ["GP", ],
    316: ["GU", ],
    320: ["GT", ],
    324: ["GN", ],
    328: ["GY", ],
    332: ["HT", ],
    336: ["VA", ],
    340: ["HN", ],
    344: ["HK", ],
    348: ["HU", ],
    352: ["IS", ],
    356: ["IN", ],
    360: ["ID", ],
    364: ["IR", ],
    368: ["IQ", ],
    372: ["IE", ],
    376: ["IL", ],
    380: ["IT", ],
    384: ["CI", ],
    388: ["JM", ],
    392: ["JP", ],
    398: ["KZ", ],
    400: ["JO", ],
    404: ["KE", ],
    408: ["KP", ],
    410: ["KR", ],
    414: ["KW", ],
    417: ["KG", ],
    418: ["LA", ],
    419: [29, 13, 5],
    422: ["LB", ],
    426: ["LS", ],
    428: ["LV", ],
    430: ["LR", ],
    434: ["LY", ],
    438: ["LI", ],
    440: ["LT", ],
    442: ["LU", ],
    446: ["MO", ],
    450: ["MG", ],
    454: ["MW", ],
    458: ["MY", ],
    462: ["MV", ],
    466: ["ML", ],
    470: ["MT", ],
    474: ["MQ", ],
    478: ["MR", ],
    480: ["MU", ],
    484: ["MX", ],
    492: ["MC", ],
    496: ["MN", ],
    498: ["MD", ],
    499: ["ME", ],
    500: ["MS", ],
    504: ["MA", ],
    508: ["MZ", ],
    512: ["OM", ],
    516: ["NA", ],
    520: ["NR", ],
    524: ["NP", ],
    528: ["NL", ],
    531: ["CW", ],
    533: ["AW", ],
    534: ["SX", ],
    535: ["BQ", ],
    540: ["NC", ],
    548: ["VU", ],
    554: ["NZ", ],
    558: ["NI", ],
    562: ["NE", ],
    566: ["NG", ],
    570: ["NU", ],
    574: ["NF", ],
    578: ["NO", ],
    580: ["MP", ],
    583: ["FM", ],
    584: ["MH", ],
    585: ["PW", ],
    586: ["PK", ],
    591: ["PA", ],
    598: ["PG", ],
    600: ["PY", ],
    604: ["PE", ],
    608: ["PH", ],
    612: ["PN", ],
    616: ["PL", ],
    620: ["PT", ],
    624: ["GW", ],
    626: ["TL", ],
    630: ["PR", ],
    634: ["QA", ],
    638: ["RE", ],
    642: ["RO", ],
    643: ["RU", ],
    646: ["RW", ],
    652: ["BL", ],
    654: ["SH", ],
    659: ["KN", ],
    660: ["AI", ],
    662: ["LC", ],
    663: ["MF", ],
    666: ["PM", ],
    670: ["VC", ],
    674: ["SM", ],
    678: ["ST", ],
    682: ["SA", ],
    686: ["SN", ],
    688: ["RS", ],
    690: ["SC", ],
    694: ["SL", ],
    702: ["SG", ],
    703: ["SK", ],
    704: ["VN", ],
    705: ["SI", ],
    706: ["SO", ],
    710: ["ZA", ],
    716: ["ZW", ],
    724: ["ES", ],
    728: ["SS", ],
    729: ["SD", ],
    732: ["EH", ],
    740: ["SR", ],
    744: ["SJ", ],
    748: ["SZ", ],
    752: ["SE", ],
    756: ["CH", ],
    760: ["SY", ],
    762: ["TJ", ],
    764: ["TH", ],
    768: ["TG", ],
    772: ["TK", ],
    776: ["TO", ],
    780: ["TT", ],
    784: ["AE", ],
    788: ["TN", ],
    792: ["TR", ],
    795: ["TM", ],
    796: ["TC", ],
    798: ["TV", ],
    800: ["UG", ],
    804: ["UA", ],
    807: ["MK", ],
    818: ["EG", ],
    826: ["GB", ],
    831: ["GG", ],
    832: ["JE", ],
    833: ["IM", ],
    834: ["TZ", ],
    840: ["US", ],
    850: ["VI", ],
    854: ["BF", ],
    858: ["UY", ],
    860: ["UZ", ],
    862: ["VE", ],
    876: ["WF", ],
    882: ["WS", ],
    887: ["YE", ],
    894: ["ZM", ],
}
