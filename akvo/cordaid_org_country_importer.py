# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from os.path import splitext

from lxml import etree

from akvo.rsr.models import Country, InternalOrganisationID, Organisation


CORDAID_DIR = "/var/tmp/cordaid"
CORDAID_XML_FILE = os.path.join(CORDAID_DIR, "org_import.xml")
CORDAID_ORG_ID = 273


def import_countries(xml_file):
    with open(xml_file, "rb") as f:
        cordaid = Organisation.objects.get(id=CORDAID_ORG_ID)
        root = etree.fromstring(f.read())
        for element in root:
            identifier = element.findtext("org_id")
            internal_org_id = InternalOrganisationID.objects.get(
                    recording_org=cordaid,
                    identifier=identifier)
            org = internal_org_id.referenced_org
            for location in element.find("location"):
                iso_code = location.findtext("iso_code").capitalize()
                org.iati_country = iso_code.upper()
                org.save()


if __name__ == "__main__":
    import_countries(CORDAID_XML_FILE)
