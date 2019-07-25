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
    "Add another contact": _("Add another contact"),
    "Accountable partner": _("Accountable partner"),
    "Extending partner": _("Extending partner"),
    "Funding partner": _("Funding partner"),
    "Implementing partner": _("Implementing partner"),
    "Reporting organisation": _("Reporting organisation"),
    "Sponsor partner": _("Sponsor partner"),
    "Yes": _("Yes"),
    "No": _("No"),
    "Add another participating organisation": _("Add another participating organisation"),
    "Add description": _("Add description"),
    "Add result": _("Add result"),
    "No results": _("No results"),
    "Import the results framework from parent project": _("Import the results framework from parent project"),
    "Import results set": _("Import results set"),
    "Copy the results framework from an existing project": _("Copy the results framework from an existing project"),
    "optional": _("optional"),
    "Identification": _("Identification"),
    "Implementation": _("Implementation"),
    "Completion": _("Completion"),
    "Post-completion": _("Post-completion"),
    "Canceled": _("Canceled"),
    "Suspended": _("Suspended"),
    "Bilateral": _("Bilateral"),
    "Multilateral (inflows)": _("Multilateral (inflows)"),
    "Bilateral, core contributions to NGOs and other private bodies / PPPs": _("Bilateral, core contributions to NGOs and other private bodies / PPPs"),
    "Multilateral outflows": _("Multilateral outflows"),
    "Private sector outflows": _("Private sector outflows"),
    "Bilateral, ex-post reporting on NGOs' activities funded through core contributions": _("Bilateral, ex-post reporting on NGOs' activities funded through core contributions"),
    "bilateral, triangular co-operation: activities where one or more bilateral providers of development co-operation or international organisations support South-South co-operation, joining forces with developing countries to facilitate a sharing of knowledge and experience among all partners involved.": _("bilateral, triangular co-operation: activities where one or more bilateral providers of development co-operation or international organisations support South-South co-operation, joining forces with developing countries to facilitate a sharing of knowledge and experience among all partners involved."),
    "Core Activity": _("Core Activity"),
    "Sub Activity": _("Sub Activity"),
    "Lower Sub Activity": _("Lower Sub Activity"),
    "IATI Identifier": _("IATI Identifier"),
    "Within each result indicators can be defined. Indicators should be items that can be counted and evaluated as the project continues and is completed.": _("Within each result indicators can be defined. Indicators should be items that can be counted and evaluated as the project continues and is completed."),
    "Add label": _("Add label"),
    "Edit": _("Edit"),
    "Add": _("Add"),
    "Are you sure to delete this?": _("Are you sure to delete this?"),
    "Done": _("Done"),
    "The term \"disaggregation\" is equivalent to the IATI term \"dimension\". For those reporting to IATI via RSR, disaggregations and their associated data are mapped accordingly as dimensions in your IATI export.": _('The term "disaggregation" is equivalent to the IATI term "dimension". For those reporting to IATI via RSR, disaggregations and their associated data are mapped accordingly as dimensions in your IATI export.'),
    "Disaggregations": _("Disaggregations"),
    "Remove": _("Remove"),
    "Add disaggregation": _("Add disaggregation"),
    "Add New Disaggregation": _("Add New Disaggregation"),
    "Cancel": _("Cancel"),
    "Create new": _("Create new"),
    "Disaggregation category": _("Disaggregation category"),
    "Ex: Age": _("Ex: Age"),
    "Label": _("Label"),
    "Ex: Under 18": _("Ex: Under 18"),
    "Ex: Above 18": _("Ex: Above 18"),
    "Remove label": _("Remove label"),
    "Indicator": _("Indicator"),
    "Are you sure to delete this indicator?": _("Are you sure to delete this indicator?"),
    "Title": _("Title"),
    "Choose how the indicator will be measured (in percentage or units).": _("Choose how the indicator will be measured (in percentage or units)."),
    "Measure": _("Measure"),
    "Unit": _("Unit"),
    "Percentage": _("Percentage"),
    "Choose ascending if the target value of the indicator is higher than the baseline value (eg. people with access to sanitation). Choose descending if the target value of the indicator is lower than the baseline value (eg. people with diarrhea).": _("Choose ascending if the target value of the indicator is higher than the baseline value (eg. people with access to sanitation). Choose descending if the target value of the indicator is lower than the baseline value (eg. people with diarrhea)."),
    "Order": _("Order"),
    "Ascending": _("Ascending"),
    "Descending": _("Descending"),
    "You can provide further information of the indicator here.": _("You can provide further information of the indicator here."),
    "Description": _("Description"),
    "Baseline year": _("Baseline year"),
    "Baseline value": _("Baseline value"),
    "Baseline comment": _("Baseline comment"),
    "Quantitative": _("Quantitative"),
    "Qualitative": _("Qualitative"),
    "Add indicator": _("Add indicator"),
    "Copy results": _("Copy results"),
    "Create a new results framework": _("Create a new results framework"),
    "Full preview": _("Full preview"),
    "Are you sure to delete this result?": _("Are you sure to delete this result?"),
    "You can provide further information of the result here.": _("You can provide further information of the result here."),
    "Enable aggregation": _("Enable aggregation"),
    "Indicators": _("Indicators"),
    "Budget items": _("Budget items"),
    "Total budget": _("Total Budget"),
    "Budget item": _("Budget item"),
    "Budget type": _("Budget type"),
    "Original": _("Original"),
    "Revised": _("Revised"),
    "Status": _("Status"),
    "Indicative": _("Indicative"),
    "Committed": _("Committed"),
    "Add Budget Item": _("Add Budget Item"),
    "Add a donation url for this project. If no URL is added, it is not possible to donate to this project through RSR.": _("Add a donation url for this project. If no URL is added, it is not possible to donate to this project through RSR."),
    "Donate URL": _("donate url"),
    "The percentage of the total commitment allocated to or planned for capital expenditure. Content must be a positive decimal number between 0 and 100, with no percentage sign. Use a period to denote decimals.": _("The percentage of the total commitment allocated to or planned for capital expenditure. Content must be a positive decimal number between 0 and 100, with no percentage sign. Use a period to denote decimals."),
    "Capital spend percentage": _("capital spend percentage"),
    "Country budget items": _("Country budget items"),
    "Enter an IATI code for the common functional classification or country system (this allows for common codes, country-specific codes, or any other classification agreed between countries and donors) see: <a href=\"http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/\" target=\"_blank\">http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/</a>.": _("Enter an IATI code for the common functional classification or country system (this allows for common codes, country-specific codes, or any other classification agreed between countries and donors) see: <a href=\"http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/\" target=\"_blank\">http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/</a>."),
    "Vocabulary": _("Vocabulary"),
    "Country Chart of Accounts": _("Country Chart of Accounts"),
    "Other Country System": _("Other Country System"),
    "Reporting Organisation": _("Reporting Organisation"),
    "Other": _("Other"),
    "Transactions": _("Transactions"),
    "Planned disbursements": _("Planned disbursements"),
    "currency": _("currency"),
    "Amount": _("Amount"),
    "Enter the amount of budget that is set aside for this specific budget item. Use a period to denote decimals.": _("Enter the amount of budget that is set aside for this specific budget item. Use a period to denote decimals."),
    "Additional info": _("Additional info"),
    "budget type": _("budget type"),
    "The status explains whether the budget being reported is indicative or has been formally committed.": _("The status explains whether the budget being reported is indicative or has been formally committed."),
    "period start": _("period start"),
    "Enter the start date (DD/MM/YYYY) for the budget period.": _("Enter the start date (DD/MM/YYYY) for the budget period."),
    "period end": _("period end"),
    "Enter the end date (DD/MM/YYYY) for the budget period.": _("Enter the end date (DD/MM/YYYY) for the budget period."),
    "value date": _("value date"),
    "Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for currency conversions.": _("Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for currency conversions."),
    "Item code": _("Item code"),
    "If more than one identifier is reported, the percentage share must be reported and all percentages should add up to 100 percent. Use a period to denote decimals.": _("If more than one identifier is reported, the percentage share must be reported and all percentages should add up to 100 percent. Use a period to denote decimals."),
    "Add country budget item": _("Add country budget item"),
    "Country budget item": _("Country budget item"),
    "value": _("value"),
    "type": _("type"),
    "The exact date of the planned disbursement OR the starting date for the disbursement period (DD/MM/YYYY).": _("The exact date of the planned disbursement OR the starting date for the disbursement period (DD/MM/YYYY)."),
    "Enter the end date (DD/MM/YYYY) for the disbursement period.": _("Enter the end date (DD/MM/YYYY) for the disbursement period."),
    "provider organisation": _("provider organisation"),
    "Provider organisation": _("Provider organisation"),
    "For incoming funds, this is the organisation from which the funds originated. It will default to the reporting organisation.": _("For incoming funds, this is the organisation from which the funds originated. It will default to the reporting organisation."),
    "Activity ID": _("Activity ID"),
    "recipient organisation": _("recipient organisation"),
    "The organisation that receives the incoming funds.": _("The organisation that receives the incoming funds."),
    "The internal identifier used by the receiver organisation for its activity that receives the funds from this disbursement (not to be confused with the IATI identifier for the target activity).": _("The internal identifier used by the receiver organisation for its activity that receives the funds from this disbursement (not to be confused with the IATI identifier for the target activity)."),
    "Add planned disbursement": _("Add planned disbursement"),

    "A recognised code, from a recognised vocabulary, classifying the purpose of this transaction. If this element is used then ALL transaction elements should contain a transaction/sector element and iati-activity/sector should NOT be used. This element can be used multiple times, but only one sector can be reported per vocabulary.": _("A recognised code, from a recognised vocabulary, classifying the purpose of this transaction. If this element is used then ALL transaction elements should contain a transaction/sector element and iati-activity/sector should NOT be used. This element can be used multiple times, but only one sector can be reported per vocabulary."),
    "Name": _("Name"),
    "An IATI code for the vocabulary (codelist) used for sector classifications. If omitted, OECD DAC 5-digit Purpose Codes are assumed. Note that at transaction level, only one sector per vocabulary can be reported.": _("An IATI code for the vocabulary (codelist) used for sector classifications. If omitted, OECD DAC 5-digit Purpose Codes are assumed. Note that at transaction level, only one sector per vocabulary can be reported."),
    "vocabulary": _("vocabulary"),
    "If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.": _("If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined."),
    "Add sector": _("Add sector"),
    "Select the type of the transaction (e.g. commitment, disbursement, expenditure).": _("Select the type of the transaction (e.g. commitment, disbursement, expenditure)."),
    "Transaction item": _("Transaction item"),
    "Enter the transaction amount. Use a period to denote decimals.": _("Enter the transaction amount. Use a period to denote decimals."),
    "Determines whether this transaction relates entirely or partially to humanitarian aid.": _("Determines whether this transaction relates entirely or partially to humanitarian aid."),
    "humanitarian transaction": _("humanitarian transaction"),
    "Enter the financial reporting date that the transaction was/will be undertaken.": _("Enter the financial reporting date that the transaction was/will be undertaken."),
    "date": _("date"),
    "The date to be used for determining the exchange rate for currency conversions of the transaction.": _("The date to be used for determining the exchange rate for currency conversions of the transaction."),
    "organisation": _("organisation"),
    "The internal identifier used by the receiver organisation for its activity that receives the funds from this transaction (not to be confused with the IATI identifier for the target activity).": _("The internal identifier used by the receiver organisation for its activity that receives the funds from this transaction (not to be confused with the IATI identifier for the target activity)."),
    "description": _("description"),
    "Enter additional information for the transaction, if necessary.": _("Enter additional information for the transaction, if necessary."),
    "transaction reference": _("transaction reference"),
    "Enter a reference for the transaction (eg. transaction number).": _("Enter a reference for the transaction (eg. transaction number)."),
    "Transaction aid type vocabulary": _("Transaction aid type vocabulary"),
    "Enter the type of vocabulary being used to describe the aid type For reference, please visit: <a href=\"http://iatistandard.org/203/codelists/AidTypeVocabulary/\" target=\"_blank\"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.": _("Enter the type of vocabulary being used to describe the aid type For reference, please visit: <a href=\"http://iatistandard.org/203/codelists/AidTypeVocabulary/\" target=\"_blank\"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>."),
    "Enter the type of aid being supplied. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/AidType/\" target=\"_blank\">http://iatistandard.org/202/codelists/AidType/</a>": _("Enter the type of aid being supplied. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/AidType/\" target=\"_blank\">http://iatistandard.org/202/codelists/AidType/</a>"),
    "aid type": _("aid type"),
    "Enter the channel through which the funds will flow for this transaction, from an IATI codelist. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/DisbursementChannel/\" target=\"_blank\">http://iatistandard.org/202/codelists/DisbursementChannel/</a>": _("Enter the channel through which the funds will flow for this transaction, from an IATI codelist. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/DisbursementChannel/\" target=\"_blank\">http://iatistandard.org/202/codelists/DisbursementChannel/</a>"),
    "Disbursement channel": _("Disbursement channel"),
    "For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FinanceType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FinanceType/</a>.": _("For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FinanceType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FinanceType/</a>."),
    "Finance type": _("Finance type"),
    "For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FlowType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FlowType/</a>.": _("For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FlowType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FlowType/</a>."),
    "Flow type": _("Flow type"),
    "Whether the aid is untied, tied, or partially tied. For reference visit <a href=\"http://iatistandard.org/202/codelists/TiedStatus/\" target=\"_blank\">http://iatistandard.org/202/codelists/TiedStatus/</a>.": _("Whether the aid is untied, tied, or partially tied. For reference visit <a href=\"http://iatistandard.org/202/codelists/TiedStatus/\" target=\"_blank\">http://iatistandard.org/202/codelists/TiedStatus/</a>."),
    "Tied status": _("Tied status"),
    "Recipient": _("Recipient"),
    "Enter the country that will benefit from this transaction. It can only be one country per transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Country/\" target=\"_blank\">http://iatistandard.org/202/codelists/Country/</a>.": _("Enter the country that will benefit from this transaction. It can only be one country per transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Country/\" target=\"_blank\">http://iatistandard.org/202/codelists/Country/</a>."),
    "country": _("country"),
    "Enter the supranational geopolitical region (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) that will benefit from this transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>.": _("Enter the supranational geopolitical region (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) that will benefit from this transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>."),
    "region": _("region"),
    "region vocabulary": _("region vocabulary"),
    "Region vocabulary uri": _("Region vocabulary uri"),
    "Transaction sectors": _("Transaction sectors"),
    "Add transaction": _("Add transaction"),
    "This should only be used to report specific planned cash transfers. Use a period to denote decimals.": _("This should only be used to report specific planned cash transfers. Use a period to denote decimals."),
    "Are you sure to delete this sector?": _("Are you sure to delete this sector?"),
    "Enter the type of vocabulary being used to describe the aid type For reference, please visit: <a href=\"http://iatistandard.org/203/codelists/AidTypeVocabulary/\" target=\"_blank\"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.": _("Enter the type of vocabulary being used to describe the aid type For reference, please visit: <a href=\"http://iatistandard.org/203/codelists/AidTypeVocabulary/\" target=\"_blank\"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>."),
    "Enter the type of aid being supplied. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/AidType/\" target=\"_blank\">http://iatistandard.org/202/codelists/AidType/</a>": _("Enter the type of aid being supplied. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/AidType/\" target=\"_blank\">http://iatistandard.org/202/codelists/AidType/</a>"),
    "Enter the channel through which the funds will flow for this transaction, from an IATI codelist. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/DisbursementChannel/\" target=\"_blank\">http://iatistandard.org/202/codelists/DisbursementChannel/</a>": _("Enter the channel through which the funds will flow for this transaction, from an IATI codelist. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/DisbursementChannel/\" target=\"_blank\">http://iatistandard.org/202/codelists/DisbursementChannel/</a>"),
    "For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FinanceType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FinanceType/</a>.": _("For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FinanceType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FinanceType/</a>."),
    "For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FlowType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FlowType/</a>.": _("For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/FlowType/\" target=\"_blank\">http://iatistandard.org/202/codelists/FlowType/</a>."),
    "Whether the aid is untied, tied, or partially tied. For reference visit <a href=\"http://iatistandard.org/202/codelists/TiedStatus/\" target=\"_blank\">http://iatistandard.org/202/codelists/TiedStatus/</a>.": _("Whether the aid is untied, tied, or partially tied. For reference visit <a href=\"http://iatistandard.org/202/codelists/TiedStatus/\" target=\"_blank\">http://iatistandard.org/202/codelists/TiedStatus/</a>."),
    "Enter the country that will benefit from this transaction. It can only be one country per transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Country/\" target=\"_blank\">http://iatistandard.org/202/codelists/Country/</a>.": _("Enter the country that will benefit from this transaction. It can only be one country per transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Country/\" target=\"_blank\">http://iatistandard.org/202/codelists/Country/</a>."),
    "Enter the supranational geopolitical region (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) that will benefit from this transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>.": _("Enter the supranational geopolitical region (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) that will benefit from this transaction. For reference, please visit: <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>."),

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
      "reporting": _("CRS++ and FSS reporting"),
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
    'section5': {
      "title": {
        "label": _("Title"),
        "tooltip": _(u'The aim of the project in one sentence. This doesn’t need to be something '
                    u'that can be directly counted, but it should describe an overall goal of the '
                    u'project. There can be multiple results for one project.')
      },
      "description": {
        "tooltip": _("You can provide further information of the result here.")
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
