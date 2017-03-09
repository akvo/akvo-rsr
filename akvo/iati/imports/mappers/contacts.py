# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.project_contact import ProjectContact

from .. import ImportMapper


class Contacts(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Contacts, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = ProjectContact

    def do_import(self):
        """
        Retrieve and store the contact information.
        The contact information will be extracted from the 'contact-info' elements.

        :return: List; contains fields that have changed
        """
        imported_contacts = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('contact-info'):
            return changes

        for contact in self.parent_elem.findall('contact-info'):

            contact_type = self.get_attrib(contact, 'type', 'type')
            organisation = self.get_child_element_text(contact, 'organisation', 'organisation')
            department = self.get_child_element_text(contact, 'department', 'department')
            person_name = self.get_child_element_text(contact, 'person-name', 'person_name')
            job_title = self.get_child_element_text(contact, 'job-title', 'job_title')
            telephone = self.get_child_element_text(contact, 'telephone', 'telephone')
            email = contact.findtext('email', default='').strip()
            website = contact.findtext('website', default='').strip()
            mailing_address = self.get_child_element_text(
                contact, 'mailing-address', 'mailing_address')

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
        return changes
