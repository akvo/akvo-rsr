# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.country import Country, RecipientCountry
from ....rsr.models.iati_import_log import LOG_ENTRY_TYPE
from ....rsr.models.location import AdministrativeLocation, ProjectLocation
from ....rsr.models.region import RecipientRegion

from .. import ImportMapper

from django.core.exceptions import ObjectDoesNotExist


class Locations(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Locations, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = ProjectLocation

    def do_import(self):
        """
        Retrieve and store the locations.
        The conditions will be extracted from the 'location' elements.

        :return: List; contains fields that have changed
        """
        imported_locations = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('location'):
            return changes

        for location in self.parent_elem.findall('location'):

            reference = self.get_attrib(location, 'ref', 'reference')
            location_reach = self.get_child_elem_attrib(
                location, 'location-reach', 'code', 'location_reach')

            id_element = location.find('location-id')
            if id_element is not None:
                location_code = self.get_attrib(id_element, 'code', 'location_code')
                vocabulary = self.get_attrib(id_element, 'vocabulary', 'vocabulary')
            else:
                location_code = ''
                vocabulary = ''

            name = self.get_child_element_text(location, 'name', 'name')
            description = self.get_child_element_text(location, 'description', 'description')
            activity_description = self.get_child_element_text(
                location, 'activity-description', 'activity_description')

            point = location.find('point')
            if point is not None:
                lat_long = self.get_child_element_text(point, 'pos', None, '0 0')
                latitude = float(lat_long.split(' ')[0])
                longitude = float(lat_long.split(' ')[1])
            else:
                coordinates = location.find('coordinates')
                if coordinates is not None:
                    latitude = self.get_child_elem_attrib(
                        location, 'coordinates', 'latitude', 'latitude', 0)
                    longitude = self.get_child_elem_attrib(
                        location, 'coordinates', 'longitude', 'longitude', 0)
                else:
                    latitude = None
                    longitude = None

            exactness = self.get_child_elem_attrib(location, 'exactness', 'code', 'exactness')
            location_class = self.get_child_elem_attrib(
                location, 'location-class', 'code', 'location_class')

            feature_designation = self.get_child_elem_attrib(
                location, 'feature-designation', 'code', 'feature_designation').upper()
            if not feature_designation:
                feature_designation = self.get_child_elem_attrib(
                    location, 'location-type', 'code', 'feature_designation').upper()

            country_code = self.get_child_elem_attrib(
                location, 'administrative', 'country', 'country_code').lower()

            country = None
            if country_code:
                try:
                    country = Country.objects.get(iso_code=country_code)
                except ObjectDoesNotExist as e:
                    self.add_log('administrative', 'country', str(e),
                                 LOG_ENTRY_TYPE.VALUE_NOT_SAVED)

            loc, created = ProjectLocation.objects.get_or_create(
                location_target=self.project,
                latitude=latitude,
                longitude=longitude,
                country=country,
                reference=reference,
                location_code=location_code,
                vocabulary=vocabulary,
                name=name,
                description=description,
                activity_description=activity_description,
                exactness=exactness,
                location_reach=location_reach,
                location_class=location_class,
                feature_designation=feature_designation
            )

            # Disregard double locations
            if loc not in imported_locations:
                if created:
                    changes.append(u'added location (id: {}): {}'.format(loc.pk, loc))
                imported_locations.append(loc)

                # Process location administratives
                administratives = Administratives(
                    self.iati_import_job, location, self.project, self.globals,
                    related_obj=loc)
                for admin_change in administratives.do_import():
                    changes.append(admin_change)

        changes += self.delete_objects(self.project.locations, imported_locations, 'location')
        return changes


class Administratives(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Administratives, self).__init__(
            iati_import_job, parent_elem, project, globals, related_obj)
        self.model = AdministrativeLocation

    def do_import(self):
        """
        Retrieve and store the location administratives.
        The conditions will be extracted from the 'administrative' elements in the 'location' element.

        :return: List; contains fields that have changed
        """
        imported_admins = []
        changes = []

        for administrative in self.parent_elem.findall('administrative'):

            code = self.get_attrib(administrative, 'code', 'code')
            vocabulary = self.get_attrib(administrative, 'vocabulary', 'vocabulary')

            level = self.get_attrib(administrative, 'level', 'level', None)
            if level:
                try:
                    level = int(level)
                except ValueError as e:
                    self.add_log('administrative', 'level', str(e))

            admin, created = AdministrativeLocation.objects.get_or_create(
                location=self.related_obj,
                code=code,
                vocabulary=vocabulary,
                level=level
            )
            if created:
                changes.append(u'added location administrative (id: {}): {}'.format(admin.pk, admin))
            imported_admins.append(admin)

        changes += self.delete_objects(
            self.related_obj.administratives, imported_admins, 'location administrative')
        return changes


class RecipientCountries(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(RecipientCountries, self).__init__(iati_import_job, parent_elem, project, globals)
        self.model = RecipientCountry

    def do_import(self):
        """
        Retrieve and store the recipient countries.
        The conditions will be extracted from the 'recipient-country' elements.

        :return: List; contains fields that have changed
        """
        imported_countries = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('recipient-country'):
            return changes

        for country in self.parent_elem.findall('recipient-country'):

            text = self.get_element_text(country, 'text')
            country_code = self.get_attrib(country, 'code', 'country')

            percentage = self.get_attrib(country, 'percentage', 'percentage', None)
            if percentage:
                percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')

            recipient_country, created = RecipientCountry.objects.get_or_create(
                project=self.project,
                country=country_code,
                percentage=percentage,
                text=text
            )
            if created:
                changes.append(u'added recipient country (id: {}): {}'.format(
                    recipient_country.pk, recipient_country))
            imported_countries.append(recipient_country)

        changes += self.delete_objects(
            self.project.recipient_countries, imported_countries, 'recipient country')
        return changes


class RecipientRegions(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(RecipientRegions, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = RecipientRegion

    def do_import(self):
        """
        Retrieve and store the recipient regions.
        The conditions will be extracted from the 'recipient-region' elements.

        :return: List; contains fields that have changed
        """
        imported_regions = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('recipient-region'):
            return changes

        for region in self.parent_elem.findall('recipient-region'):

            text = self.get_element_text(region, 'text')
            region_code = self.get_attrib(region, 'code', 'region')

            percentage = self.get_attrib(region, 'percentage', 'percentage')
            percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')

            region_vocabulary = self.get_attrib(region, 'vocabulary', 'region_vocabulary')
            region_vocabulary_uri = self.get_attrib(region, 'vocabulary-uri',
                                                    'region_vocabulary_uri')

            region_obj, created = RecipientRegion.objects.get_or_create(
                project=self.project,
                region=region_code,
                percentage=percentage,
                text=text,
                region_vocabulary=region_vocabulary,
                region_vocabulary_uri=region_vocabulary_uri
            )
            if created:
                changes.append(
                    u'added recipient region (id: {}): {}'.format(region_obj.pk, region_obj))
            imported_regions.append(region_obj)

        changes += self.delete_objects(
            self.project.recipient_regions, imported_regions, 'recipient region')
        return changes
