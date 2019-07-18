# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.http import JsonResponse
from django.utils.translation import ugettext_lazy as _

JSON_TEXT = {
    "Related projects": _("Related projects"),
    "Parent": _("Parent"),
    "Child": _("Child"),
    "Sibling": _("Sibling"),
    "Co-founded": _("Co-founded"),
    "Third-party": _("Third-party"),
    "Add another related project": _("Add another related project"),
    "relation": _("Relation"),
    "Project": _("Project"),
    "Related project": _("Related RSR project"),
    "Related project is not present in RSR": _("Related project is not present in RSR"),
    "Related project tooltip": _("Check this box if you would like to indicate a related project that is not present in RSR. Instead, you will be able to fill in the IATI activity ID of the project."),
    "Project photo": _("Project Photo"),
    "Uploading": _("Uploading"),
    "Upload New Image": _("Upload New Image"),
    "Drag file here": _("Drag file here"),
    "or click to browse from computer": _("or click to browse from computer"),
    "Photo": _("photo"),
    "Project photo tooltip": _(u'Add your project photo here. You can only add one photo. If you have more, '
                    u'you can add them via RSR updates when your project is published. A photo '
                    u'album will feature on the project page. The photo should not be larger '
                    u'than 2 MB in size, and should preferably be in JPG format.'),
    "optional": _("optional"),
    "Add another contact": _("Add another contact"),
    "Contact": _("Contact"),
    "Yes": _("Yes"),
    "No": _("No"),
    "Add another participating organisation": _("Add another participating organisation"),
    "Accountable partner": _("Accountable partner"),
    "Extending partner": _("Extending partner"),
    "Funding partner": _("Funding partner"),
    "Implementing partner": _("Implementing partner"),
    "Reporting organisation": _("Reporting organisation"),
    "Sponsor partner": _("Sponsor partner"),
    "Add description": _("Add description"),
    "menu": {
      "settings": _("Project settings"),
      "info": _("General information"),
      "contacts": _("Project contacts"),
      "partners": _("Partners"),
      "descriptions": _("Descriptions"),
      'results-n-indicators': _("Results and indicators"),
      "finance": _("Finance"),
      "locations": _("Locations"),
      "focus": _("Project focus"),
      "links-n-docs": _("Links and documents"),
      "comments-n-keywords": _("Comments and keywords"),
      "reporting": _("CRS++ and FSS reporting")
    },
    'section1': {
        "title": {
            "label": _("project title"),
        },
        "subtitle": {
            "label": _("project subtitle"),
        },
        "iatiStatus": {
            "label": _("Status"),
            "tooltip": _(u'There are six different project statuses:<br/>'
                    u'1) Pipeline/identification: the project is being scoped or planned<br/>'
                    u'2) Implementation: the project is currently being implemented<br/>'
                    u'3) Completion: the project is complete or the final disbursement has been '
                    u'made<br/>'
                    u'4) Post-completion: the project is complete or the final disbursement has '
                    u'been made, '
                    u'but the project remains open pending financial sign off or M&E<br/>'
                    u'5) Cancelled: the project has been cancelled<br/>'
                    u'6) Suspended: the project has been temporarily suspended '
                    u'or the reporting partner no longer uses RSR.')
        },
        "iatiActivityId": {
            "label": _("IATI identifier"),
            "tooltip": _(u'This is a globally unique identifier for this activity. It is a requirement '
                    u'to be compliant with the IATI standard. This code consists of: '
                    u'[country code]-[Chamber of Commerce number]-[organisation’s internal project '
                    u'code]. For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more '
                    u'information see') + ' <a href="http://iatistandard.org/202/activity-standard/'
                                          'iati-activities/iati-activity/iati-identifier/'
                                          '#definition" target="_blank">http://iatistandard.org/'
                                          '201/activity-standard/iati-activities/iati-activity/'
                                          'iati-identifier/#definition</a>'
            
        },
        "hierarchy": {
            "label": _("Hierarchy"),
            "tooltip": _(u'If you are reporting multiple levels of projects in RSR, you can specify '
                    u'whether this is a core, sub, or lower sub activity here.'),
        },
        "dateStartPlanned": {
            "label": _("Start date (planned)"),
            "tooltip": _("Enter the original start date of the project (DD/MM/YYYY).")
        },
        "dateEndPlanned": {
            "label": _("End date (planned)"),
            "tooltip": _("Enter the original end date of the project (DD/MM/YYYY).")
        },
        "dateStartActual": {
            "label": _("start date (actual)"),
            "tooltip": _("Enter the actual start date of the project (DD/MM/YYYY).")
        },
        "dateEndActual": {
            "label": _("end date (actual)"),
            "tooltip": _("Enter the actual end date of the project (DD/MM/YYYY).")
        },
        "language": {
            "label": _("language"),
            "tooltip": _("Enter the language used when entering the details for this project."),
        },
        "currency": {
            "label": _("currency"),
            "tooltip": _("The default currency for this project. Used in all financial aspects of the project."),
        },
        "currentImageCredit": {
            "label": _("Photo caption"),
            "tooltip": _("Briefly describe who or what you see in the photo."),
        },
        "currentImageCaption": {
            "label": _("Photo credit"),
            "tooltip": _("Briefly describe who or what you see in the photo."),
        },
        "defaultAidTypeVocabulary": {
            "label": _(u'default aid type vocabulary'),
            "tooltip": _(u'This is the IATI identifier for the type of vocabulary being used for '
                    u'describing the type of the aid being supplied or activity '
                    u'being undertaken. For reference, please visit: <a '
                    u'href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target='
                    u'"_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.'),
        },
        "defaultAidType": {
            "label": _("default aid type"),
            "tooltip": _(u'This is the IATI identifier for the type of aid being supplied or activity '
                    u'being undertaken. This element specifies a default for all the project’s '
                    u'financial transactions. This can be overridden at the individual transaction '
                    u'level. For reference, please visit: <a href="http://iatistandard.org/202/'
                    u'codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'AidType/</a>.'),
        },
        "defaultFlowType": {
            "label": _("default flow type"),
            "tooltip": _(u'This is the IATI identifier for how the activity (project) is funded. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'FlowType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'FlowType/</a>.'),
        },
        "defaultTiedStatus": {
            "label": _("default tied status"),
            "tooltip": _(u'This element specifies a default for all the activity’s financial '
                    u'transactions; it can be overridden at the individual transaction level. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'TiedStatus/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'TiedStatus/</a>.'),
        },
        "collaborationType": {
            "label": _("collaboration type"),
            "tooltip": _(u'This is the IATI identifier for the type of collaboration involved. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'CollaborationType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'CollaborationType/</a>.'),
        },
        "defaultFinanceType": {
            "label": _("default finance type"),
            "tooltip": _(u'This is the IATI identifier for the type of finance. This element specifies '
                    u'a default for all the transactions in the project’s activity report; it can '
                    u'be overridden at the individual transaction level. For reference visit: '
                    u'<a href="http://iatistandard.org/202/codelists/FinanceType/" target="_blank">'
                    u'http://iatistandard.org/202/codelists/FinanceType/</a>.'),
        },
        "amount": {
            "label": _("Amount"),
        },
    },
    'section2': {
      "jobTitle": {
        "label": _("job title"),
        "tooltip": _("Job title of the contact person.")
      },
      "personName": {
        "label": _("Name"),
        "tooltip": _("Please enter the name of the contact person for this project.")
      },
      "type": {
        "label": _("Type"),
        "tooltip": _("What types of enquiries this contact person is best-placed to handle.")
      },
      "address": {
        "label": _("contact address"),
        "tooltip": _("Address of the contact person. Avoid giving personal contact details.")
      },
      "email": {
        "label": _("contact email")
      },
      "department": {
        "label": _("department")
      },
      "organisation": {
        "label": _("Organisation"),
        "tooltip": _("The organisation that the contact person works for.")
      },
      "telephone": {
        "label": _("contact phone number"),
        "tooltip": _("Contact number for the contact person. Avoid giving personal contact details.")
      },
      "website": {
        "label": _("contact website"),
        "tooltip": _(u'The contact web address, if available. The web address should start with '
                    u'\'http://\' or \'https://\'.')
      }
    },
    'section3': {
      "organisation": {
        "label": _("Project partner"),
        "tooltip": _("Select an organisation that is playing a role in the project.  If an organisation is not currently featured in RSR, please contact")
      },
      "fundingAmount": {
        "label": _("funding amount"),
        "tooltip": _(u'It’s only possible to indicate a funding amount for funding partners. Use a '
                    u'period to denote decimals.')
      },
      "secondaryReporter": {
        "label": _(u'secondary reporter'),
        "tooltip": _(
            u'This indicates whether the reporting organisation is a secondary publisher: '
            u'publishing data for which it is not directly responsible.'
        )
      },
      "iatiOrganisationRole": {
        "label": _("organisation role"),
        "tooltip": _(u'Select the role of the organisation within the project:<br/>'
                    u'- Funding organisation: a government or organisation that provides funds to '
                    u'the project<br/>'
                    u'- Implementing organisation: an organisation involved in carrying out the '
                    u'activity or intervention<br/>'
                    u'- Accountable organisation: an organisation responsible for oversight of '
                    u'the project and its outcomes<br/>'
                    u'- Extending organisation: an organisation that manages the budget and '
                    u'direction of a project on behalf of the funding organisation<br/>'
                    u'- Reporting organisation: an organisation that will report this project in '
                    u'an IATI file')
      },
      "iatiActivityId": {
        "label": _("IATI activity ID"),
        "tooltip": _(u'A valid activity identifier published by the participating organisation '
                    u'which points to the activity that it has published to IATI that describes '
                    u'its role in this activity.')
      }
    },
    'section4': {
      "projectPlanSummary": {
        "label": _('Project summary'),
        "info": _(u'Enter a brief summary, try to restrict the number of characters to 400 in '
                    u'order to display the summary nicely on the project page. The summary should '
                    u'explain:<br>'
                    u'- Why the project is being carried out;<br>'
                    u'- Where it is taking place;<br>'
                    u'- Who will benefit and/or participate;<br>'
                    u'- What it specifically hopes to accomplish;<br>'
                    u'- How those specific goals will be reached')
      },
      "goalsOverview": {
        "label": _('Goals overview'),
        "info": _(u'Provide a brief description of the overall project goals.')
      },
      "background": {
        "label": _('Background'),
        "info": _(u'This should describe the geographical, political, environmental, social '
                    u'and/or cultural context of the project, and any related activities that '
                    u'have already taken place or are underway')
      },
      "currentStatus": {
        "label": _('baseline situation'),
        "info": _(u'Describe the situation at the start of the project.')
      },
      "targetGroup": {
        "label": _('Target group'),
        "info": _(u'This should include information about the people, organisations or resources '
                    u'that are being impacted by this project.')
      },
      "projectPlan": {
        "label": _('Project plan'),
        "info": _(u'Detailed information about the implementation of the project: the what, how, '
                    u'who and when.')
      },
      "sustainability": {
        "label": _('Sustainability'),
        "info": _(u'Describe how you aim to guarantee sustainability of the project until 10 '
                    u'years after project implementation. Think about the institutional setting, '
                    u'capacity-building, a cost recovery plan, products used, feasible '
                    u'arrangements for operation and maintenance, anticipation of environmental '
                    u'impact and social integration.')
      },
    },
    'section6': {
      "currency": {
        "label": "Currency",
        "tooltip": "The default currency for this project. Used in all financial aspects of the project."
      },
      "amount": {
        "label": "Amount"
      },
      "description": {
        "label": "Description"
      },
      "reference": {
        "label": "Reference"
      },
      "otherExtra": {
        "label": "Additional info"
      },
      "aidTypeVocabulary":{
        "label": "Aid type vocabulary"
      },
      "capitalSpendPercentage": {
        "label": "Capital spend percentage"
      },
      "periodStart": {
        "label": "Period start"
      },
      "periodEnd": {
        "label": "Period End"
      },
      "valueDate": {
        "label": "Value date"
      }
    },
    'section7': {
      "name": {
        "label": "Name"
      },
      "reference": {
        "label": "Reference"
      },
      "locationCode": {
        "label": "Code"
      },
      "locationDescription": {
        "label": "Location description"
      },
      "activityDescription": {
        "label": "Activity description"
      },
      "locationPrecision": {
        "label": "Location precision"
      },
      "locationReach": {
        "label": "Reach"
      },
      "locationClass": {
        "label": "Class"
      },
      "featureDesignation": {
        "label": "Feature designation"
      }
    }
}


def index(request):
    return JsonResponse(JSON_TEXT)
