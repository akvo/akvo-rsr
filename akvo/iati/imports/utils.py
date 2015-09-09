# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import get_model


def get_text(element, version):
    """
    Returns the text of an element. Based on the IATI version, this is the direct text of the
    element (v1) or the the text in the underlying 'narrative' element (v2).

    :param element: ElementTree node
    :param version: String; the full IATI version, e.g. '1.03' or '2.01'
    :return: String; text of the element or None in case there is no text
    """
    if version[0] == '1':
        return element.text or ''
    else:
        narrative_element = element.find('narrative')
        if narrative_element is not None:
            return narrative_element.text or ''
    return ''


def get_or_create_organisation(ref, name):
    """
    Looks for an organisation in the RSR database.
    First the ref will be looked up in the Organisation.iati_org_id field. If this does not exist,
    the name will be looked up in the Organisation.name and Organisation.long_name fields.
    If none of these return a match, a new organisation will be created.

    :param ref: String; the reference of the organisation that is specified in the IATI file.
    :param name: String; the name of the organisation that is specified in the IATI file.
    :return: Organisation instance
    """
    if ref:
        try:
            return get_model('rsr', 'organisation').objects.get(iati_org_id=ref)
        except ObjectDoesNotExist:
            pass

    if name:
        try:
            return get_model('rsr', 'organisation').objects.get(name=name[:25])
        except ObjectDoesNotExist:
            try:
                return get_model('rsr', 'organisation').objects.get(long_name=name[:75])
            except ObjectDoesNotExist:
                pass

    return get_model('rsr', 'organisation').objects.create(
        name=name[:25],
        long_name=name[:75],
        iati_org_id=ref,
        organisation_type='N'
    )
