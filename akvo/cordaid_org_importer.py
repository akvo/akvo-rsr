# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management import setup_environ
import settings

setup_environ(settings)

import os
from os.path import splitext

from lxml import etree

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.rsr.iati_code_lists import IATI_LIST_ORGANISATION_TYPE
from akvo.rsr.models import InternalOrganisationID, Organisation, PartnerType
from akvo.rsr.utils import model_and_instance_based_filename


CORDAID_DIR = "/Users/gabriel/git/akvo-rsr/akvo/api/xml/cordaid"
CORDAID_XML_FILE = os.path.join(CORDAID_DIR, "cordaid_orgs_from_live.xml")
CORDAID_LOGOS_DIR = os.path.join(CORDAID_DIR, "org_logos")
CORDAID_ORG_ID = 273


def get_organisation_type(new_organisation_type):
    return dict(zip([type for type, name in IATI_LIST_ORGANISATION_TYPE],
        Organisation.NEW_TO_OLD_TYPES))[new_organisation_type]


def normalize_url(url):
    if url is None:
        return ""
    url = url.strip().lower()
    if url and not url.startswith("http"):
        if url.startswith("www"):
            url = "http://%s" % url
        else:
            url = ""
    return url


def import_orgs(xml_file):
    with open(xml_file, "rb") as f:
        root = etree.fromstring(f.read())
        for element in root:
            recording_org = Organisation.objects.get(id=CORDAID_ORG_ID)
            identifier = element.findtext("org_id")
            try:  # Find the existing RSR InternalOrganisationID and Organisation
                internal_org_id = InternalOrganisationID.objects.get(
                        recording_org=recording_org,
                        identifier=identifier)
                referenced_org = internal_org_id.referenced_org
                action = "Updated"
            except:
                referenced_org = Organisation()
                referenced_org.save()
                internal_org_id = InternalOrganisationID(
                        recording_org=recording_org,
                        referenced_org=referenced_org,
                        identifier=identifier)
                internal_org_id.save()
                for partner_type in PartnerType.objects.all():
                    referenced_org.partner_types.add(partner_type)
                action = "*** Created"
            name = element.findtext("name")
            referenced_org.name, referenced_org.long_name = name[:25], name
            referenced_org.description = element.findtext("description") or "N/A"
            referenced_org.url = normalize_url(element.findtext("url"))
            referenced_org.new_organisation_type = int(element.findtext("iati_organisation_type"))
            referenced_org.organisation_type = get_organisation_type(referenced_org.new_organisation_type)
            print(u"{action} Organisation {org_id}. Name, {name}, InternalOrganisationID: {internal_org_id}, ".format(
                    action=action, org_id=referenced_org.id, name=referenced_org.name, internal_org_id=internal_org_id.pk))
            referenced_org.save()


def import_images(logo_dir):
    for logo_name in os.listdir(logo_dir):
        identifier, extension = splitext(logo_name)
        if extension.lower() in (".png", ".jpg", ".jpeg", ".gif"):
            try:
                internal_org_id = InternalOrganisationID.objects.get(
                        recording_org=Organisation.objects.get(id=CORDAID_ORG_ID),
                        identifier=identifier)
                org = internal_org_id.referenced_org
                filename = model_and_instance_based_filename(
                        "Organisation", org.pk, "logo", logo_name)
                with open(os.path.join(logo_dir, logo_name), "rb") as f:
                    logo_data = f.read()
                    logo_tmp = NamedTemporaryFile(delete=True)
                    logo_tmp.write(logo_data)
                    logo_tmp.flush()
                    org.logo.save(filename, File(logo_tmp), save=True)
                    print("Uploaded logo to Organisation {org_name}.".format(
                            org_name=org.long_name))
            except: 
                print("Logo upload failed. No matching organisations found.")


if __name__ == "__main__":
    import_orgs(CORDAID_XML_FILE)
    import_images(CORDAID_LOGOS_DIR)
