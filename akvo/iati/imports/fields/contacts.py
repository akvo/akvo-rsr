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
        contact_type = contact.attrib['type'] if 'type' in contact.attrib.keys() else ''

        organisation_element = contact.find('organisation')
        if not organisation_element is None:
            organisation_text = get_text(organisation_element, activities_globals['version'])
        else:
            organisation_text = ''

        department_element = contact.find('department')
        if not department_element is None:
            department_text = get_text(department_element, activities_globals['version'])
        else:
            department_text = ''

        person_name_element = contact.find('person-name')
        if not person_name_element is None:
            person_name_text = get_text(person_name_element, activities_globals['version'])
        else:
            person_name_text = ''

        job_title_element = contact.find('job-title')
        if not job_title_element is None:
            job_title_text = get_text(job_title_element, activities_globals['version'])
        else:
            job_title_text = ''

        telephone_element = contact.find('telephone')
        if not telephone_element is None:
            telephone_text = telephone_element.text
        else:
            telephone_text = ''

        email_element = contact.find('email')
        if not email_element is None:
            email_text = email_element.text
        else:
            email_text = ''

        website_element = contact.find('website')
        if not website_element is None:
            website_text = website_element.text
        else:
            website_text = ''

        mailing_address_element = contact.find('mailing-address')
        if not mailing_address_element is None:
            mailing_address_text = get_text(mailing_address_element, activities_globals['version'])
        else:
            mailing_address_text = ''

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
        imported_contacts.append(c)
        if created:
            changes.append(u'added contact (id: %s): %s' % (str(c.pk), c))

    for contact in project.contacts.all():
        if not contact in imported_contacts:
            changes.append(u'deleted contact (id: %s): %s' %
                           (str(contact.pk),
                            contact.__unicode__()))
            contact.delete()

    return changes
