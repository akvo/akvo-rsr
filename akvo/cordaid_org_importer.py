# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from os.path import splitext
import sys

from lxml import etree

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.rsr.iati.iati_code_lists import IATI_LIST_ORGANISATION_TYPE
from akvo.rsr.models import InternalOrganisationID, Organisation, PartnerType
from akvo.utils import model_and_instance_based_filename


CORDAID_DIR = "/var/tmp/cordaid"
CORDAID_XML_FILE = os.path.join(CORDAID_DIR, "org_import.xml")
CORDAID_LOGOS_DIR = os.path.join(CORDAID_DIR, "org_logos")
CORDAID_ORG_ID = 273


LOG_FILE = os.path.join(CORDAID_DIR, "org_import_log.txt")


def log_and_alert(text, log_file=LOG_FILE):
    text = u"{text}\n".format(text=text)
    with open(log_file, "a") as log_file:
        log_file.write(text)
    sys.stdout.write(text)


def run_import_report(import_type, data):
    log_and_alert("")
    log_and_alert("{import_type} import report".format(
        import_type=import_type.capitalize()
    ))
    log_and_alert("*****")
    for status, count in data.items():
        log_and_alert("Status {status}: {count}".format(
            status=status.upper(), count=count
        ))
    total = sum(data.values())
    log_and_alert("TOTAL: {total}".format(total=total))
    log_and_alert("")


def get_organisation_type(new_organisation_type):
    types = dict(zip([type for type, name in IATI_LIST_ORGANISATION_TYPE],
                     Organisation.NEW_TO_OLD_TYPES
    ))
    return types[new_organisation_type]


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
        report_data = dict(created=0, failed=0, updated=0)
        root = etree.fromstring(f.read())
        for element in root:
            recording_org = Organisation.objects.get(id=CORDAID_ORG_ID)
            identifier = element.findtext("org_id")
            try:  # Find existing InternalOrganisationID & Organisation ...
                action = "updated"
                internal_org_id = InternalOrganisationID.objects.get(
                    recording_org=recording_org,
                    identifier=identifier
                )
                referenced_org = internal_org_id.referenced_org
            except:  # ... or attempt to create new ones
                try:
                    action = "created"
                    referenced_org = Organisation()
                    referenced_org.save()
                    internal_org_id = InternalOrganisationID(
                        recording_org=recording_org,
                        referenced_org=referenced_org,
                        identifier=identifier
                    )
                    internal_org_id.save()
                    for partner_type in PartnerType.objects.all():
                        referenced_org.partner_types.add(partner_type)
                except Exception, e:
                    action = "failed"
                    internal_org_id.delete()
                    referenced_org.delete()
                    print(u"*** UNABLE TO CREATE NEW ORGANISATION! "
                           "Reason: {message}.".format(e.message))
            name = element.findtext("name")
            referenced_org.name, referenced_org.long_name = name[:25], name
            referenced_org.description = element.findtext("description") or "N/A"
            referenced_org.url = normalize_url(element.findtext("url"))
            referenced_org.new_organisation_type = int(element.findtext("iati_organisation_type"))
            referenced_org.organisation_type = get_organisation_type(referenced_org.new_organisation_type)
            report_data[action] += 1
            referenced_org.save()
            log_and_alert(u"{action} organisation {org_id} "
                         "(Cordaid ID: {cordaid_org_id})".format(
                action=action.upper(),
                cordaid_org_id=internal_org_id.identifier,
                org_id=referenced_org.id
            ))
        run_import_report("organisation", report_data)


def import_images(logo_dir):
    report_data = dict(failed=0, succeeded=0)
    for logo_name in os.listdir(logo_dir):
        error_message = ""
        identifier, extension = splitext(logo_name)
        if extension.lower() in (".png", ".jpg", ".jpeg", ".gif"):
            try:
                internal_org_id = InternalOrganisationID.objects.get(
                    recording_org=Organisation.objects.get(id=CORDAID_ORG_ID),
                    identifier=identifier)
                org = internal_org_id.referenced_org
                filename = model_and_instance_based_filename(
                    "Organisation", org.pk, "logo", logo_name
                )
                with open(os.path.join(logo_dir, logo_name), "rb") as f:
                    logo_data = f.read()
                    logo_tmp = NamedTemporaryFile(delete=True)
                    logo_tmp.write(logo_data)
                    logo_tmp.flush()
                    org.logo.save(filename, File(logo_tmp), save=True)
                    action = "succeeded"
            except Exception, e: 
                action = "failed"
                error_message = "with the following error message: {error_message}".format(
                    error_message=e.message
                )
        report_data[action] += 1
        log_and_alert(u"Upload of image to organisation {org_id} {action} {error_message}".format(
            org_id=org.id, action=action, error_message=error_message
        ))
    run_import_report("logo", report_data)


if __name__ == "__main__":
    log_and_alert("Importing organisations...")
    import_orgs(CORDAID_XML_FILE)
    log_and_alert("Uploading images to imported organisations...")
    import_images(CORDAID_LOGOS_DIR)
