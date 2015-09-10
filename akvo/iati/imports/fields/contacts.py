# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.db.models import get_model


def contacts(activity, project, activities_globals):
    """
    Retrieve and store the contact information.
    The contact information will be extracted from the 'contact-info' elements.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_contacts = []
    changes = []

    for contact in activity.findall('contact-info'):
        contact_type = ''
        organisation_text = ''
        department_text = ''
        person_name_text = ''
        job_title_text = ''
        telephone_text = ''
        email_text = ''
        website_text = ''
        mailing_address_text = ''

        if 'type' in contact.attrib.keys() and len(contact.attrib['type']) < 2:
            contact_type = contact.attrib['type']

        organisation_element = contact.find('organisation')
        if not organisation_element is None:
            organisation_text = get_text(organisation_element, activities_globals['version'])[:100]

        department_element = contact.find('department')
        if not department_element is None:
            department_text = get_text(department_element, activities_globals['version'])[:100]

        person_name_element = contact.find('person-name')
        if not person_name_element is None:
            person_name_text = get_text(person_name_element, activities_globals['version'])[:100]

        job_title_element = contact.find('job-title')
        if not job_title_element is None:
            job_title_text = get_text(job_title_element, activities_globals['version'])[:100]

        telephone_element = contact.find('telephone')
        if not telephone_element is None and not telephone_element.text is None:
            telephone_text = telephone_element.text[:30]

        email_element = contact.find('email')
        if not email_element is None and not email_element.text is None:
            email_text = email_element.text

        website_element = contact.find('website')
        if not website_element is None and not website_element.text is None:
            website_text = website_element.text

        mail_addr_element = contact.find('mailing-address')
        if not mail_addr_element is None:
            mailing_address_text = get_text(mail_addr_element, activities_globals['version'])[:255]

        c, created = get_model('rsr', 'projectcontact').objects.get_or_create(
            project=project,
            type=contact_type,
            person_name=person_name_text,
            email=email_text,
            job_title=job_title_text,
            organisation=organisation_text,
            telephone=telephone_text,
            mailing_address=mailing_address_text,
            department=department_text,
            website=website_text,
        )

        if created:
            changes.append(u'added contact (id: %s): %s' % (str(c.pk), c))

        imported_contacts.append(c)

    for contact in project.contacts.all():
        if not contact in imported_contacts:
            changes.append(u'deleted contact (id: %s): %s' %
                           (str(contact.pk),
                            contact.__unicode__()))
            contact.delete()

    return changes
