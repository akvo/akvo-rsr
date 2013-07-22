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
from akvo.rsr.models import InternalOrganisationID, Organisation
from akvo.rsr.utils import model_and_instance_based_filename


CORDAID_DIR = "/var/tmp/cordaid"
CORDAID_XML_FILE = os.path.join(CORDAID_DIR, "org_import.xml")
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
    internal_org_ids = []
    with open(xml_file, "rb") as f:
        tree = etree.parse(f)
        for element in tree.getroot():
            recording_org = Organisation.objects.get(id=CORDAID_ORG_ID)
            identifier = element.findtext("org_id")
            try:  # Find the existing RSR InternalOrganisationID and Organisation
                internal_org_ids = InternalOrganisationID.objects.filter(
                        recording_org=recording_org,
                        identifier=identifier)
            except:
                pass
            if len(internal_org_ids) >= 1:
                internal_org_id = internal_org_ids[0]
                referenced_org = internal_org_id.referenced_org
                action = "updated"
            else:
                referenced_org = Organisation()
                referenced_org.save()
                internal_org_id = InternalOrganisationID(
                        recording_org=recording_org,
                        referenced_org=referenced_org,
                        identifier=identifier)
                internal_org_id.save()
                action = "created"
            referenced_org.name = element.findtext("name")[:25] 
            referenced_org.long_name = element.findtext("name")
            referenced_org.description = element.findtext("description") or "N/A"
            referenced_org.url = normalize_url(element.findtext("url"))
            referenced_org.new_organisation_type = int(element.findtext("iati_organisation_type"))
            referenced_org.organisation_type = get_organisation_type(referenced_org.new_organisation_type)
            print "%s Organisation & InternalOrganisationID for %s" % (action, referenced_org.long_name)
            referenced_org.save()


def import_images(logo_dir):
    internal_org_ids = []
    for logo_name in os.listdir(logo_dir):
        identifier, extension = splitext(logo_name)
        if extension.lower() in (".png", ".jpg", ".jpeg", ".gif"):
            try:
                internal_org_ids = InternalOrganisationID.objects.filter(
                        recording_org=Organisation.objects.get(id=CORDAID_ORG_ID),
                        identifier=identifier)
            except:
                pass
            if len(internal_org_ids) >= 1:
                internal_org_id = internal_org_ids[0]
                org = internal_org_id.referenced_org
                filename = model_and_instance_based_filename("Organisation",
                        org.pk, "logo", logo_name)
                with open(os.path.join(logo_dir, logo_name), "rb") as f:
                    logo_data = f.read()
                    logo_tmp = NamedTemporaryFile(delete=True)
                    logo_tmp.write(logo_data)
                    logo_tmp.flush()
                    org.logo.save(filename, File(logo_tmp), save=True)
                    print "Uploaded logo to Organisation %s" % org.long_name
            else:
                print "Logo upload failed. No matching organisations found."


if __name__ == "__main__":
    import_orgs(CORDAID_XML_FILE)
    import_images(CORDAID_LOGOS_DIR)
