# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.http import JsonResponse
from django.utils.translation import ugettext_lazy as _

JSON_TEXT = {
    'section1': {
        "title": {
            "label": _("project title"),
        },
        "subtitle": {
            "label": _("project subtitle"),
        },
        "iatiStatus": {
            "label": "Status",
            "tooltip": "<ol><li>Pipeline/identification: the project is being scoped or planned</li><li>Implementation: the project is currently being implemented</li><li>Completion: the project is complete or the final disbursement has been made</li><li>Post-completion: the project is complete or the final disbursement has been made, but the project remains open pending financial sign off or M&E</li><li>Cancelled: the project has been cancelled</li><li>Suspended: the project has been temporarily suspended or the reporting partner no longer uses RSR.</li></ol>",
        },
        "iatiActivityId": {
            "label": "IATI identifier",
            "tooltip": "This is a globally unique identifier for this activity. It is a requirement to be compliant with the IATI standard. This code consists of:<br />[country code]-[Chamber of Commerce number]-[organisation’s internal project code].<br />For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more information <a href=\"http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/iati-identifier/#definition\" target=\"_blank\" rel=\"noopener noreferrer\">click here</a>",
        },
        "hierarchy": {
            "label": "Hierarchy",
            "tooltip": "...",
        },
        "dateStartPlanned": {
            "label": "Planned start date",
        },
        "dateEndPlanned": {
            "label": "Planned end date",
        },
        "dateStartActual": {
            "label": "Actual start date",
        },
        "dateEndActual": {
            "label": "Actual end date",
        },
        "language": {
            "label": "Language",
            "tooltip": "Enter the language used when entering the details for this project.",
        },
        "currency": {
            "label": "Currency",
            "tooltip": "The default currency for this project. Used in all financial aspects of the project.",
        },
        "currentImageCredit": {
            "label": "Photo caption",
            "tooltip": "Briefly describe who or what you see in the photo.",
        },
        "currentImageCaption": {
            "label": "Photo credit",
            "tooltip": "Enter the name of the person who took the photo",
        },
        "defaultAidTypeVocabulary": {
            "label": "Default aid type vocabulary",
            "tooltip": "This is the IATI identifier for the type of vocabulary being used for describing the type of the aid being supplied or activity being undertaken. For reference, please visit: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://iatistandard.org/203/codelists/AidTypeVocabulary/\">http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>",
        },
        "defaultAidType": {
            "label": "Default aid type",
            "tooltip": "This is the IATI identifier for the type of aid being supplied or activity being undertaken. This element specifies a default for all the project’s financial transactions. This can be overridden at the individual transaction level. For reference, please visit:  <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://iatistandard.org/202/codelists/AidType/\">http://iatistandard.org/202/codelists/AidType/</a>",
        },
        "defaultFlowType": {
            "label": "Default flow type",
            "tooltip": "This is the IATI identifier for how the activity (project) is funded. For reference, please visit: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://iatistandard.org/202/codelists/FlowType/\">http://iatistandard.org/202/codelists/FlowType/</a>",
        },
        "defaultTiedStatus": {
            "label": "Default tied status",
            "tooltip": "This element specifies a default for all the activity’s financial transactions; it can be overridden at the individual transaction level. For reference, please visit: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://iatistandard.org/202/codelists/TiedStatus/\">http://iatistandard.org/202/codelists/TiedStatus/</a>",
        },
        "collaborationType": {
            "label": "Collaboration type",
            "tooltip": "This is the IATI identifier for the type of collaboration involved. For reference, please visit: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://iatistandard.org/202/codelists/CollaborationType/\">http://iatistandard.org/202/codelists/CollaborationType/</a>",
        },
        "defaultFinanceType": {
            "label": "Default finance type",
            "tooltip": "This is the IATI identifier for the type of finance. This element specifies a default for all the transactions in the project’s activity report; it can be overridden at the individual transaction level. For reference visit: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://iatistandard.org/202/codelists/FinanceType/\">http://iatistandard.org/202/codelists/FinanceType/</a>",
        },
        "amount": {
            "label": "Amount",
        },
    },
}


def index(request):
    return JsonResponse(JSON_TEXT)
