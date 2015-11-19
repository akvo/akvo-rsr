# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.project_contact import ProjectContact

from ..utils import add_log, get_text, ImportHelper


class Contacts(ImportHelper):

    def __init__(self, iati_import, parent_element, project, globals, related_obj=None):
        super(Contacts, self).__init__(iati_import, parent_element, project, globals)
        self.model = ProjectContact

    def do_import(self):
        """
        Retrieve and store the contact information.
        The contact information will be extracted from the 'contact-info' elements.

        :return: List; contains fields that have changed
        """
        imported_contacts = []
        changes = []

        for contact in self.parent_elem.findall('contact-info'):
            # contact_type = ''
            # organisation_text = ''
            # department_text = ''
            # person_name_text = ''
            # job_title_text = ''
            # telephone_text = ''
            # email_text = ''
            # website_text = ''
            # mailing_address_text = ''

            contact_type = self.get_attrib(contact, 'type', 'type')
            # if 'type' in contact.attrib.keys():
            #     if not len(contact.attrib['type']) > 1:
            #         contact_type = contact.attrib['type']
            #     else:
            #         add_log(self.iati_import, 'contact', 'type is too long (1 character allowed)', self.project)


            organisation = self.get_child_element_text(contact, 'organisation', 'organisation')
            # organisation_element = contact.find('organisation')
            # if not organisation_element is None:
            #     organisation_text = get_text(organisation_element, activities_globals['version'])
            #     if len(organisation_text) > 100:
            #         add_log(iati_import, 'contact', 'organisation is too long (100 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         organisation_text = organisation_text[:100]

            department = self.get_child_element_text(contact, 'department', 'department')
            # department_element = contact.find('department')
            # if not department_element is None:
            #     department_text = get_text(department_element, activities_globals['version'])
            #     if len(department_text) > 100:
            #         add_log(iati_import, 'contact', 'department is too long (100 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         department_text = department_text[:100]

            person_name = self.get_child_element_text(contact, 'person-name', 'person_name')
            # person_name_element = contact.find('person-name')
            # if not person_name_element is None:
            #     person_name_text = get_text(person_name_element, activities_globals['version'])
            #     if len(person_name_text) > 100:
            #         add_log(iati_import, 'contact', 'person name is too long (100 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         person_name_text = person_name_text[:100]

            job_title = self.get_child_element_text(contact, 'job-title', 'job_title')
            # job_title_element = contact.find('job-title')
            # if not job_title_element is None:
            #     job_title_text = get_text(job_title_element, activities_globals['version'])
            #     if len(job_title_text) > 100:
            #         add_log(iati_import, 'contact', 'job title is too long (100 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         job_title_text = job_title_text[:100]

            telephone = self.get_child_element_text(contact, 'telephone', 'telephone')
            # telephone_element = contact.find('telephone')
            # if not telephone_element is None and not telephone_element.text is None:
            #     telephone_text = telephone_element.text
            #     if len(telephone_text) > 30:
            #         add_log(iati_import, 'contact', 'telephone is too long (30 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         telephone_text = telephone_text[:30]

            email = contact.findtext('email', default='').strip()
            # if not email_element is None and not email_element.text is None:
            #     email_text = email_element.text

            website = contact.findtext('website', default='').strip()
            # if not website_element is None and not website_element.text is None:
            #     website_text = website_element.text

            mailing_address = self.get_child_element_text(
                    contact, 'mailing-address', 'mailing_address')
            # mail_addr_element = contact.find('mailing-address')
            # if not mail_addr_element is None:
            #     mailing_address_text = get_text(mail_addr_element, activities_globals['version'])
            #     if len(mailing_address_text) > 255:
            #         add_log(iati_import, 'contact',
            #                 'mailing address is too long (30 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         mailing_address_text = mailing_address_text[:255]

            project_contact, created = ProjectContact.objects.get_or_create(
                project=self.project,
                type=contact_type,
                person_name=person_name,
                email=email,
                job_title=job_title,
                organisation=organisation,
                telephone=telephone,
                mailing_address=mailing_address,
                department=department,
                website=website,
            )

            if created:
                changes.append(
                        u'added contact (id: {}): {}'.format(project_contact.pk, project_contact))

            imported_contacts.append(project_contact)

        changes += self.delete_objects(self.project.contacts, imported_contacts, 'contact')
        # for contact in self.project.contacts.all():
        #     if not contact in imported_contacts:
        #         changes.append(u'deleted contact (id: %s): %s' %
        #                        (str(contact.pk),
        #                         contact.__unicode__()))
        #         contact.delete()

        return changes
