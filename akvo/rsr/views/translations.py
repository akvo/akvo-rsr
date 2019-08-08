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
    u"The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project.": _(u"The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project."),
    u"Select the budget item(s) to indicate how the project budget is divided. Use the ‘Other’ fields to add custom budget items.": _(u"Select the budget item(s) to indicate how the project budget is divided. Use the ‘Other’ fields to add custom budget items."),
    u"This item encodes the alignment of activities with both the functional and administrative classifications used in the recipient country’s Chart of Accounts. This applies to both on- and off-budget activities.": _(u"This item encodes the alignment of activities with both the functional and administrative classifications used in the recipient country’s Chart of Accounts. This applies to both on- and off-budget activities."),
    u"Enter the specific date (DD/MM/YYYY) for the planned disbursement value.": _(u"Enter the specific date (DD/MM/YYYY) for the planned disbursement value."),
    u"If incoming funds are being provided from the budget of another activity that is reported to IATI, it is STRONGLY RECOMMENDED that this should record the provider’s unique IATI activity identifier for that activity.": _(u"If incoming funds are being provided from the budget of another activity that is reported to IATI, it is STRONGLY RECOMMENDED that this should record the provider’s unique IATI activity identifier for that activity."),
    u"Administrative": _(u"Administrative"),
    u"Are you sure to delete this administrative?": _(u"Are you sure to delete this administrative?"),
    u"For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicVocabulary/</a>.": _(u"For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicVocabulary/</a>."),
    u"Coded identification of national and sub-national divisions according to recognised administrative boundary repositories. Multiple levels may be reported.": _(u"Coded identification of national and sub-national divisions according to recognised administrative boundary repositories. Multiple levels may be reported."),
    u"administrative code": _(u"administrative code"),
    u"administrative level": _(u"administrative level"),
    u"Add administrative": _(u"Add administrative"),
    u"Locations": _(u"Locations"),
    u"address 1": _(u"address 1"),
    u"address 2": _(u"address 2"),
    u"postal code": _(u"postal code"),
    u"name": _(u"name"),
    u"The human-readable name for the location.": _(u"The human-readable name for the location."),
    u"reference": _(u"reference"),
    u"An internal reference that describes the location in the reporting organisation's own system.For reference see: <a href=\"http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes\" target=\"_blank\">http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes</a>.": _(u"An internal reference that describes the location in the reporting organisation's own system.For reference see: <a href=\"http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes\" target=\"_blank\">http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes</a>."),
    u"code": _(u"code"),
    u"Enter a code to identify the region. Codes are based on DAC region codes. Where an activity is considered global, the code 998 can be used. For reference: <a href=\"http://www.oecd.org/dac/stats/dacandcrscodelists.htm\" target=\"_blank\">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>.": _(u"Enter a code to identify the region. Codes are based on DAC region codes. Where an activity is considered global, the code 998 can be used. For reference: <a href=\"http://www.oecd.org/dac/stats/dacandcrscodelists.htm\" target=\"_blank\">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>."),
    u"location description": _(u"location description"),
    u"This provides free text space for providing an additional description, if needed, of the actual target of the activity. A description that qualifies the location, not the activity.": _(u"This provides free text space for providing an additional description, if needed, of the actual target of the activity. A description that qualifies the location, not the activity."),
    u"A description that qualifies the activity taking place at the location. This should not duplicate information provided in the main activity description, and should typically be used to distinguish between activities at multiple locations within a single iati-activity record.": _(u"A description that qualifies the activity taking place at the location. This should not duplicate information provided in the main activity description, and should typically be used to distinguish between activities at multiple locations within a single iati-activity record."),
    u"location precision": _(u"location precision"),
    u"Defines whether the location represents the most distinct point reasonably possible for this type of activity or is an approximation due to lack of more detailed information.": _(u"Defines whether the location represents the most distinct point reasonably possible for this type of activity or is an approximation due to lack of more detailed information."),
    u"Activity": _(u"Activity"),
    u"Intended beneficiaries": _(u"Intended beneficiaries"),
    u"reach": _(u"reach"),
    u"Does this location describe where the activity takes place or where the intended beneficiaries reside?": _(u"Does this location describe where the activity takes place or where the intended beneficiaries reside?"),
    u"Administrative Region": _(u"Administrative Region"),
    u"Populated Place": _(u"Populated Place"),
    u"Structure": _(u"Structure"),
    u"Other Topographical Feature": _(u"Other Topographical Feature"),
    u"class": _(u"class"),
    u"Does the location refer to a physical structure such as a building, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve)? For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicLocationClass/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicLocationClass/</a>.": _(u"Does the location refer to a physical structure such as a building, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve)? For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicLocationClass/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicLocationClass/</a>."),
    u"feature desgination": _(u"feature desgination"),
    u"Administratives": _(u"Administratives"),
    u"Add location": _(u"Add location"),
    u"Type to search...": _(u"Type to search..."),
    u"Project Scope": _(u"Project Scope"),
    u"recipient country": _(u"recipient country"),
    u"The percentage of total commitments or total activity budget allocated to this country. Content must be a positive decimal number between 0 and 100, with no percentage sign. Percentages for all reported countries and regions MUST add up to 100%. Use a period to denote decimals.": _(u"The percentage of total commitments or total activity budget allocated to this country. Content must be a positive decimal number between 0 and 100, with no percentage sign. Percentages for all reported countries and regions MUST add up to 100%. Use a period to denote decimals."),
    u"Percentage": _(u"Percentage"),
    u"Enter additional information about the recipient country, if necessary.": _(u"Enter additional information about the recipient country, if necessary."),
    u"Add recipient country": _(u"Add recipient country"),
    u"Recipient region": _(u"Recipient region"),
    u"recipient region": _(u"recipient region"),
    u"This identifies the region in which the activity takes place. Regions can be supra-national (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) or 'global' (activities benefiting substantially all developing countries). For the codes to use, please see <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>.": _(u"This identifies the region in which the activity takes place. Regions can be supra-national (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) or 'global' (activities benefiting substantially all developing countries). For the codes to use, please see <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>."),
    u"The vocabulary from which the region code is drawn. If it is not present 1 – 'OECD DAC' is assumed. For more information, see <a href=\"http://iatistandard.org/202/codelists/RegionVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/RegionVocabulary/</a>.": _(u"The vocabulary from which the region code is drawn. If it is not present 1 – 'OECD DAC' is assumed. For more information, see <a href=\"http://iatistandard.org/202/codelists/RegionVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/RegionVocabulary/</a>."),
    u"If the activity occurs in more than one region, the percentage of activity commitment allocated to each region should be provided if available. Percentages should add up to 100% of the activity being reported if they are shown for each region. Use a period to denote decimals.": _(u"If the activity occurs in more than one region, the percentage of activity commitment allocated to each region should be provided if available. Percentages should add up to 100% of the activity being reported if they are shown for each region. Use a period to denote decimals."),
    u"Add recipient region": _(u"Add recipient region"),
    u"Determines whether this project relates entirely or partially to humanitarian aid.": _(u"Determines whether this project relates entirely or partially to humanitarian aid."),
    u"humanitarian project": _(u"humanitarian project"),
    u"Policy markers": _(u"Policy markers"),
    u"policy marker": _(u"policy marker"),
    u"A policy or theme addressed by the activity, based on DAC policy markers. These indicators track key policy issues, like gender equality, environment, and trade development.": _(u"A policy or theme addressed by the activity, based on DAC policy markers. These indicators track key policy issues, like gender equality, environment, and trade development."),
    u"Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.            2 - Principal objective: the policy objective was the primary reason to undertake this activity.            3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.            4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health.": _(u"Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.            2 - Principal objective: the policy objective was the primary reason to undertake this activity.            3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.            4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health."),
    u"Significance": _(u"Significance"),
    u"Add Policy Marker": _(u"Add Policy Marker"),
    u"Sectors": _(u"Sectors"),
    u"sector": _(u"sector"),
    u"This is the code for the vocabulary used to describe the sector. Sectors should be mapped to DAC sectors to enable international comparison.": _(u"This is the code for the vocabulary used to describe the sector. Sectors should be mapped to DAC sectors to enable international comparison."),
    u"It is possible to specify a variety of sector codes, based on the selected vocabulary. The sector codes for the DAC-5 and DAC-3 vocabularies can be found here: <a href=\"http://iatistandard.org/202/codelists/Sector/\" target=\"_blank\">DAC-5 sector codes</a> and <a href=\"http://iatistandard.org/202/codelists/SectorCategory/\" target=\"_blank\">DAC-3 sector codes</a>.": _(u"It is possible to specify a variety of sector codes, based on the selected vocabulary. The sector codes for the DAC-5 and DAC-3 vocabularies can be found here: <a href=\"http://iatistandard.org/202/codelists/Sector/\" target=\"_blank\">DAC-5 sector codes</a> and <a href=\"http://iatistandard.org/202/codelists/SectorCategory/\" target=\"_blank\">DAC-3 sector codes</a>."),
    u"sector code": _(u"sector code"),
    u"Percentages should add up to 100% of the activity being reported if they are shown for each sector. Fill in 100% if there's one sector.Use a period to denote decimals.": _(u"Percentages should add up to 100% of the activity being reported if they are shown for each sector. Fill in 100% if there's one sector.Use a period to denote decimals."),
    u"city": _(u"city"),
    u"Select the geographical scope of the project.": _(u"Select the geographical scope of the project."),
    u"The country that benefits from the project.": _(u"The country that benefits from the project."),
    u"vocabulary URI": _(u"vocabulary URI"),
    u"humanitarian scopes": _(u"humanitarian scopes"),
    u"Humanitarian scope": _(u"Humanitarian scope"),
    u"The type of event or action being classified. See the <a href=\"http://iatistandard.org/202/codelists/HumanitarianScopeType/\" target=\"_blank\">IATI codelist</a>.": _(u"The type of event or action being classified. See the <a href=\"http://iatistandard.org/202/codelists/HumanitarianScopeType/\" target=\"_blank\">IATI codelist</a>."),
    u"Type": _(u"Type"),
    u"Emergency": _(u"Emergency"),
    u"Appeal": _(u"Appeal"),
    u"Code": _(u"Code"),
    u"Humanitarian plan": _(u"Humanitarian plan"),
    u"Add Humanitarian Scope": _(u"Add Humanitarian Scope"),
    u"Documents": _(u"Documents"),
    u"Document": _(u"Document"),
    u"Upload": _(u"Upload"),
    u"Enter the title of your document.": _(u"Enter the title of your document."),
    u"title": _(u"title"),
    u"Select the language of the document title.": _(u"Select the language of the document title."),
    u"title language": _(u"title language"),
    u"Select the language that the document is written in.": _(u"Select the language that the document is written in."),
    u"document language": _(u"document language"),
    u"Enter the date (DD/MM/YYYY) to be used for the production or publishing date of the relevant document to identify the specific document version.": _(u"Enter the date (DD/MM/YYYY) to be used for the production or publishing date of the relevant document to identify the specific document version."),
    u"document date": _(u"document date"),
    u"document format": _(u"document format"),
    u"The description of the type of content contained within the document.": _(u"The description of the type of content contained within the document."),
    u"Document categories": _(u"Document categories"),
    u"Please select...": _(u"Please select..."),
    u"Add document": _(u"Add document"),
    u"Links": _(u"Links"),
    u"Link": _(u"Link"),
    u"Enter the link to an external website you wish to redirect to from your project page. The URL should start with 'http://' or 'https://'.": _(u"Enter the link to an external website you wish to redirect to from your project page. The URL should start with 'http://' or 'https://'."),
    u"link url": _(u"link url"),
    u"Enter a name for the link.": _(u"Enter a name for the link."),
    u"link caption": _(u"link caption"),
    u"Add another link": _(u"Add another link"),
    u"Max: 5MB": _(u"Max: 5MB"),
    u"The project comments are only for internal use and will not be displayed anywhere on the project page.": _(u"The project comments are only for internal use and will not be displayed anywhere on the project page."),
    u"Comments": _(u"Comments"),
    u"Select keywords in case you are using an Akvo Page. Keywords linked to a project will determine if a project appears on the Akvo Page or not.": _(u"Select keywords in case you are using an Akvo Page. Keywords linked to a project will determine if a project appears on the Akvo Page or not."),
    u"Keywords": _(u"Keywords"),
    u"CRS++ other flag": _(u"CRS++ other flag"),
    u"An IATI code describing the equivalent CRS++ columns. See the <a href=\"http://iatistandard.org/202/codelists/CRSAddOtherFlags/\" target=\"_blank\">IATI codelist</a>.": _(u"An IATI code describing the equivalent CRS++ columns. See the <a href=\"http://iatistandard.org/202/codelists/CRSAddOtherFlags/\" target=\"_blank\">IATI codelist</a>."),
    u"Indicate whether the flag applies or not.": _(u"Indicate whether the flag applies or not."),
    u"significance": _(u"significance"),
    u"Add CRS++ other flag": _(u"Add CRS++ other flag"),
    u"CRS++ other forecast": _(u"CRS++ other forecast"),
    u"The forecast value for each year.": _(u"The forecast value for each year."),
    u"The calendar year that the forward spend covers.": _(u"The calendar year that the forward spend covers."),
    u"year": _(u"year"),
    u"Enter the specific date (DD/MM/YYYY) for the forecast value.": _(u"Enter the specific date (DD/MM/YYYY) for the forecast value."),
    u"Legacy data": _(u"Legacy data"),
    u"The original field name in the reporting organisation's system.": _(u"The original field name in the reporting organisation's system."),
    u"The original field value in the reporting organisation's system.": _(u"The original field value in the reporting organisation's system."),
    u"The name of the equivalent IATI element.": _(u"The name of the equivalent IATI element."),
    u"IATI equivalent": _(u"IATI equivalent"),
    u"Add legacy data": _(u"Add legacy data"),
    u"Loan terms": _(u"Loan terms"),
    u"An IATI codelist tabulating CRS-specified values for the type of Repayment. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentType/\" target=\"_blank\">IATI codelist</a>.": _(u"An IATI codelist tabulating CRS-specified values for the type of Repayment. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentType/\" target=\"_blank\">IATI codelist</a>."),
    u"Repayment type": _(u"Repayment type"),
    u"An IATI codelist tabulating CRS-specified values for the number of repayments per annum. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentPeriod/\" target=\"_blank\">IATI codelist</a>.": _(u"An IATI codelist tabulating CRS-specified values for the number of repayments per annum. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentPeriod/\" target=\"_blank\">IATI codelist</a>."),
    u"Repayment plan": _(u"Repayment plan"),
    u"The CRS++ reported commitment date.": _(u"The CRS++ reported commitment date."),
    u"Commitment date": _(u"Commitment date"),
    u"The CRS++ reported first repayment date.": _(u"The CRS++ reported first repayment date."),
    u"First repayment date": _(u"First repayment date"),
    u"The CRS++ reported final repayment date.": _(u"The CRS++ reported final repayment date."),
    u"Final repayment date": _(u"Final repayment date"),
    u"Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2.": _(u"Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2."),
    u"Rate": _(u"Rate"),
    u"Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here.": _(u"Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here."),
    u"Loan Status": _(u"Loan Status"),
    u"CRS reporting year (CRS++ Column 1).": _(u"CRS reporting year (CRS++ Column 1)."),
    u"Year": _(u"Year"),
    u"Currency": _(u"Currency"),
    u"Enter the specific date (DD/MM/YYYY) for the loan status values.": _(u"Enter the specific date (DD/MM/YYYY) for the loan status values."),
    u"Interest received during the reporting year.": _(u"Interest received during the reporting year."),
    u"Interest received": _(u"Interest received"),
    u"The amount of principal owed on the loan at the end of the reporting year.": _(u"The amount of principal owed on the loan at the end of the reporting year."),
    u"Principal outstanding": _(u"Principal outstanding"),
    u"Arrears of principal at the end of the year. Included in principal outstanding.": _(u"Arrears of principal at the end of the year. Included in principal outstanding."),
    u"Principal arrears": _(u"Principal arrears"),
    u"Arrears of interest at the end of the year.": _(u"Arrears of interest at the end of the year."),
    u"Interest arrears": _(u"Interest arrears"),
    u"The CRS channel code for this activity. The codelist contains both organisation types and names of organisations. For non-CRS purposes these should be reported using participating organisations. See the <a href=\"http://iatistandard.org/202/codelists/CRSChannelCode/\" target=\"_blank\">IATI codelist</a>.": _(u"The CRS channel code for this activity. The codelist contains both organisation types and names of organisations. For non-CRS purposes these should be reported using participating organisations. See the <a href=\"http://iatistandard.org/202/codelists/CRSChannelCode/\" target=\"_blank\">IATI codelist</a>."),
    u"channel code": _(u"channel code"),
    u"The exact date when the information was collected or extracted from donors' aid management systems.": _(u"The exact date when the information was collected or extracted from donors' aid management systems."),
    u"extraction date": _(u"extraction date"),
    u"If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements.": _(u"If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements."),
    u"phaseout year": _(u"phaseout year"),
    u"True if the partner country is a priority partner country.": _(u"True if the partner country is a priority partner country."),
    u"priority": _(u"priority"),
    u"FSS forecasts": _(u"FSS forecasts"),
    u"General Inquiries": _(u"General Inquiries"),
    u"Project Management": _(u"Project Management"),
    u"Financial Management": _(u"Financial Management"),
    u"Communications": _(u"Communications"),
    u"project partner": _(u"project partner"),
    u"Select an organisation that is playing a role in the project. If an organisation is not currently featured in RSR, please contact <a href='mailto: support@akvo.org'>support@akvo.org</a> to request to add it to the database.": _(u"Select an organisation that is playing a role in the project. If an organisation is not currently featured in RSR, please contact <a href='mailto: support@akvo.org'>support@akvo.org</a> to request to add it to the database."),
    "output": _("Output"),
    "outcome": _("Outcome"),
    "impact": _("Impact"),
    "other": _("Other"),
    u"Results framework preview": _(u"Results framework preview"),
    u"Saving...": _(u"Saving..."),
    u"Saved": _(u"Saved"),
    u"Something went wrong": _(u"Something went wrong"),
    u"Publish": _(u"Publish"),
    u"The project is unpublished": _(u"The project is unpublished"),
    u"Unpublish": _(u"Unpublish"),
    u"The project is published": _(u"The project is published"),
    u"Untitled project": _(u"Untitled project"),
    u"Start typing...": _(u"Start typing..."),
    u"Are you sure to delete this period?": _(u"Are you sure to delete this period?"),
    u"Minimum one required": _(u"Minimum one required"),
    u"Planned disbursement": _(u"Planned disbursement"),
    u"Location": _(u"Location"),
    u"Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.          2 - Principal objective: the policy objective was the primary reason to undertake this activity.          3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.          4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health.": _(u"Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.          2 - Principal objective: the policy objective was the primary reason to undertake this activity.          3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.          4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health."),
    u"Projects": _(u"Projects"),
    u"Date End (Planned)": _(u"Date End (Planned)"),
    u"My projects": _(u"My projects"),
    u"Find a project...": _(u"Find a project..."),
    u"Create new project": _(u"Create new project"),
    u"Periods": _(u"Periods"),
    u"Period": _(u"Period"),
    u"Target value": _(u"Target value"),
    u"Comment": _(u"Comment"),
    u"Add period": _(u"Add period"),
    u"The default RSR validation set which indicates the mandatory fields to publish a project in RSR and hides all advanced IATI fields.": _(u"The default RSR validation set which indicates the mandatory fields to publish a project in RSR and hides all advanced IATI fields."),
    u"The validation set for publishing to IATI v2.02. The mandatory fields in this validation set are the minimum requirements to publish a valid IATI v2.02 file.": _(u"The validation set for publishing to IATI v2.02. The mandatory fields in this validation set are the minimum requirements to publish a valid IATI v2.02 file."),
    u"Private project": _(u"Private project"),
    u"Indicate whether this is a private project. Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project.": _(u"Indicate whether this is a private project. Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project."),
    u"Validation sets": _(u"Validation sets"),
    u"It is possible to add or remove validation sets to your project. This determines which fields will be mandatory and which fields will be hidden. Only admins of partners with an RSR contract are able to edit this.": _(u"It is possible to add or remove validation sets to your project. This determines which fields will be mandatory and which fields will be hidden. Only admins of partners with an RSR contract are able to edit this."),
    u"A validation set with specific requirements for the Netherlands Leprosy Relief.": _(u"A validation set with specific requirements for the Netherlands Leprosy Relief."),
    u"To be used by all Gietrenk projects": _(u"To be used by all Gietrenk projects"),
    u"Validation set for The EU Emergency Trust Fund for Africa.": _(u"Validation set for The EU Emergency Trust Fund for Africa."),
    u"The validation set for publishing to IATI according to the guidelines of the Dutch Ministry of Foreign Affairs. These guidelines can be found <a href=\"https://www.government.nl/binaries/government/documents/publications/2015/12/01/open-data-and-development-cooperation/how-to-use-the-iati-standard-1.pdf\" target=\"_blank\" rel=\"noopener\">here</a>.": _(u"The validation set for publishing to IATI according to the guidelines of the Dutch Ministry of Foreign Affairs. These guidelines can be found <a href=\"https://www.government.nl/binaries/government/documents/publications/2015/12/01/open-data-and-development-cooperation/how-to-use-the-iati-standard-1.pdf\" target=\"_blank\" rel=\"noopener\">here</a>."),
    u"DFID minimum IATI requirements based on <a href=\"https://www.gov.uk/government/publications/2010-to-2015-government-policy-overseas-aid-transparency/2010-to-2015-government-policy-overseas-aid-transparency\" target=\"_blank\" rel=\"noopener\">the following government policy</a>. Please note that contact and document are also mandatory.": _(u"DFID minimum IATI requirements based on <a href=\"https://www.gov.uk/government/publications/2010-to-2015-government-policy-overseas-aid-transparency/2010-to-2015-government-policy-overseas-aid-transparency\" target=\"_blank\" rel=\"noopener\">the following government policy</a>. Please note that contact and document are also mandatory."),
    u"Create New Project": _(u"Create New Project"),
    u"Next: Edit Project Info": _(u"Next: Edit Project Info"),
    u"Updated": _(u"Updated"),
    u"by": _(u"by"),
    u"View Project Page": _(u"View project page"),
    u"Date created": _(u"Date created"),
    u"Please upload an image": _(u"Please upload an image"),
    u"The uploaded file is too big": _(u"The uploaded file is too big"),
    u"Only the the mandatory fields, i.e. the minimum requirements, to publish a valid IATI v2.02 file.": _(u"Only the the mandatory fields, i.e. the minimum requirements, to publish a valid IATI v2.02 file."),
    u"Required fields:": _(u"Required fields:"),
    u"more to fill": _(u"more to fill"),
    u"All done": _(u"All done"),
    u"Show required": _(u"Show required"),
    u"My details": _(u"My details"),
    u"Sign out": _(u"Sign out"),
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
