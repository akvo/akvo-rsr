# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.iati.exports.iati_org_export import IatiOrgXML
from akvo.rsr.models import Organisation

from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404, render

from lxml import etree


###############################################################################
# Organisation directory
###############################################################################

def directory(request):
    """The Organisation list view."""
    return render(request, 'organisation_directory.html', {})


###############################################################################
# Organisation main
###############################################################################

def main(request, organisation_id):
    """The organisation main view."""
    return render(request, 'organisation_main.html', {
        'organisation': get_object_or_404(Organisation, pk=organisation_id)})


###############################################################################
# Organisation IATI files
###############################################################################

def iati(request, organisation_id):
    """Retrieve the latest public IATI XML file."""
    organisation = get_object_or_404(Organisation, pk=organisation_id)
    exports = organisation.iati_exports.filter(is_public=True).exclude(iati_file='')
    if exports:
        latest_export = exports.order_by('-id')[0]
        return HttpResponse(latest_export.iati_file, content_type="text/xml")
    raise Http404


def iati_org(request, organisation_id):
    """Generate the IATI Organisation file on-the-fly and return the XML."""
    organisation = get_object_or_404(Organisation, pk=organisation_id)
    xml_data = etree.tostring(etree.ElementTree(
        IatiOrgXML(request, [organisation]).iati_organisations))
    return HttpResponse(xml_data, content_type="text/xml")
