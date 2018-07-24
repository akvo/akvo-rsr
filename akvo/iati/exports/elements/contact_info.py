# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def contact_info(project):
    """
    Generate the contact-info elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    contact_info_elements = []

    for contact in project.contacts.all():
        if has_data(contact, ['type', 'organisation', 'department', 'person_name', 'job_title',
                              'telephone', 'email', 'website', 'mailing_address', ]):
            element = etree.Element("contact-info")

            if contact.type:
                element.attrib['type'] = str(contact.type)

            if contact.organisation:
                organisation_element = etree.SubElement(element, "organisation")
                narrative_element = etree.SubElement(organisation_element, "narrative")
                narrative_element.text = contact.organisation

            if contact.department:
                department_element = etree.SubElement(element, "department")
                narrative_element = etree.SubElement(department_element, "narrative")
                narrative_element.text = contact.department

            if contact.person_name:
                person_name_element = etree.SubElement(element, "person-name")
                narrative_element = etree.SubElement(person_name_element, "narrative")
                narrative_element.text = contact.person_name

            if contact.job_title:
                job_title_element = etree.SubElement(element, "job-title")
                narrative_element = etree.SubElement(job_title_element, "narrative")
                narrative_element.text = contact.job_title

            if contact.telephone:
                telephone_element = etree.SubElement(element, "telephone")
                telephone_element.text = contact.telephone

            if contact.email:
                email_element = etree.SubElement(element, "email")
                email_element.text = contact.email

            if contact.website:
                website_element = etree.SubElement(element, "website")
                website_element.text = contact.website

            if contact.mailing_address:
                mailing_address_element = etree.SubElement(element, "mailing-address")
                narrative_element = etree.SubElement(mailing_address_element, "narrative")
                narrative_element.text = contact.mailing_address

            contact_info_elements.append(element)

    return contact_info_elements
