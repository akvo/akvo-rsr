# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.utils.translation import ugettext_lazy as _

M49_CODES = (
    (
        u"",
        _(u"World")
    ),
    (
        u"2",
        _(u"%sAfrica") % (4 * u"\u00A0")
    ),
    (
        u"14",
        _(u"%sEastern Africa") % (8 * u"\u00A0")
    ),
    (
        u"108",
        _(u"%sBurundi") % (12 * u"\u00A0")
    ),
    (
        u"174",
        _(u"%sComoros") % (12 * u"\u00A0")
    ),
    (
        u"262",
        _(u"%sDjibouti") % (12 * u"\u00A0")
    ),
    (
        u"232",
        _(u"%sEritrea") % (12 * u"\u00A0")
    ),
    (
        u"231",
        _(u"%sEthiopia") % (12 * u"\u00A0")
    ),
    (
        u"404",
        _(u"%sKenya") % (12 * u"\u00A0")
    ),
    (
        u"450",
        _(u"%sMadagascar") % (12 * u"\u00A0")
    ),
    (
        u"454",
        _(u"%sMalawi") % (12 * u"\u00A0")
    ),
    (
        u"480",
        _(u"%sMauritius") % (12 * u"\u00A0")
    ),
    (
        u"175",
        _(u"%sMayotte") % (12 * u"\u00A0")
    ),
    (
        u"508",
        _(u"%sMozambique") % (12 * u"\u00A0")
    ),
    (
        u"638",
        _(u"%sRéunion") % (12 * u"\u00A0")
    ),
    (
        u"646",
        _(u"%sRwanda") % (12 * u"\u00A0")
    ),
    (
        u"690",
        _(u"%sSeychelles") % (12 * u"\u00A0")
    ),
    (
        u"706",
        _(u"%sSomalia") % (12 * u"\u00A0")
    ),
    (
        u"728",
        _(u"%sSouth Sudan") % (12 * u"\u00A0")
    ),
    (
        u"800",
        _(u"%sUganda") % (12 * u"\u00A0")
    ),
    (
        u"834",
        _(u"%sUnited Republic of Tanzania") % (12 * u"\u00A0")
    ),
    (
        u"894",
        _(u"%sZambia") % (12 * u"\u00A0")
    ),
    (
        u"716",
        _(u"%sZimbabwe") % (12 * u"\u00A0")
    ),
    (
        u"17",
        _(u"%sMiddle Africa") % (8 * u"\u00A0")
    ),
    (
        u"24",
        _(u"%sAngola") % (12 * u"\u00A0")
    ),
    (
        u"120",
        _(u"%sCameroon") % (12 * u"\u00A0")
    ),
    (
        u"140",
        _(u"%sCentral African Republic") % (12 * u"\u00A0")
    ),
    (
        u"148",
        _(u"%sChad") % (12 * u"\u00A0")
    ),
    (
        u"178",
        _(u"%sCongo") % (12 * u"\u00A0")
    ),
    (
        u"180",
        _(u"%sDemocratic Republic of the Congo") % (12 * u"\u00A0")
    ),
    (
        u"226",
        _(u"%sEquatorial Guinea") % (12 * u"\u00A0")
    ),
    (
        u"266",
        _(u"%sGabon") % (12 * u"\u00A0")
    ),
    (
        u"678",
        _(u"%sSao Tome and Principe") % (12 * u"\u00A0")
    ),
    (
        u"15",
        _(u"%sNorthern Africa") % (8 * u"\u00A0")
    ),
    (
        u"12",
        _(u"%sAlgeria") % (12 * u"\u00A0")
    ),
    (
        u"818",
        _(u"%sEgypt") % (12 * u"\u00A0")
    ),
    (
        u"434",
        _(u"%sLibya") % (12 * u"\u00A0")
    ),
    (
        u"504",
        _(u"%sMorocco") % (12 * u"\u00A0")
    ),
    (
        u"729",
        _(u"%sSudan") % (12 * u"\u00A0")
    ),
    (
        u"788",
        _(u"%sTunisia") % (12 * u"\u00A0")
    ),
    (
        u"732",
        _(u"%sWestern Sahara") % (12 * u"\u00A0")
    ),
    (
        u"18",
        _(u"%sSouthern Africa") % (12 * u"\u00A0")
    ),
    (
        u"72",
        _(u"%sBotswana") % (12 * u"\u00A0")
    ),
    (
        u"426",
        _(u"%sLesotho") % (12 * u"\u00A0")
    ),
    (
        u"516",
        _(u"%sNamibia") % (12 * u"\u00A0")
    ),
    (
        u"710",
        _(u"%sSouth Africa") % (12 * u"\u00A0")
    ),
    (
        u"748",
        _(u"%sSwaziland") % (12 * u"\u00A0")
    ),
    (
        u"11",
        _(u"%sWestern Africa") % (12 * u"\u00A0")
    ),
    (
        u"204",
        _(u"%sBenin") % (12 * u"\u00A0")
    ),
    (
        u"854",
        _(u"%sBurkina Faso") % (12 * u"\u00A0")
    ),
    (
        u"132",
        _(u"%sCabo Verde") % (12 * u"\u00A0")
    ),
    (
        u"384",
        _(u"%sCote d'Ivoire") % (12 * u"\u00A0")
    ),
    (
        u"270",
        _(u"%sGambia") % (12 * u"\u00A0")
    ),
    (
        u"288",
        _(u"%sGhana") % (12 * u"\u00A0")
    ),
    (
        u"324",
        _(u"%sGuinea") % (12 * u"\u00A0")
    ),
    (
        u"624",
        _(u"%sGuinea-Bissau") % (12 * u"\u00A0")
    ),
    (
        u"430",
        _(u"%sLiberia") % (12 * u"\u00A0")
    ),
    (
        u"466",
        _(u"%sMali") % (12 * u"\u00A0")
    ),
    (
        u"478",
        _(u"%sMauritania") % (12 * u"\u00A0")
    ),
    (
        u"562",
        _(u"%sNiger") % (12 * u"\u00A0")
    ),
    (
        u"566",
        _(u"%sNigeria") % (12 * u"\u00A0")
    ),
    (
        u"654",
        _(u"%sSaint Helena") % (12 * u"\u00A0")
    ),
    (
        u"686",
        _(u"%sSenegal") % (12 * u"\u00A0")
    ),
    (
        u"694",
        _(u"%sSierra Leone") % (12 * u"\u00A0")
    ),
    (
        u"768",
        _(u"%sTogo") % (12 * u"\u00A0")
    ),
    (
        u"19",
        _(u"%sAmericas") % (4 * u"\u00A0")
    ),
    (
        u"419",
        _(u"%sLatin America and the Caribbean") % (8 * u"\u00A0")
    ),
    (
        u"29",
        _(u"%sCaribbean") % (12 * u"\u00A0")
    ),
    (
        u"660",
        _(u"%sAnguilla") % (16 * u"\u00A0")
    ),
    (
        u"28",
        _(u"%sAntigua and Barbuda") % (16 * u"\u00A0")
    ),
    (
        u"533",
        _(u"%sAruba") % (16 * u"\u00A0")
    ),
    (
        u"44",
        _(u"%sBahamas") % (16 * u"\u00A0")
    ),
    (
        u"52",
        _(u"%sBarbados") % (16 * u"\u00A0")
    ),
    (
        u"535",
        _(u"%sBonaire, Sint Eustatius and Saba") % (16 * u"\u00A0")
    ),
    (
        u"92",
        _(u"%sBritish Virgin Islands") % (16 * u"\u00A0")
    ),
    (
        u"136",
        _(u"%sCayman Islands") % (16 * u"\u00A0")
    ),
    (
        u"192",
        _(u"%sCuba") % (16 * u"\u00A0")
    ),
    (
        u"531",
        _(u"%sCuraçao") % (16 * u"\u00A0")
    ),
    (
        u"212",
        _(u"%sDominica") % (16 * u"\u00A0")
    ),
    (
        u"214",
        _(u"%sDominican Republic") % (16 * u"\u00A0")
    ),
    (
        u"308",
        _(u"%sGrenada") % (16 * u"\u00A0")
    ),
    (
        u"312",
        _(u"%sGuadeloupe") % (16 * u"\u00A0")
    ),
    (
        u"332",
        _(u"%sHaiti") % (16 * u"\u00A0")
    ),
    (
        u"388",
        _(u"%sJamaica") % (16 * u"\u00A0")
    ),
    (
        u"474",
        _(u"%sMartinique") % (16 * u"\u00A0")
    ),
    (
        u"500",
        _(u"%sMontserrat") % (16 * u"\u00A0")
    ),
    (
        u"630",
        _(u"%sPuerto Rico") % (16 * u"\u00A0")
    ),
    (
        u"652",
        _(u"%sSaint-Barthélemy") % (16 * u"\u00A0")
    ),
    (
        u"659",
        _(u"%sSaint Kitts and Nevis") % (16 * u"\u00A0")
    ),
    (
        u"662",
        _(u"%sSaint Lucia") % (16 * u"\u00A0")
    ),
    (
        u"663",
        _(u"%sSaint Martin (French part)") % (16 * u"\u00A0")
    ),
    (
        u"670",
        _(u"%sSaint Vincent and the Grenadines") % (16 * u"\u00A0")
    ),
    (
        u"534",
        _(u"%sSint Maarten (Dutch part)") % (16 * u"\u00A0")
    ),
    (
        u"780",
        _(u"%sTrinidad and Tobago") % (16 * u"\u00A0")
    ),
    (
        u"796",
        _(u"%sTurks and Caicos Islands") % (16 * u"\u00A0")
    ),
    (
        u"850",
        _(u"%sUnited States Virgin Islands") % (16 * u"\u00A0")
    ),
    (
        u"13",
        _(u"%sCentral America") % (12 * u"\u00A0")
    ),
    (
        u"84",
        _(u"%sBelize") % (16 * u"\u00A0")
    ),
    (
        u"188",
        _(u"%sCosta Rica") % (16 * u"\u00A0")
    ),
    (
        u"222",
        _(u"%sEl Salvador") % (16 * u"\u00A0")
    ),
    (
        u"320",
        _(u"%sGuatemala") % (16 * u"\u00A0")
    ),
    (
        u"340",
        _(u"%sHonduras") % (16 * u"\u00A0")
    ),
    (
        u"484",
        _(u"%sMexico") % (16 * u"\u00A0")
    ),
    (
        u"558",
        _(u"%sNicaragua") % (16 * u"\u00A0")
    ),
    (
        u"591",
        _(u"%sPanama") % (16 * u"\u00A0")
    ),
    (
        u"5",
        _(u"%sSouth America") % (12 * u"\u00A0")
    ),
    (
        u"32",
        _(u"%sArgentina") % (16 * u"\u00A0")
    ),
    (
        u"68",
        _(u"%sBolivia (Plurinational State of)") % (16 * u"\u00A0")
    ),
    (
        u"76",
        _(u"%sBrazil") % (16 * u"\u00A0")
    ),
    (
        u"152",
        _(u"%sChile") % (16 * u"\u00A0")
    ),
    (
        u"170",
        _(u"%sColombia") % (16 * u"\u00A0")
    ),
    (
        u"218",
        _(u"%sEcuador") % (16 * u"\u00A0")
    ),
    (
        u"238",
        _(u"%sFalkland Islands (Malvinas)") % (16 * u"\u00A0")
    ),
    (
        u"254",
        _(u"%sFrench Guiana") % (16 * u"\u00A0")
    ),
    (
        u"328",
        _(u"%sGuyana") % (16 * u"\u00A0")
    ),
    (
        u"600",
        _(u"%sParaguay") % (16 * u"\u00A0")
    ),
    (
        u"604",
        _(u"%sPeru") % (16 * u"\u00A0")
    ),
    (
        u"740",
        _(u"%sSuriname") % (16 * u"\u00A0")
    ),
    (
        u"858",
        _(u"%sUruguay") % (16 * u"\u00A0")
    ),
    (
        u"862",
        _(u"%sVenezuela (Bolivarian Republic of)") % (16 * u"\u00A0")
    ),
    (
        u"21",
        _(u"%sNorthern America") % (8 * u"\u00A0")
    ),
    (
        u"60",
        _(u"%sBermuda") % (12 * u"\u00A0")
    ),
    (
        u"124",
        _(u"%sCanada") % (12 * u"\u00A0")
    ),
    (
        u"304",
        _(u"%sGreenland") % (12 * u"\u00A0")
    ),
    (
        u"666",
        _(u"%sSaint Pierre and Miquelon") % (12 * u"\u00A0")
    ),
    (
        u"840",
        _(u"%sUnited States of America") % (12 * u"\u00A0")
    ),
    (
        u"142",
        _(u"%sAsia") % (4 * u"\u00A0")
    ),
    (
        u"143",
        _(u"%sCentral Asia") % (8 * u"\u00A0")
    ),
    (
        u"398",
        _(u"%sKazakhstan") % (12 * u"\u00A0")
    ),
    (
        u"417",
        _(u"%sKyrgyzstan") % (12 * u"\u00A0")
    ),
    (
        u"762",
        _(u"%sTajikistan") % (12 * u"\u00A0")
    ),
    (
        u"795",
        _(u"%sTurkmenistan") % (12 * u"\u00A0")
    ),
    (
        u"860",
        _(u"%sUzbekistan") % (12 * u"\u00A0")
    ),
    (
        u"30",
        _(u"%sEastern Asia") % (8 * u"\u00A0")
    ),
    (
        u"156",
        _(u"%sChina") % (12 * u"\u00A0")
    ),
    (
        u"344",
        _(u"%sChina, Hong Kong Special Administrative Region") % (12 * u"\u00A0")
    ),
    (
        u"446",
        _(u"%sChina, Macao Special Administrative Region") % (12 * u"\u00A0")
    ),
    (
        u"408",
        _(u"%sDemocratic People's Republic of Korea") % (12 * u"\u00A0")
    ),
    (
        u"392",
        _(u"%sJapan") % (12 * u"\u00A0")
    ),
    (
        u"496",
        _(u"%sMongolia") % (12 * u"\u00A0")
    ),
    (
        u"410",
        _(u"%sRepublic of Korea") % (12 * u"\u00A0")
    ),
    (
        u"34",
        _(u"%sSouthern Asia") % (8 * u"\u00A0")
    ),
    (
        u"4",
        _(u"%sAfghanistan") % (12 * u"\u00A0")
    ),
    (
        u"50",
        _(u"%sBangladesh") % (12 * u"\u00A0")
    ),
    (
        u"64",
        _(u"%sBhutan") % (12 * u"\u00A0")
    ),
    (
        u"356",
        _(u"%sIndia") % (12 * u"\u00A0")
    ),
    (
        u"364",
        _(u"%sIran (Islamic Republic of)") % (12 * u"\u00A0")
    ),
    (
        u"462",
        _(u"%sMaldives") % (12 * u"\u00A0")
    ),
    (
        u"524",
        _(u"%sNepal") % (12 * u"\u00A0")
    ),
    (
        u"586",
        _(u"%sPakistan") % (12 * u"\u00A0")
    ),
    (
        u"144",
        _(u"%sSri Lanka") % (12 * u"\u00A0")
    ),
    (
        u"35",
        _(u"%sSouth-Eastern Asia") % (8 * u"\u00A0")
    ),
    (
        u"96",
        _(u"%sBrunei Darussalam") % (12 * u"\u00A0")
    ),
    (
        u"116",
        _(u"%sCambodia") % (12 * u"\u00A0")
    ),
    (
        u"360",
        _(u"%sIndonesia") % (12 * u"\u00A0")
    ),
    (
        u"418",
        _(u"%sLao People's Democratic Republic") % (12 * u"\u00A0")
    ),
    (
        u"458",
        _(u"%sMalaysia") % (12 * u"\u00A0")
    ),
    (
        u"104",
        _(u"%sMyanmar") % (12 * u"\u00A0")
    ),
    (
        u"608",
        _(u"%sPhilippines") % (12 * u"\u00A0")
    ),
    (
        u"702",
        _(u"%sSingapore") % (12 * u"\u00A0")
    ),
    (
        u"764",
        _(u"%sThailand") % (12 * u"\u00A0")
    ),
    (
        u"626",
        _(u"%sTimor-Leste") % (12 * u"\u00A0")
    ),
    (
        u"704",
        _(u"%sViet Nam") % (12 * u"\u00A0")
    ),
    (
        u"145",
        _(u"%sWestern Asia") % (8 * u"\u00A0")
    ),
    (
        u"51",
        _(u"%sArmenia") % (12 * u"\u00A0")
    ),
    (
        u"31",
        _(u"%sAzerbaijan") % (12 * u"\u00A0")
    ),
    (
        u"48",
        _(u"%sBahrain") % (12 * u"\u00A0")
    ),
    (
        u"196",
        _(u"%sCyprus") % (12 * u"\u00A0")
    ),
    (
        u"268",
        _(u"%sGeorgia") % (12 * u"\u00A0")
    ),
    (
        u"368",
        _(u"%sIraq") % (12 * u"\u00A0")
    ),
    (
        u"376",
        _(u"%sIsrael") % (12 * u"\u00A0")
    ),
    (
        u"400",
        _(u"%sJordan") % (12 * u"\u00A0")
    ),
    (
        u"414",
        _(u"%sKuwait") % (12 * u"\u00A0")
    ),
    (
        u"422",
        _(u"%sLebanon") % (12 * u"\u00A0")
    ),
    (
        u"512",
        _(u"%sOman") % (12 * u"\u00A0")
    ),
    (
        u"634",
        _(u"%sQatar") % (12 * u"\u00A0")
    ),
    (
        u"682",
        _(u"%sSaudi Arabia") % (12 * u"\u00A0")
    ),
    (
        u"275",
        _(u"%sState of Palestine") % (12 * u"\u00A0")
    ),
    (
        u"760",
        _(u"%sSyrian Arab Republic") % (12 * u"\u00A0")
    ),
    (
        u"792",
        _(u"%sTurkey") % (12 * u"\u00A0")
    ),
    (
        u"784",
        _(u"%sUnited Arab Emirates") % (12 * u"\u00A0")
    ),
    (
        u"887",
        _(u"%sYemen") % (12 * u"\u00A0")
    ),
    (
        u"150",
        _(u"%sEurope") % (4 * u"\u00A0")
    ),
    (
        u"151",
        _(u"%sEastern Europe") % (8 * u"\u00A0")
    ),
    (
        u"112",
        _(u"%sBelarus") % (12 * u"\u00A0")
    ),
    (
        u"100",
        _(u"%sBulgaria") % (12 * u"\u00A0")
    ),
    (
        u"203",
        _(u"%sCzech Republic") % (12 * u"\u00A0")
    ),
    (
        u"348",
        _(u"%sHungary") % (12 * u"\u00A0")
    ),
    (
        u"616",
        _(u"%sPoland") % (12 * u"\u00A0")
    ),
    (
        u"498",
        _(u"%sRepublic of Moldova") % (12 * u"\u00A0")
    ),
    (
        u"642",
        _(u"%sRomania") % (12 * u"\u00A0")
    ),
    (
        u"643",
        _(u"%sRussian Federation") % (12 * u"\u00A0")
    ),
    (
        u"703",
        _(u"%sSlovakia") % (12 * u"\u00A0")
    ),
    (
        u"804",
        _(u"%sUkraine") % (12 * u"\u00A0")
    ),
    (
        u"154",
        _(u"%sNorthern Europe") % (8 * u"\u00A0")
    ),
    (
        u"248",
        _(u"%sÅland Islands") % (12 * u"\u00A0")
    ),
    (
        u"208",
        _(u"%sDenmark") % (12 * u"\u00A0")
    ),
    (
        u"233",
        _(u"%sEstonia") % (12 * u"\u00A0")
    ),
    (
        u"234",
        _(u"%sFaeroe Islands") % (12 * u"\u00A0")
    ),
    (
        u"246",
        _(u"%sFinland") % (12 * u"\u00A0")
    ),
    (
        u"831",
        _(u"%sGuernsey") % (12 * u"\u00A0")
    ),
    (
        u"352",
        _(u"%sIceland") % (12 * u"\u00A0")
    ),
    (
        u"372",
        _(u"%sIreland") % (12 * u"\u00A0")
    ),
    (
        u"833",
        _(u"%sIsle of Man") % (12 * u"\u00A0")
    ),
    (
        u"832",
        _(u"%sJersey") % (12 * u"\u00A0")
    ),
    (
        u"428",
        _(u"%sLatvia") % (12 * u"\u00A0")
    ),
    (
        u"440",
        _(u"%sLithuania") % (12 * u"\u00A0")
    ),
    (
        u"578",
        _(u"%sNorway") % (12 * u"\u00A0")
    ),
    (
        u"744",
        _(u"%sSvalbard and Jan Mayen Islands") % (12 * u"\u00A0")
    ),
    (
        u"752",
        _(u"%sSweden") % (12 * u"\u00A0")
    ),
    (
        u"826",
        _(u"%sUnited Kingdom of Great Britain and Northern Ireland") % (12 * u"\u00A0")
    ),
    (
        u"39",
        _(u"%sSouthern Europe") % (8 * u"\u00A0")
    ),
    (
        u"8",
        _(u"%sAlbania") % (12 * u"\u00A0")
    ),
    (
        u"20",
        _(u"%sAndorra") % (12 * u"\u00A0")
    ),
    (
        u"70",
        _(u"%sBosnia and Herzegovina") % (12 * u"\u00A0")
    ),
    (
        u"191",
        _(u"%sCroatia") % (12 * u"\u00A0")
    ),
    (
        u"292",
        _(u"%sGibraltar") % (12 * u"\u00A0")
    ),
    (
        u"300",
        _(u"%sGreece") % (12 * u"\u00A0")
    ),
    (
        u"336",
        _(u"%sHoly See") % (12 * u"\u00A0")
    ),
    (
        u"380",
        _(u"%sItaly") % (12 * u"\u00A0")
    ),
    (
        u"470",
        _(u"%sMalta") % (12 * u"\u00A0")
    ),
    (
        u"499",
        _(u"%sMontenegro") % (12 * u"\u00A0")
    ),
    (
        u"620",
        _(u"%sPortugal") % (12 * u"\u00A0")
    ),
    (
        u"674",
        _(u"%sSan Marino") % (12 * u"\u00A0")
    ),
    (
        u"688",
        _(u"%sSerbia") % (12 * u"\u00A0")
    ),
    (
        u"705",
        _(u"%sSlovenia") % (12 * u"\u00A0")
    ),
    (
        u"724",
        _(u"%sSpain") % (12 * u"\u00A0")
    ),
    (
        u"807",
        _(u"%sThe former Yugoslav Republic of Macedonia") % (12 * u"\u00A0")
    ),
    (
        u"155",
        _(u"%sWestern Europe") % (8 * u"\u00A0")
    ),
    (
        u"40",
        _(u"%sAustria") % (12 * u"\u00A0")
    ),
    (
        u"56",
        _(u"%sBelgium") % (12 * u"\u00A0")
    ),
    (
        u"250",
        _(u"%sFrance") % (12 * u"\u00A0")
    ),
    (
        u"276",
        _(u"%sGermany") % (12 * u"\u00A0")
    ),
    (
        u"438",
        _(u"%sLiechtenstein") % (12 * u"\u00A0")
    ),
    (
        u"442",
        _(u"%sLuxembourg") % (12 * u"\u00A0")
    ),
    (
        u"492",
        _(u"%sMonaco") % (12 * u"\u00A0")
    ),
    (
        u"528",
        _(u"%sNetherlands") % (12 * u"\u00A0")
    ),
    (
        u"756",
        _(u"%sSwitzerland") % (12 * u"\u00A0")
    ),
    (
        u"9",
        _(u"%sOceania") % (4 * u"\u00A0")
    ),
    (
        u"53",
        _(u"%sAustralia and New Zealand") % (8 * u"\u00A0")
    ),
    (
        u"36",
        _(u"%sAustralia") % (12 * u"\u00A0")
    ),
    (
        u"554",
        _(u"%sNew Zealand") % (12 * u"\u00A0")
    ),
    (
        u"574",
        _(u"%sNorfolk Island") % (12 * u"\u00A0")
    ),
    (
        u"54",
        _(u"%sMelanesia") % (8 * u"\u00A0")
    ),
    (
        u"242",
        _(u"%sFiji") % (12 * u"\u00A0")
    ),
    (
        u"540",
        _(u"%sNew Caledonia") % (12 * u"\u00A0")
    ),
    (
        u"598",
        _(u"%sPapua New Guinea") % (12 * u"\u00A0")
    ),
    (
        u"90",
        _(u"%sSolomon Islands") % (12 * u"\u00A0")
    ),
    (
        u"548",
        _(u"%sVanuatu") % (12 * u"\u00A0")
    ),
    (
        u"57",
        _(u"%sMicronesia") % (8 * u"\u00A0")
    ),
    (
        u"316",
        _(u"%sGuam") % (12 * u"\u00A0")
    ),
    (
        u"296",
        _(u"%sKiribati") % (12 * u"\u00A0")
    ),
    (
        u"584",
        _(u"%sMarshall Islands") % (12 * u"\u00A0")
    ),
    (
        u"583",
        _(u"%sMicronesia (Federated States of)") % (12 * u"\u00A0")
    ),
    (
        u"520",
        _(u"%sNauru") % (12 * u"\u00A0")
    ),
    (
        u"580",
        _(u"%sNorthern Mariana Islands") % (12 * u"\u00A0")
    ),
    (
        u"585",
        _(u"%sPalau") % (12 * u"\u00A0")
    ),
    (
        u"61",
        _(u"%sPolynesia") % (8 * u"\u00A0")
    ),
    (
        u"16",
        _(u"%sAmerican Samoa") % (12 * u"\u00A0")
    ),
    (
        u"184",
        _(u"%sCook Islands") % (12 * u"\u00A0")
    ),
    (
        u"258",
        _(u"%sFrench Polynesia") % (12 * u"\u00A0")
    ),
    (
        u"570",
        _(u"%sNiue") % (12 * u"\u00A0")
    ),
    (
        u"612",
        _(u"%sPitcairn") % (12 * u"\u00A0")
    ),
    (
        u"882",
        _(u"%sSamoa") % (12 * u"\u00A0")
    ),
    (
        u"772",
        _(u"%sTokelau") % (12 * u"\u00A0")
    ),
    (
        u"776",
        _(u"%sTonga") % (12 * u"\u00A0")
    ),
    (
        u"798",
        _(u"%sTuvalu") % (12 * u"\u00A0")
    ),
    (
        u"876",
        _(u"%sWallis and Futuna Islands") % (12 * u"\u00A0")
    ),
)


# Dictionary of M.49 Alpha country and region codes
# Based on http://unstats.un.org/unsd/methods/m49/m49regin.htm

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
