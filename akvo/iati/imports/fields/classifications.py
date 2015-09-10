# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from decimal import Decimal, InvalidOperation

from django.db.models import get_model

SECTOR_TO_CODE = {
    'ADT': '6',
    'COFOG': '3',
    'DAC': '1',
    'DAC-3': '2',
    'NACE': '4',
    'NTEE': '5',
    'RO': '99',
    'RO2': '98',
    'ISO': '',
    'WB': ''
}

POLICY_MARKER_TO_CODE = {
    'ADT': '',
    'COFOG': '',
    'DAC': '1',
    'DAC-3': '1',
    'NACE': '',
    'NTEE': '',
    'RO': '99',
    'RO2': '',
    'ISO': '',
    'WB': ''
}


def sectors(activity, project, activities_globals):
    """
    Retrieve and store the sectors.
    The conditions will be extracted from the 'sector' elements.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_sectors = []
    changes = []

    for sector in activity.findall('sector'):
        code = ''
        percentage = None
        vocabulary = ''
        text = get_text(sector, activities_globals['version'])[:100]

        if 'code' in sector.attrib.keys() and len(sector.attrib['code']) < 6:
            code = sector.attrib['code']

        try:
            if 'percentage' in sector.attrib.keys():
                percentage = Decimal(sector.attrib['percentage'])
        except InvalidOperation:
            pass

        if 'vocabulary' in sector.attrib.keys():
            vocabulary = sector.attrib['vocabulary']
            if vocabulary in SECTOR_TO_CODE.keys():
                vocabulary = SECTOR_TO_CODE[vocabulary]

        sec, created = get_model('rsr', 'sector').objects.get_or_create(
            project=project,
            sector_code=code,
            percentage=percentage,
            text=text,
            vocabulary=vocabulary
        )

        if created:
            changes.append(u'added sector (id: %s): %s' % (str(sec.pk), sec))

        imported_sectors.append(sec)

    for sector in project.sectors.all():
        if not sector in imported_sectors:
            changes.append(u'deleted sector (id: %s): %s' %
                           (str(sector.pk),
                            sector.__unicode__()))
            sector.delete()

    return changes


def policy_markers(activity, project, activities_globals):
    """
    Retrieve and store the policy markers.
    The conditions will be extracted from the 'policy-marker' elements.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_markers = []
    changes = []

    for marker in activity.findall('policy-marker'):
        code = ''
        significance = ''
        vocabulary = ''
        text = get_text(marker, activities_globals['version'])[:255]

        if 'code' in marker.attrib.keys() and len(marker.attrib['code']) < 3:
            code = marker.attrib['code']

        if 'significance' in marker.attrib.keys() and len(marker.attrib['significance']) < 3:
            significance = marker.attrib['significance']

        if 'vocabulary' in marker.attrib.keys() and len(marker.attrib['vocabulary']) < 6:
            vocabulary = marker.attrib['vocabulary']
            if vocabulary in POLICY_MARKER_TO_CODE.keys():
                vocabulary = POLICY_MARKER_TO_CODE[vocabulary]

        pm, created = get_model('rsr', 'policymarker').objects.get_or_create(
            project=project,
            policy_marker=code,
            significance=significance,
            description=text,
            vocabulary=vocabulary
        )

        if created:
            changes.append(u'added policy marker (id: %s): %s' % (str(pm.pk), pm))

        imported_markers.append(pm)

    for marker in project.policy_markers.all():
        if not marker in imported_markers:
            changes.append(u'deleted policy marker (id: %s): %s' %
                           (str(marker.pk),
                            marker.__unicode__()))
            marker.delete()

    return changes
