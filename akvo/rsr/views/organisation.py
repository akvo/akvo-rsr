# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.iati.exports.iati_org_export import IatiOrgXML
from akvo.rsr.models import Organisation

from django.http import Http404, HttpResponse, StreamingHttpResponse
from django.shortcuts import get_object_or_404, render


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
    exports = organisation.iati_exports.filter(latest=True).exclude(iati_file='')
    if exports.exists():
        latest_export = exports.order_by('-id')[0]
        return HttpResponse(latest_export.iati_file, content_type="text/xml")
    raise Http404


def iati_org(request, organisation_id):
    """Generate IATI Organisation file with streaming response and memory optimization."""
    organisation = get_object_or_404(Organisation, pk=organisation_id)
    context = {'base_url': f'{request.scheme}://{request.get_host()}'}

    def generate_xml():
        """Generator function for streaming XML content."""
        xml_generator = IatiOrgXML([organisation], context=context)
        for chunk in xml_generator.stream_xml():
            yield chunk.encode('utf-8')

    return StreamingHttpResponse(
        generate_xml(),
        content_type="text/xml; charset=utf-8"
    )
