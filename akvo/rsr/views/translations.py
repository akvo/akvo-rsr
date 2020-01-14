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
    "Project photo tooltip": _('Add your project photo here. You can only add one photo. If you have more, '
                    'you can add them via RSR updates when your project is published. A photo '
                    'album will feature on the project page. The photo should not be larger '
                    'than 2 MB in size, and should preferably be in JPG format.'),
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
    "The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project.": _("The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project."),
    "Select the budget item(s) to indicate how the project budget is divided. Use the ‘Other’ fields to add custom budget items.": _("Select the budget item(s) to indicate how the project budget is divided. Use the ‘Other’ fields to add custom budget items."),
    "This item encodes the alignment of activities with both the functional and administrative classifications used in the recipient country’s Chart of Accounts. This applies to both on- and off-budget activities.": _("This item encodes the alignment of activities with both the functional and administrative classifications used in the recipient country’s Chart of Accounts. This applies to both on- and off-budget activities."),
    "Enter the specific date (DD/MM/YYYY) for the planned disbursement value.": _("Enter the specific date (DD/MM/YYYY) for the planned disbursement value."),
    "If incoming funds are being provided from the budget of another activity that is reported to IATI, it is STRONGLY RECOMMENDED that this should record the provider’s unique IATI activity identifier for that activity.": _("If incoming funds are being provided from the budget of another activity that is reported to IATI, it is STRONGLY RECOMMENDED that this should record the provider’s unique IATI activity identifier for that activity."),
    "Administrative": _("Administrative"),
    "Are you sure to delete this administrative?": _("Are you sure to delete this administrative?"),
    "For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicVocabulary/</a>.": _("For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicVocabulary/</a>."),
    "Coded identification of national and sub-national divisions according to recognised administrative boundary repositories. Multiple levels may be reported.": _("Coded identification of national and sub-national divisions according to recognised administrative boundary repositories. Multiple levels may be reported."),
    "administrative code": _("administrative code"),
    "administrative level": _("administrative level"),
    "Add administrative": _("Add administrative"),
    "Locations": _("Locations"),
    "address 1": _("address 1"),
    "address 2": _("address 2"),
    "postal code": _("postal code"),
    "name": _("name"),
    "The human-readable name for the location.": _("The human-readable name for the location."),
    "reference": _("reference"),
    "An internal reference that describes the location in the reporting organisation's own system.For reference see: <a href=\"http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes\" target=\"_blank\">http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes</a>.": _("An internal reference that describes the location in the reporting organisation's own system.For reference see: <a href=\"http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes\" target=\"_blank\">http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes</a>."),
    "code": _("code"),
    "Enter a code to identify the region. Codes are based on DAC region codes. Where an activity is considered global, the code 998 can be used. For reference: <a href=\"http://www.oecd.org/dac/stats/dacandcrscodelists.htm\" target=\"_blank\">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>.": _("Enter a code to identify the region. Codes are based on DAC region codes. Where an activity is considered global, the code 998 can be used. For reference: <a href=\"http://www.oecd.org/dac/stats/dacandcrscodelists.htm\" target=\"_blank\">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>."),
    "location description": _("location description"),
    "This provides free text space for providing an additional description, if needed, of the actual target of the activity. A description that qualifies the location, not the activity.": _("This provides free text space for providing an additional description, if needed, of the actual target of the activity. A description that qualifies the location, not the activity."),
    "A description that qualifies the activity taking place at the location. This should not duplicate information provided in the main activity description, and should typically be used to distinguish between activities at multiple locations within a single iati-activity record.": _("A description that qualifies the activity taking place at the location. This should not duplicate information provided in the main activity description, and should typically be used to distinguish between activities at multiple locations within a single iati-activity record."),
    "location precision": _("location precision"),
    "Defines whether the location represents the most distinct point reasonably possible for this type of activity or is an approximation due to lack of more detailed information.": _("Defines whether the location represents the most distinct point reasonably possible for this type of activity or is an approximation due to lack of more detailed information."),
    "Activity": _("Activity"),
    "Intended beneficiaries": _("Intended beneficiaries"),
    "reach": _("reach"),
    "Does this location describe where the activity takes place or where the intended beneficiaries reside?": _("Does this location describe where the activity takes place or where the intended beneficiaries reside?"),
    "Administrative Region": _("Administrative Region"),
    "Populated Place": _("Populated Place"),
    "Structure": _("Structure"),
    "Other Topographical Feature": _("Other Topographical Feature"),
    "class": _("class"),
    "Does the location refer to a physical structure such as a building, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve)? For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicLocationClass/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicLocationClass/</a>.": _("Does the location refer to a physical structure such as a building, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve)? For reference: <a href=\"http://iatistandard.org/202/codelists/GeographicLocationClass/\" target=\"_blank\">http://iatistandard.org/202/codelists/GeographicLocationClass/</a>."),
    "feature desgination": _("feature desgination"),
    "Administratives": _("Administratives"),
    "Add location": _("Add location"),
    "Type to search...": _("Type to search..."),
    "Project Scope": _("Project Scope"),
    "recipient country": _("recipient country"),
    "The percentage of total commitments or total activity budget allocated to this country. Content must be a positive decimal number between 0 and 100, with no percentage sign. Percentages for all reported countries and regions MUST add up to 100%. Use a period to denote decimals.": _("The percentage of total commitments or total activity budget allocated to this country. Content must be a positive decimal number between 0 and 100, with no percentage sign. Percentages for all reported countries and regions MUST add up to 100%. Use a period to denote decimals."),
    "Percentage": _("Percentage"),
    "Enter additional information about the recipient country, if necessary.": _("Enter additional information about the recipient country, if necessary."),
    "Add recipient country": _("Add recipient country"),
    "Recipient region": _("Recipient region"),
    "recipient region": _("recipient region"),
    "This identifies the region in which the activity takes place. Regions can be supra-national (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) or 'global' (activities benefiting substantially all developing countries). For the codes to use, please see <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>.": _("This identifies the region in which the activity takes place. Regions can be supra-national (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) or 'global' (activities benefiting substantially all developing countries). For the codes to use, please see <a href=\"http://iatistandard.org/202/codelists/Region/\" target=\"_blank\">http://iatistandard.org/202/codelists/Region/</a>."),
    "The vocabulary from which the region code is drawn. If it is not present 1 – 'OECD DAC' is assumed. For more information, see <a href=\"http://iatistandard.org/202/codelists/RegionVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/RegionVocabulary/</a>.": _("The vocabulary from which the region code is drawn. If it is not present 1 – 'OECD DAC' is assumed. For more information, see <a href=\"http://iatistandard.org/202/codelists/RegionVocabulary/\" target=\"_blank\">http://iatistandard.org/202/codelists/RegionVocabulary/</a>."),
    "If the activity occurs in more than one region, the percentage of activity commitment allocated to each region should be provided if available. Percentages should add up to 100% of the activity being reported if they are shown for each region. Use a period to denote decimals.": _("If the activity occurs in more than one region, the percentage of activity commitment allocated to each region should be provided if available. Percentages should add up to 100% of the activity being reported if they are shown for each region. Use a period to denote decimals."),
    "Add recipient region": _("Add recipient region"),
    "Determines whether this project relates entirely or partially to humanitarian aid.": _("Determines whether this project relates entirely or partially to humanitarian aid."),
    "humanitarian project": _("humanitarian project"),
    "Policy markers": _("Policy markers"),
    "policy marker": _("policy marker"),
    "A policy or theme addressed by the activity, based on DAC policy markers. These indicators track key policy issues, like gender equality, environment, and trade development.": _("A policy or theme addressed by the activity, based on DAC policy markers. These indicators track key policy issues, like gender equality, environment, and trade development."),
    "Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.            2 - Principal objective: the policy objective was the primary reason to undertake this activity.            3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.            4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health.": _("Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.            2 - Principal objective: the policy objective was the primary reason to undertake this activity.            3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.            4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health."),
    "Significance": _("Significance"),
    "Add Policy Marker": _("Add Policy Marker"),
    "Sectors": _("Sectors"),
    "sector": _("sector"),
    "This is the code for the vocabulary used to describe the sector. Sectors should be mapped to DAC sectors to enable international comparison.": _("This is the code for the vocabulary used to describe the sector. Sectors should be mapped to DAC sectors to enable international comparison."),
    "It is possible to specify a variety of sector codes, based on the selected vocabulary. The sector codes for the DAC-5 and DAC-3 vocabularies can be found here: <a href=\"http://iatistandard.org/202/codelists/Sector/\" target=\"_blank\">DAC-5 sector codes</a> and <a href=\"http://iatistandard.org/202/codelists/SectorCategory/\" target=\"_blank\">DAC-3 sector codes</a>.": _("It is possible to specify a variety of sector codes, based on the selected vocabulary. The sector codes for the DAC-5 and DAC-3 vocabularies can be found here: <a href=\"http://iatistandard.org/202/codelists/Sector/\" target=\"_blank\">DAC-5 sector codes</a> and <a href=\"http://iatistandard.org/202/codelists/SectorCategory/\" target=\"_blank\">DAC-3 sector codes</a>."),
    "sector code": _("sector code"),
    "Percentages should add up to 100% of the activity being reported if they are shown for each sector. Fill in 100% if there's one sector.Use a period to denote decimals.": _("Percentages should add up to 100% of the activity being reported if they are shown for each sector. Fill in 100% if there's one sector.Use a period to denote decimals."),
    "city": _("city"),
    "Select the geographical scope of the project.": _("Select the geographical scope of the project."),
    "The country that benefits from the project.": _("The country that benefits from the project."),
    "vocabulary URI": _("vocabulary URI"),
    "humanitarian scopes": _("humanitarian scopes"),
    "Humanitarian scope": _("Humanitarian scope"),
    "The type of event or action being classified. See the <a href=\"http://iatistandard.org/202/codelists/HumanitarianScopeType/\" target=\"_blank\">IATI codelist</a>.": _("The type of event or action being classified. See the <a href=\"http://iatistandard.org/202/codelists/HumanitarianScopeType/\" target=\"_blank\">IATI codelist</a>."),
    "Type": _("Type"),
    "Emergency": _("Emergency"),
    "Appeal": _("Appeal"),
    "Code": _("Code"),
    "Humanitarian plan": _("Humanitarian plan"),
    "Add Humanitarian Scope": _("Add Humanitarian Scope"),
    "Documents": _("Documents"),
    "Document": _("Document"),
    "Upload": _("Upload"),
    "Enter the title of your document.": _("Enter the title of your document."),
    "title": _("title"),
    "Select the language of the document title.": _("Select the language of the document title."),
    "title language": _("title language"),
    "Select the language that the document is written in.": _("Select the language that the document is written in."),
    "document language": _("document language"),
    "Enter the date (DD/MM/YYYY) to be used for the production or publishing date of the relevant document to identify the specific document version.": _("Enter the date (DD/MM/YYYY) to be used for the production or publishing date of the relevant document to identify the specific document version."),
    "document date": _("document date"),
    "document format": _("document format"),
    "The description of the type of content contained within the document.": _("The description of the type of content contained within the document."),
    "Document categories": _("Document categories"),
    "Please select...": _("Please select..."),
    "Add document": _("Add document"),
    "Links": _("Links"),
    "Link": _("Link"),
    "Enter the link to an external website you wish to redirect to from your project page. The URL should start with 'http://' or 'https://'.": _("Enter the link to an external website you wish to redirect to from your project page. The URL should start with 'http://' or 'https://'."),
    "link url": _("link url"),
    "Enter a name for the link.": _("Enter a name for the link."),
    "link caption": _("link caption"),
    "Add another link": _("Add another link"),
    "Max: 5MB": _("Max: 5MB"),
    "The project comments are only for internal use and will not be displayed anywhere on the project page.": _("The project comments are only for internal use and will not be displayed anywhere on the project page."),
    "Comments": _("Comments"),
    "Select keywords in case you are using an Akvo Page. Keywords linked to a project will determine if a project appears on the Akvo Page or not.": _("Select keywords in case you are using an Akvo Page. Keywords linked to a project will determine if a project appears on the Akvo Page or not."),
    "Keywords": _("Keywords"),
    "CRS++ other flag": _("CRS++ other flag"),
    "An IATI code describing the equivalent CRS++ columns. See the <a href=\"http://iatistandard.org/202/codelists/CRSAddOtherFlags/\" target=\"_blank\">IATI codelist</a>.": _("An IATI code describing the equivalent CRS++ columns. See the <a href=\"http://iatistandard.org/202/codelists/CRSAddOtherFlags/\" target=\"_blank\">IATI codelist</a>."),
    "Indicate whether the flag applies or not.": _("Indicate whether the flag applies or not."),
    "significance": _("significance"),
    "Add CRS++ other flag": _("Add CRS++ other flag"),
    "CRS++ other forecast": _("CRS++ other forecast"),
    "The forecast value for each year.": _("The forecast value for each year."),
    "The calendar year that the forward spend covers.": _("The calendar year that the forward spend covers."),
    "year": _("year"),
    "Enter the specific date (DD/MM/YYYY) for the forecast value.": _("Enter the specific date (DD/MM/YYYY) for the forecast value."),
    "Legacy data": _("Legacy data"),
    "The original field name in the reporting organisation's system.": _("The original field name in the reporting organisation's system."),
    "The original field value in the reporting organisation's system.": _("The original field value in the reporting organisation's system."),
    "The name of the equivalent IATI element.": _("The name of the equivalent IATI element."),
    "IATI equivalent": _("IATI equivalent"),
    "Add legacy data": _("Add legacy data"),
    "Loan terms": _("Loan terms"),
    "An IATI codelist tabulating CRS-specified values for the type of Repayment. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentType/\" target=\"_blank\">IATI codelist</a>.": _("An IATI codelist tabulating CRS-specified values for the type of Repayment. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentType/\" target=\"_blank\">IATI codelist</a>."),
    "Repayment type": _("Repayment type"),
    "An IATI codelist tabulating CRS-specified values for the number of repayments per annum. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentPeriod/\" target=\"_blank\">IATI codelist</a>.": _("An IATI codelist tabulating CRS-specified values for the number of repayments per annum. See the <a href=\"http://iatistandard.org/202/codelists/LoanRepaymentPeriod/\" target=\"_blank\">IATI codelist</a>."),
    "Repayment plan": _("Repayment plan"),
    "The CRS++ reported commitment date.": _("The CRS++ reported commitment date."),
    "Commitment date": _("Commitment date"),
    "The CRS++ reported first repayment date.": _("The CRS++ reported first repayment date."),
    "First repayment date": _("First repayment date"),
    "The CRS++ reported final repayment date.": _("The CRS++ reported final repayment date."),
    "Final repayment date": _("Final repayment date"),
    "Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2.": _("Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2."),
    "Rate": _("Rate"),
    "Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here.": _("Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here."),
    "Loan Status": _("Loan Status"),
    "CRS reporting year (CRS++ Column 1).": _("CRS reporting year (CRS++ Column 1)."),
    "Year": _("Year"),
    "Currency": _("Currency"),
    "Enter the specific date (DD/MM/YYYY) for the loan status values.": _("Enter the specific date (DD/MM/YYYY) for the loan status values."),
    "Interest received during the reporting year.": _("Interest received during the reporting year."),
    "Interest received": _("Interest received"),
    "The amount of principal owed on the loan at the end of the reporting year.": _("The amount of principal owed on the loan at the end of the reporting year."),
    "Principal outstanding": _("Principal outstanding"),
    "Arrears of principal at the end of the year. Included in principal outstanding.": _("Arrears of principal at the end of the year. Included in principal outstanding."),
    "Principal arrears": _("Principal arrears"),
    "Arrears of interest at the end of the year.": _("Arrears of interest at the end of the year."),
    "Interest arrears": _("Interest arrears"),
    "The CRS channel code for this activity. The codelist contains both organisation types and names of organisations. For non-CRS purposes these should be reported using participating organisations. See the <a href=\"http://iatistandard.org/202/codelists/CRSChannelCode/\" target=\"_blank\">IATI codelist</a>.": _("The CRS channel code for this activity. The codelist contains both organisation types and names of organisations. For non-CRS purposes these should be reported using participating organisations. See the <a href=\"http://iatistandard.org/202/codelists/CRSChannelCode/\" target=\"_blank\">IATI codelist</a>."),
    "channel code": _("channel code"),
    "The exact date when the information was collected or extracted from donors' aid management systems.": _("The exact date when the information was collected or extracted from donors' aid management systems."),
    "extraction date": _("extraction date"),
    "If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements.": _("If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements."),
    "phaseout year": _("phaseout year"),
    "True if the partner country is a priority partner country.": _("True if the partner country is a priority partner country."),
    "priority": _("priority"),
    "FSS forecasts": _("FSS forecasts"),
    "General Inquiries": _("General Inquiries"),
    "Project Management": _("Project Management"),
    "Financial Management": _("Financial Management"),
    "Communications": _("Communications"),
    "project partner": _("project partner"),
    "Select an organisation that is playing a role in the project. If an organisation is not currently featured in RSR, please contact <a href='mailto: support@akvo.org'>support@akvo.org</a> to request to add it to the database.": _("Select an organisation that is playing a role in the project. If an organisation is not currently featured in RSR, please contact <a href='mailto: support@akvo.org'>support@akvo.org</a> to request to add it to the database."),
    "output": _("Output"),
    "outcome": _("Outcome"),
    "impact": _("Impact"),
    "other": _("Other"),
    "Results framework preview": _("Results framework preview"),
    "Saving...": _("Saving..."),
    "Saved": _("Saved"),
    "Something went wrong": _("Something went wrong"),
    "Publish": _("Publish"),
    "The project is unpublished": _("The project is unpublished"),
    "Unpublish": _("Unpublish"),
    "The project is published": _("The project is published"),
    "Untitled project": _("Untitled project"),
    "Start typing...": _("Start typing..."),
    "Are you sure to delete this period?": _("Are you sure to delete this period?"),
    "Minimum one required": _("Minimum one required"),
    "Planned disbursement": _("Planned disbursement"),
    "Location": _("Location"),
    "Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.          2 - Principal objective: the policy objective was the primary reason to undertake this activity.          3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.          4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health.": _("Each reported marker must contain the significance of the policy marker for this activity. Choices are:0 - Not targeted1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.          2 - Principal objective: the policy objective was the primary reason to undertake this activity.          3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.          4 - Explicit primary objective: only to be used in combination with policy marker.9 - reproductive, maternal, newborn and child health."),
    "Projects": _("Projects"),
    "Date End (Planned)": _("Date End (Planned)"),
    "My projects": _("My projects"),
    "Find a project...": _("Find a project..."),
    "Create new project": _("Create new project"),
    "Periods": _("Periods"),
    "Period": _("Period"),
    "Target value": _("Target value"),
    "Comment": _("Comment"),
    "Add period": _("Add period"),
    "The default RSR validation set which indicates the mandatory fields to publish a project in RSR and hides all advanced IATI fields.": _("The default RSR validation set which indicates the mandatory fields to publish a project in RSR and hides all advanced IATI fields."),
    "The validation set for publishing to IATI v2.02. The mandatory fields in this validation set are the minimum requirements to publish a valid IATI v2.02 file.": _("The validation set for publishing to IATI v2.02. The mandatory fields in this validation set are the minimum requirements to publish a valid IATI v2.02 file."),
    "Private project": _("Private project"),
    "Indicate whether this is a private project. Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project.": _("Indicate whether this is a private project. Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project."),
    "Validation sets": _("Validation sets"),
    "It is possible to add or remove validation sets to your project. This determines which fields will be mandatory and which fields will be hidden. Only admins of partners with an RSR contract are able to edit this.": _("It is possible to add or remove validation sets to your project. This determines which fields will be mandatory and which fields will be hidden. Only admins of partners with an RSR contract are able to edit this."),
    "A validation set with specific requirements for the Netherlands Leprosy Relief.": _("A validation set with specific requirements for the Netherlands Leprosy Relief."),
    "To be used by all Gietrenk projects": _("To be used by all Gietrenk projects"),
    "Validation set for The EU Emergency Trust Fund for Africa.": _("Validation set for The EU Emergency Trust Fund for Africa."),
    "The validation set for publishing to IATI according to the guidelines of the Dutch Ministry of Foreign Affairs. These guidelines can be found <a href=\"https://www.government.nl/binaries/government/documents/publications/2015/12/01/open-data-and-development-cooperation/how-to-use-the-iati-standard-1.pdf\" target=\"_blank\" rel=\"noopener\">here</a>.": _("The validation set for publishing to IATI according to the guidelines of the Dutch Ministry of Foreign Affairs. These guidelines can be found <a href=\"https://www.government.nl/binaries/government/documents/publications/2015/12/01/open-data-and-development-cooperation/how-to-use-the-iati-standard-1.pdf\" target=\"_blank\" rel=\"noopener\">here</a>."),
    "DFID minimum IATI requirements based on <a href=\"https://www.gov.uk/government/publications/2010-to-2015-government-policy-overseas-aid-transparency/2010-to-2015-government-policy-overseas-aid-transparency\" target=\"_blank\" rel=\"noopener\">the following government policy</a>. Please note that contact and document are also mandatory.": _("DFID minimum IATI requirements based on <a href=\"https://www.gov.uk/government/publications/2010-to-2015-government-policy-overseas-aid-transparency/2010-to-2015-government-policy-overseas-aid-transparency\" target=\"_blank\" rel=\"noopener\">the following government policy</a>. Please note that contact and document are also mandatory."),
    "Create New Project": _("Create New Project"),
    "Next: Edit Project Info": _("Next: Edit Project Info"),
    "Updated": _("Updated"),
    "by": _("by"),
    "View Project Page": _("View project page"),
    "Date created": _("Date created"),
    "Please upload an image": _("Please upload an image"),
    "The uploaded file is too big": _("The uploaded file is too big"),
    "Only the the mandatory fields, i.e. the minimum requirements, to publish a valid IATI v2.02 file.": _("Only the the mandatory fields, i.e. the minimum requirements, to publish a valid IATI v2.02 file."),
    "Required fields:": _("Required fields:"),
    "more to fill": _("more to fill"),
    "All done": _("All done"),
    "Show required": _("Show required"),
    "My details": _("My details"),
    "Sign out": _("Sign out"),
    "Results": _("Results"),
    "Parent project": _("Parent project"),
    "Project contacts": _("Project contacts"),
    "Project partners": _("Project partners"),
    "Disbursement": _("Disbursement"),
    "Transaction": _("Transaction"),
    "Add another transaction": _("Add another transaction"),
    "Each reported marker must contain the significance of the policy marker for this activity. Choices are:<br />0 - Not targeted<br />1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.<br />2 - Principal objective: the policy objective was the primary reason to undertake this activity.<br />3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.<br />4 - Explicit primary objective: only to be used in combination with policy marker.<br />9 - reproductive, maternal, newborn and child health.": _("Each reported marker must contain the significance of the policy marker for this activity. Choices are:<br />0 - Not targeted<br />1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.<br />2 - Principal objective: the policy objective was the primary reason to undertake this activity.<br />3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.<br />4 - Explicit primary objective: only to be used in combination with policy marker.<br />9 - reproductive, maternal, newborn and child health."),
    "Users": _("Users"),
    "Reports": _("Reports"),
    "Validation set": _("Validation set"),
    "General information": _("General information"),
    "Project contacts": _("Project contacts"),
    "Partners": _("Partners"),
    "Descriptions": _("Descriptions"),
    'Results and indicators': _("Results and indicators"),
    "Finance": _("Finance"),
    "Locations": _("Locations"),
    "Project focus": _("Project focus"),
    "Links and documents": _("Links and documents"),
    "Comments and keywords": _("Comments and keywords"),
    "CRS++ and FSS reporting": _("CRS++ and FSS reporting"),
    "Preview": _("Preview"),
    "menu::settings": _("menu::settings"),
    "External project": _("External project"),
    "Move up": _("Move up"),
    "Move down": _("Move down"),
    "Info": _("Info"),
    "Baseline": _("Baseline"),
    "Link copied!": _("Link copied!"),
    "Get a link to this indicator": _("Get a link to this indicator"),
    "Thematic labels for indicators": _("Thematic labels for indicators"),
    "Get a link to this period": _("Get a link to this period"),
    "Start": _("Start"),
    "End": _("End"),
    "You have insufficient permissions to import results from the selected parent project. Please choose a different parent project.": _("You have insufficient permissions to import results from the selected parent project. Please choose a different parent project."),
    "You have insufficient permissions to copy results from the selected project. Please choose a different project.": _("You have insufficient permissions to copy results from the selected project. Please choose a different project."),
    "Open": _("Open"),
    "Get a link to this result": _("Get a link to this result"),
    "Add new organisation": _("Add new organisation"),
    "Add New Organization": _("Add New Organization"),
    "Long name": _("Long name"),
    "IATI identifier": _("IATI identifier"),
    "Organisation type": _("Organisation type"),
    "Website": _("Website"),
    "Contact name": _("Contact name"),
    "Contact email": _("Contact email"),
    "Organisation logo": _("Organisation logo"),
    "Select Image": _("Select Image"),
    "settings": _("settings"),
    "External child projects": _("External child projects"),
    "Add external child project": _("Add external child project"),
    "Parent project not in RSR": _("Parent project not in RSR"),
    "Include in IATI export": _("Include in IATI export"),
    "(1){child project};(2-inf){child projects};": _("(1){child project};(2-inf){child projects};"),
    "(1){child project};(2-inf){child projects};_plural": _("(1){child project};(2-inf){child projects};_plural"),
    "Go to selected": _("Go to selected"),
    "Level {{level}} projects": _("Level {{level}} projects"),
    "Programs": _("Programs"),
    "Projects hierarchy": _("Projects hierarchy"),
    "Filter": _("Filter"),
    "Select a level {{level}} project with children": _("Select a level {{level}} project with children"),
    "All countries": _("All countries"),
    "All sectors": _("All sectors"),
    "Filter:": _("Filter:"),
    "Privacy": _("Privacy"),
    "public": _("public"),
    "private": _("private"),
    "Sector": _("Sector"),
    'section1': {
        "title": {
            "label": _("project title"),
        },
        "subtitle": {
            "label": _("project subtitle"),
        },
        "iatiStatus": {
            "label": _("Status"),
            "tooltip": _('There are six different project statuses:<br/>'
                    '1) Pipeline/identification: the project is being scoped or planned<br/>'
                    '2) Implementation: the project is currently being implemented<br/>'
                    '3) Completion: the project is complete or the final disbursement has been '
                    'made<br/>'
                    '4) Post-completion: the project is complete or the final disbursement has '
                    'been made, '
                    'but the project remains open pending financial sign off or M&E<br/>'
                    '5) Cancelled: the project has been cancelled<br/>'
                    '6) Suspended: the project has been temporarily suspended '
                    'or the reporting partner no longer uses RSR.')
        },
        "iatiActivityId": {
            "label": _("IATI identifier"),
            "tooltip": _('This is a globally unique identifier for this activity. It is a requirement '
                    'to be compliant with the IATI standard. This code consists of: '
                    '[country code]-[Chamber of Commerce number]-[organisation’s internal project '
                    'code]. For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more '
                    'information see') + ' <a href="http://iatistandard.org/202/activity-standard/'
                                          'iati-activities/iati-activity/iati-identifier/'
                                          '#definition" target="_blank">http://iatistandard.org/'
                                          '201/activity-standard/iati-activities/iati-activity/'
                                          'iati-identifier/#definition</a>'
            
        },
        "hierarchy": {
            "label": _("Hierarchy"),
            "tooltip": _('If you are reporting multiple levels of projects in RSR, you can specify '
                    'whether this is a core, sub, or lower sub activity here.'),
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
            "label": _('default aid type vocabulary'),
            "tooltip": _('This is the IATI identifier for the type of vocabulary being used for '
                    'describing the type of the aid being supplied or activity '
                    'being undertaken. For reference, please visit: <a '
                    'href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target='
                    '"_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.'),
        },
        "defaultAidType": {
            "label": _("default aid type"),
            "tooltip": _('This is the IATI identifier for the type of aid being supplied or activity '
                    'being undertaken. This element specifies a default for all the project’s '
                    'financial transactions. This can be overridden at the individual transaction '
                    'level. For reference, please visit: <a href="http://iatistandard.org/202/'
                    'codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'AidType/</a>.'),
        },
        "defaultFlowType": {
            "label": _("default flow type"),
            "tooltip": _('This is the IATI identifier for how the activity (project) is funded. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'FlowType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'FlowType/</a>.'),
        },
        "defaultTiedStatus": {
            "label": _("default tied status"),
            "tooltip": _('This element specifies a default for all the activity’s financial '
                    'transactions; it can be overridden at the individual transaction level. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'TiedStatus/" target="_blank">http://iatistandard.org/202/codelists/'
                    'TiedStatus/</a>.'),
        },
        "collaborationType": {
            "label": _("collaboration type"),
            "tooltip": _('This is the IATI identifier for the type of collaboration involved. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'CollaborationType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'CollaborationType/</a>.'),
        },
        "defaultFinanceType": {
            "label": _("default finance type"),
            "tooltip": _('This is the IATI identifier for the type of finance. This element specifies '
                    'a default for all the transactions in the project’s activity report; it can '
                    'be overridden at the individual transaction level. For reference visit: '
                    '<a href="http://iatistandard.org/202/codelists/FinanceType/" target="_blank">'
                    'http://iatistandard.org/202/codelists/FinanceType/</a>.'),
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
        "tooltip": _('The contact web address, if available. The web address should start with '
                    '\'http://\' or \'https://\'.')
      }
    },
    'section3': {
      "organisation": {
        "label": _("Project partner"),
        "tooltip": _("Select an organisation that is playing a role in the project.  If an organisation is not currently featured in RSR, please contact")
      },
      "fundingAmount": {
        "label": _("funding amount"),
        "tooltip": _('It’s only possible to indicate a funding amount for funding partners. Use a '
                    'period to denote decimals.')
      },
      "secondaryReporter": {
        "label": _('secondary reporter'),
        "tooltip": _(
            'This indicates whether the reporting organisation is a secondary publisher: '
            'publishing data for which it is not directly responsible.'
        )
      },
      "iatiOrganisationRole": {
        "label": _("organisation role"),
        "tooltip": _('Select the role of the organisation within the project:<br/>'
                    '- Funding organisation: a government or organisation that provides funds to '
                    'the project<br/>'
                    '- Implementing organisation: an organisation involved in carrying out the '
                    'activity or intervention<br/>'
                    '- Accountable organisation: an organisation responsible for oversight of '
                    'the project and its outcomes<br/>'
                    '- Extending organisation: an organisation that manages the budget and '
                    'direction of a project on behalf of the funding organisation<br/>'
                    '- Reporting organisation: an organisation that will report this project in '
                    'an IATI file')
      },
      "iatiActivityId": {
        "label": _("IATI activity ID"),
        "tooltip": _('A valid activity identifier published by the participating organisation '
                    'which points to the activity that it has published to IATI that describes '
                    'its role in this activity.')
      }
    },
    'section4': {
      "projectPlanSummary": {
        "label": _('Project summary'),
        "info": _('Enter a brief summary, try to restrict the number of characters to 400 in '
                    'order to display the summary nicely on the project page. The summary should '
                    'explain:<br>'
                    '- Why the project is being carried out;<br>'
                    '- Where it is taking place;<br>'
                    '- Who will benefit and/or participate;<br>'
                    '- What it specifically hopes to accomplish;<br>'
                    '- How those specific goals will be reached')
      },
      "goalsOverview": {
        "label": _('Goals overview'),
        "info": _('Provide a brief description of the overall project goals.')
      },
      "background": {
        "label": _('Background'),
        "info": _('This should describe the geographical, political, environmental, social '
                    'and/or cultural context of the project, and any related activities that '
                    'have already taken place or are underway')
      },
      "currentStatus": {
        "label": _('baseline situation'),
        "info": _('Describe the situation at the start of the project.')
      },
      "targetGroup": {
        "label": _('Target group'),
        "info": _('This should include information about the people, organisations or resources '
                    'that are being impacted by this project.')
      },
      "projectPlan": {
        "label": _('Project plan'),
        "info": _('Detailed information about the implementation of the project: the what, how, '
                    'who and when.')
      },
      "sustainability": {
        "label": _('Sustainability'),
        "info": _('Describe how you aim to guarantee sustainability of the project until 10 '
                    'years after project implementation. Think about the institutional setting, '
                    'capacity-building, a cost recovery plan, products used, feasible '
                    'arrangements for operation and maintenance, anticipation of environmental '
                    'impact and social integration.')
      },
    },
    'section5': {
      "title": {
        "label": _("Title"),
        "tooltip": _('The aim of the project in one sentence. This doesn’t need to be something '
                    'that can be directly counted, but it should describe an overall goal of the '
                    'project. There can be multiple results for one project.')
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
