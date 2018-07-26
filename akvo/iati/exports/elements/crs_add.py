# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def crs_add(project):
    """
    Generate the crs-add element.

    :param project: Project object
    :return: A list of Etree elements
    """
    crs = getattr(project, 'crsadd', None)

    if crs:
        element = etree.Element("crs-add")

        for flag in crs.other_flags.all():
            if flag.code or flag.significance is not None:
                other_flag_element = etree.SubElement(element, "other-flags")

                if flag.code:
                    other_flag_element.attrib['code'] = flag.code

                if flag.significance is not None:
                    other_flag_element.attrib['significance'] = '1' if flag.significance else '0'

                element.append(other_flag_element)

        if has_data(crs, ['loan_terms_rate1', 'loan_terms_rate2', 'repayment_type',
                          'repayment_plan', 'commitment_date', 'repayment_first_date',
                          'repayment_final_date', ]):
            loan_terms_element = etree.SubElement(element, "loan-terms")

            if crs.loan_terms_rate1 == 0 or crs.loan_terms_rate1:
                loan_terms_element.attrib['rate-1'] = str(crs.loan_terms_rate1)

            if crs.loan_terms_rate2 == 0 or crs.loan_terms_rate2:
                loan_terms_element.attrib['rate-2'] = str(crs.loan_terms_rate2)

            if crs.repayment_type:
                repayment_type_element = etree.SubElement(loan_terms_element, "repayment-type")
                repayment_type_element.attrib['code'] = crs.repayment_type

            if crs.repayment_plan:
                repayment_plan_element = etree.SubElement(loan_terms_element, "repayment-plan")
                repayment_plan_element.attrib['code'] = crs.repayment_plan

            if crs.commitment_date:
                commitment_date_element = etree.SubElement(loan_terms_element, "commitment-date")
                commitment_date_element.attrib['iso-date'] = str(crs.commitment_date)

            if crs.repayment_first_date:
                repayment_first_date_element = etree.SubElement(loan_terms_element, "repayment-first-date")
                repayment_first_date_element.attrib['iso-date'] = str(crs.repayment_first_date)

            if crs.repayment_final_date:
                repayment_final_date_element = etree.SubElement(loan_terms_element, "repayment-final-date")
                repayment_final_date_element.attrib['iso-date'] = str(crs.repayment_final_date)

            element.append(loan_terms_element)

            if has_data(crs, ['loan_status_year', 'loan_status_currency', 'loan_status_value_date',
                              'interest_received', 'principal_outstanding', 'principal_arrears',
                              'interest_arrears']):
                loan_status_element = etree.SubElement(element, "loan-status")

            if crs.loan_status_year:
                loan_status_element.attrib['year'] = str(crs.loan_status_year)

            if crs.loan_status_currency:
                loan_status_element.attrib['currency'] = crs.loan_status_currency

            if crs.loan_status_value_date:
                loan_status_element.attrib['value-date'] = str(crs.loan_status_value_date)

            if crs.interest_received == 0 or crs.interest_received:
                interest_received_element = etree.SubElement(loan_status_element,
                                                             "interest-received")
                interest_received_element.text = str(crs.interest_received)

            if crs.principal_outstanding == 0 or crs.principal_outstanding:
                principal_outstanding_element = etree.SubElement(loan_status_element,
                                                                 "principal-outstanding")
                principal_outstanding_element.text = str(crs.principal_outstanding)

            if crs.principal_arrears == 0 or crs.principal_arrears:
                principal_arrears_element = etree.SubElement(loan_status_element,
                                                             "principal-arrears")
                principal_arrears_element.text = str(crs.principal_arrears)

            if crs.interest_arrears == 0 or crs.interest_arrears:
                interest_arrears_element = etree.SubElement(loan_status_element, "interest-arrears")
                interest_arrears_element.text = str(crs.interest_arrears)

            element.append(loan_status_element)

        if crs.channel_code:
            channel_code_element = etree.SubElement(element, "channel-code")
            channel_code_element.text = str(crs.channel_code)

        return [element]

    else:
        return []
