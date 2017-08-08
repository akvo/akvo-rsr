# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.utils import file_from_zip_archive, model_and_instance_based_filename

from .....rsr.models.internal_organisation_id import InternalOrganisationID
from .....rsr.models.organisation import Organisation
from ... import ImportMapper
from . import same_data


class NotOwnedOrganisationException(Exception):
    pass


class InternalOrganisationIDs(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(InternalOrganisationIDs, self).__init__(
            iati_import_job, parent_elem, project, globals, related_obj)
        self.model = InternalOrganisationID

    def do_import(self):
        pass


class Organisations(ImportMapper):
    """
    Using the ImportMapper here is somewhat of a hack, but it allows us to use all the methods for
    finding data in the XML  of ImportMapper, and logging of problems.
    """

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Organisations, self).__init__(
            iati_import_job, parent_elem, project, globals, related_obj)
        self.model = Organisation
        # HACK: "fix" globals so we get the straight text from elements
        self.globals['version'] = '1'

    def set_logo(self, organisation, identifier):
        """ Get the organisation's logo from the Cordaid zip archive """
        logo = file_from_zip_archive(
            self.iati_import_job.iati_xml_file, "out_rltn/{}.jpg".format(identifier))
        if logo:
            tmp_file = NamedTemporaryFile()
            for line in logo.readlines():
                tmp_file.write(line)
            tmp_file.flush()
            # update the logo if it's different from the existing one
            try:
                old_file = organisation.logo.file
            except (IOError, ValueError):
                old_file = None
            new_file = File(tmp_file)
            if not same_data(old_file, new_file):
                filename = model_and_instance_based_filename(
                    'Organisation', organisation.pk, 'logo', 'image.jpg')
                new_file.seek(0)
                organisation.logo.save(filename, new_file)
                return 'logo'
        return None

    def update_organisation(self, organisation, fields):
        """
        Update the organisation
        :param organisation: the organisation to update
        :param fields: dict with new fields data
        :return: list; the fields that were updated
        """
        changes = []
        for field in fields:
            if getattr(organisation, field) != fields[field]:
                setattr(organisation, field, fields[field])
                changes.append(field)
        if changes:
            organisation.save(update_fields=changes)
        return changes

    def do_import(self):
        """
        We have a chicken'n'egg problem here. We want to do a lookup for the organisation in the
        InternalOrganisationID model, using the org_id from the XML, but if we don't find, the org
        that way we need to create it before we can create the InternalOrganisationID object.
        """

        ioids = InternalOrganisationIDs(
            self.iati_import_job, self.parent_elem, self.project, self.globals)
        identifier = ioids.get_child_element_text(ioids.parent_elem, 'org_id', 'identifier')
        if identifier:
            try:
                ioid = InternalOrganisationID.objects.get(recording_org=self.globals['cordaid'],
                                                          identifier=identifier)
                referenced_org = ioid.referenced_org
            except InternalOrganisationID.DoesNotExist:
                referenced_org = None
        else:
            referenced_org = None
        if referenced_org:
            owner = referenced_org.content_owner
            if owner and owner != self.globals['cordaid']:
                raise NotOwnedOrganisationException(
                    "Organisation {}, ID {}, is content owned by {}, ID {}. "
                    "Can't edit the data.".format(
                        referenced_org.name, referenced_org.pk,
                        owner.name, owner.pk
                    ))

        org_fields = {}
        org_fields['long_name'] = self.get_child_element_text(
            self.parent_elem, 'name', 'long_name').strip()
        org_fields['name'] = org_fields['long_name'][:40]
        org_fields['new_organisation_type'] = int(self.get_child_element_text(
            self.parent_elem, 'iati_organisation_type', 'new_organisation_type', 22))
        org_fields['iati_org_id'] = self.get_child_element_text(
            self.parent_elem, 'iati_org_id', 'iati_org_id')
        org_fields['description'] = self.get_child_element_text(
            self.parent_elem, 'description', 'description')
        # TODO: validate URL
        org_fields['url'] = self.get_child_element_text(self.parent_elem, 'url', 'url')
        org_fields['content_owner'] = self.globals['cordaid']

        if referenced_org:
            organisation = referenced_org
            changes = self.update_organisation(organisation, org_fields)
            created = False
        else:
            organisation = Organisation(**org_fields)
            organisation.save()
            changes, created = None, True
            InternalOrganisationID.objects.create(
                recording_org=self.globals['cordaid'],
                referenced_org=organisation,
                identifier=identifier
            )

        self.set_logo(organisation, identifier)
        return organisation, changes, created
