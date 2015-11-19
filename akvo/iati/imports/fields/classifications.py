# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.policy_marker import PolicyMarker
from ....rsr.models.sector import Sector

from ..utils import add_log, ImportHelper

from decimal import Decimal, InvalidOperation

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


class Sectors(ImportHelper):

    def __init__(self, iati_import, parent_element, project, globals, related_obj=None):
        super(Sectors, self).__init__(iati_import, parent_element, project, globals)
        self.model = Sector

    def do_import(self):
        """
        Retrieve and store the sectors.
        The conditions will be extracted from the 'sector' elements.

        :return: List; contains fields that have changed
        """
        imported_sectors = []
        changes = []

        for sector in self.parent_elem.findall('sector'):
            # code = ''
            vocabulary = '1'

            text = self.get_element_text(sector, 'text')
            # text = get_text(sector, activities_globals['version'])
            # text = check_text_length(text, iati_import, project, 'sector', 'description', 100)
            # if len(text) > 100:
            #     add_log(iati_import, 'sector', 'description is too long (100 characters allowed)',
            #             project, IatiImportLog.VALUE_PARTLY_SAVED)
            #     text = text[:100]

            sector_code = self.get_attrib(sector, 'code', 'sector_code')
            # if 'code' in sector.attrib.keys():
            #     if len(sector.attrib['code']) < 6:
            #         code = sector.attrib['code']
            #     else:
            #         add_log(iati_import, 'sector', 'code is too long (5 characters allowed)', project)
            percentage = self.get_attrib(sector, 'percentage', 'percentage')
            percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')
            if not percentage and len(self.parent_elem.findall('sector')) == 1:
                percentage = Decimal(100.0)

            # if percentage:
            #     try:
            #         percentage = Decimal(percentage)
            #     except InvalidOperation as e:
            #         percentage = None
            #         self.add_log('sector', 'percentage', str(e))
            # elif len(self.parent_elem.findall('sector')) == 1:
            #     percentage = Decimal(100)

            # try:
            #     if 'percentage' in sector.attrib.keys():
            #         percentage = Decimal(sector.attrib['percentage'])
            #     elif len(self.activity.findall('sector')) == 1:
            #         percentage = Decimal(100.0)
            # except InvalidOperation as e:
            #     percentage = None
            #     self.add_log('sector', 'percentage', str(e))

            vocabulary = self.get_attrib(sector, 'vocabulary', 'vocabulary')
            if vocabulary in SECTOR_TO_CODE.keys():
                vocabulary = SECTOR_TO_CODE[vocabulary]
            # if 'vocabulary' in sector.attrib.keys():
            #     if not len(sector.attrib['vocabulary']) > 5:
            #         vocabulary = sector.attrib['vocabulary']
            #         if vocabulary in SECTOR_TO_CODE.keys():
            #             vocabulary = SECTOR_TO_CODE[vocabulary]
            #     else:
            #         add_log(iati_import, 'sector', 'vocabulary is too long (5 characters allowed)',
            #                 project)

            sector_obj, created = Sector.objects.get_or_create(
                project=self.project,
                sector_code=sector_code,
                percentage=percentage,
                text=text,
                vocabulary=vocabulary
            )

            if created:
                changes.append(u'added sector (id: {}): {}'.format(sector_obj.pk, sector_obj))

            imported_sectors.append(sector_obj)

        changes += self.delete_objects(self.project.sectors, imported_sectors, 'sector')
        # for sector in self.project.sectors.all():
        #     if not sector in imported_sectors:
        #         changes.append(u'deleted sector (id: {}): {}'.format(
        #                 sector.pk, sector.__unicode__()))
        #         sector.delete()

        return changes


class PolicyMarkers(ImportHelper):

    def __init__(self, iati_import, parent_element, project, globals, related_obj=None):
        super(PolicyMarkers, self).__init__(iati_import, parent_element, project, globals)
        self.model = PolicyMarker

    def do_import(self):
        """
        Retrieve and store the policy markers.
        The conditions will be extracted from the 'policy-marker' elements.

        :return: List; contains fields that have changed
        """
        imported_markers = []
        changes = []

        for marker in self.parent_elem.findall('policy-marker'):
            # code = ''
            significance = ''
            vocabulary = ''
            description = self.get_element_text(marker, 'description')
            # text = get_text(marker, activities_globals['version'])
            # if len(text) > 255:
            #     add_log(iati_import, 'policy_marker',
            #             'description is too long (255 characters allowed)', project,
            #             IatiImportLog.VALUE_PARTLY_SAVED)
            #     text = text[:255]

            policy_marker = self.get_attrib(marker, 'code', 'policy_marker')
            # if 'code' in marker.attrib.keys():
            #     if not len(marker.attrib['code']) > 2:
            #         code = marker.attrib['code']
            #     else:
            #         add_log(iati_import, 'policy_marker', 'code is too long (2 characters allowed)',
            #                 project)

            significance = self.get_attrib(marker, 'significance', 'significance')
            # if 'significance' in marker.attrib.keys():
            #     if not len(marker.attrib['significance']) > 2:
            #         significance = marker.attrib['significance']
            #     else:
            #         add_log(iati_import, 'policy_marker',
            #                 'significance is too long (2 characters allowed)', project)

            vocabulary = self.get_attrib(marker, 'vocabulary', 'vocabulary')
            if vocabulary in POLICY_MARKER_TO_CODE.keys():
                vocabulary = POLICY_MARKER_TO_CODE[vocabulary]
            # if 'vocabulary' in marker.attrib.keys():
            #     if not len(marker.attrib['vocabulary']) > 5:
            #         vocabulary = marker.attrib['vocabulary']
            #         if vocabulary in POLICY_MARKER_TO_CODE.keys():
            #             vocabulary = POLICY_MARKER_TO_CODE[vocabulary]
            #     else:
            #         add_log(iati_import, 'policy_marker',
            #                 'vocabulary is too long (5 characters allowed)', project)

            policy_marker, created = PolicyMarker.objects.get_or_create(
                project=self.project,
                policy_marker=policy_marker,
                significance=significance,
                description=description,
                vocabulary=vocabulary
            )

            if created:
                changes.append(
                        u'added policy marker (id: {}): {}'.format(policy_marker.pk, policy_marker))

            imported_markers.append(policy_marker)

        changes += self.delete_objects(self.project.policy_markers, imported_markers, 'policy marker')
        # for marker in self.project.policy_markers.all():
        #     if not marker in imported_markers:
        #         changes.append(u'deleted policy marker (id: {}): {}'.format(
        #                 str(marker.pk), marker.__unicode__()))
        #         marker.delete()

        return changes
