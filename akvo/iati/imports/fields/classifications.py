# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import add_log, get_text

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


def sectors(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the sectors.
    The conditions will be extracted from the 'sector' elements.

    :param activity: IatiImport instance
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
        vocabulary = '1'

        text = get_text(sector, activities_globals['version'])
        if len(text) > 100:
            add_log(iati_import, 'sector', 'description is too long (100 characters allowed)',
                    project, 3)
            text = text[:100]

        if 'code' in sector.attrib.keys():
            if not len(sector.attrib['code']) > 5:
                code = sector.attrib['code']
            else:
                add_log(iati_import, 'sector', 'code is too long (5 characters allowed)', project)

        try:
            if 'percentage' in sector.attrib.keys():
                percentage = Decimal(sector.attrib['percentage'])
            elif len(activity.findall('sector')) == 1:
                percentage = Decimal(100.0)
        except InvalidOperation as e:
            add_log(iati_import, 'sector', str(e), project)

        if 'vocabulary' in sector.attrib.keys():
            if not len(sector.attrib['vocabulary']) > 5:
                vocabulary = sector.attrib['vocabulary']
                if vocabulary in SECTOR_TO_CODE.keys():
                    vocabulary = SECTOR_TO_CODE[vocabulary]
            else:
                add_log(iati_import, 'sector', 'vocabulary is too long (5 characters allowed)',
                        project)

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


def policy_markers(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the policy markers.
    The conditions will be extracted from the 'policy-marker' elements.

    :param iati_import: IatiImport instance
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

        text = get_text(marker, activities_globals['version'])
        if len(text) > 255:
            add_log(iati_import, 'policy_marker',
                    'description is too long (255 characters allowed)', project, 3)
            text = text[:255]

        if 'code' in marker.attrib.keys():
            if not len(marker.attrib['code']) > 2:
                code = marker.attrib['code']
            else:
                add_log(iati_import, 'policy_marker', 'code is too long (2 characters allowed)',
                        project)

        if 'significance' in marker.attrib.keys():
            if not len(marker.attrib['significance']) > 2:
                significance = marker.attrib['significance']
            else:
                add_log(iati_import, 'policy_marker',
                        'significance is too long (2 characters allowed)', project)

        if 'vocabulary' in marker.attrib.keys():
            if not len(marker.attrib['vocabulary']) > 5:
                vocabulary = marker.attrib['vocabulary']
                if vocabulary in POLICY_MARKER_TO_CODE.keys():
                    vocabulary = POLICY_MARKER_TO_CODE[vocabulary]
            else:
                add_log(iati_import, 'policy_marker',
                        'vocabulary is too long (5 characters allowed)', project)

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
