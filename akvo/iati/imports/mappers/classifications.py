# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.policy_marker import PolicyMarker
from ....rsr.models.sector import Sector

from .. import ImportMapper

from decimal import Decimal

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


class Sectors(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Sectors, self).__init__(iati_import_job, parent_elem,
                                      project, globals)
        self.model = Sector

    def do_import(self):
        """
        Retrieve and store the sectors.
        The conditions will be extracted from the 'sector' elements.

        :return: List; contains fields that have changed
        """
        imported_sectors = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('sector'):
            return changes

        for sector in self.parent_elem.findall('sector'):

            text = self.get_element_text(sector, 'text')
            sector_code = self.get_attrib(sector, 'code', 'sector_code')

            percentage = self.get_attrib(sector, 'percentage', 'percentage', None)
            if percentage:
                percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')
            if not percentage and len(self.parent_elem.findall('sector')) == 1:
                percentage = Decimal(100.0)

            vocabulary = self.get_attrib(sector, 'vocabulary', 'vocabulary')
            if vocabulary in SECTOR_TO_CODE:
                vocabulary = SECTOR_TO_CODE[vocabulary]

            vocabulary_uri = self.get_attrib(sector, 'vocabulary-uri', 'vocabulary_uri')

            sector_obj, created = Sector.objects.get_or_create(
                project=self.project,
                sector_code=sector_code,
                percentage=percentage,
                text=text,
                vocabulary=vocabulary,
                vocabulary_uri=vocabulary_uri
            )
            if created:
                changes.append('added sector (id: {}): {}'.format(sector_obj.pk, sector_obj))
            imported_sectors.append(sector_obj)

        changes += self.delete_objects(self.project.sectors, imported_sectors, 'sector')
        return changes


class PolicyMarkers(ImportMapper):

    def __init__(self, iati_import_job, parent_elem,
                 project, globals, related_obj=None):
        super(PolicyMarkers, self).__init__(iati_import_job, parent_elem,
                                            project, globals)
        self.model = PolicyMarker

    def do_import(self):
        """
        Retrieve and store the policy markers.
        The conditions will be extracted from the 'policy-marker' elements.

        :return: List; contains fields that have changed
        """
        # Check if import should ignore this kind of data
        if self.skip_importing('policy-marker'):
            return []

        imported_markers = []
        changes = []

        for marker in self.parent_elem.findall('policy-marker'):
            description = self.get_element_text(marker, 'description')
            policy_marker = self.get_attrib(marker, 'code', 'policy_marker')
            significance = self.get_attrib(marker, 'significance', 'significance')

            vocabulary = self.get_attrib(marker, 'vocabulary', 'vocabulary')
            if vocabulary in POLICY_MARKER_TO_CODE:
                vocabulary = POLICY_MARKER_TO_CODE[vocabulary]

            vocabulary_uri = self.get_attrib(marker, 'vocabulary-uri', 'vocabulary_uri')

            policy_marker, created = PolicyMarker.objects.get_or_create(
                project=self.project,
                policy_marker=policy_marker,
                significance=significance,
                description=description,
                vocabulary=vocabulary,
                vocabulary_uri=vocabulary_uri
            )
            if created:
                changes.append(
                    'added policy marker (id: {}): {}'.format(policy_marker.pk, policy_marker))
            imported_markers.append(policy_marker)

        changes += self.delete_objects(
            self.project.policy_markers, imported_markers, 'policy marker')
        return changes
