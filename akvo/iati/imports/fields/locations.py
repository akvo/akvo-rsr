# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.country import Country, RecipientCountry
from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.location import AdministrativeLocation, ProjectLocation
from ....rsr.models.region import RecipientRegion

from ..utils import add_log, get_text, ImporterHelper

from decimal import Decimal, InvalidOperation

from django.core.exceptions import ObjectDoesNotExist


class Locations(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Locations, self).__init__(iati_import, parent_elem, project, globals)
        self.model = ProjectLocation

    def do_import(self):
        """
        Retrieve and store the locations.
        The conditions will be extracted from the 'location' elements.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_locations = []
        changes = []

        for location in self.parent_elem.findall('location'):
            # ref = ''
            # reach = ''
            # code = ''
            # vocabulary = ''
            # name = ''
            # description = ''
            # activity_description = ''
            # latitude = None
            # longitude = None
            # exactness = ''
            # location_class = ''
            # feature_designation = ''
            # country = None

            reference = self.get_attrib(location, 'ref', 'reference')
            # if 'ref' in location.attrib.keys():
            #     if not len(location.attrib['ref']) > 50:
            #         ref = location.attrib['ref']
            #     else:
            #         add_log(iati_import, 'location_ref',
            #                 'reference is too long (50 characters allowed)', project)

            location_reach = self.get_child_elem_attrib(
                    location, 'location-reach', 'code', 'location_reach')
            # reach_element = location.find('location-reach')
            # if not reach_element is None and 'code' in reach_element.attrib.keys():
            #     if not len(reach_element.attrib['code']) > 1:
            #         reach = reach_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'location_reach',
            #                 'reach is too long (1 character allowed)', project)

            id_element = location.find('location-id')
            if id_element is not None:
                location_code = self.get_attrib(id_element, 'code', 'location_code')
                vocabulary = self.get_attrib(id_element, 'vocabulary', 'vocabulary')
            else:
                location_code = ''
                vocabulary = ''
            # id_element = location.find('location-id')
            # if not id_element is None:
            #     if 'code' in id_element.attrib.keys():
            #         if not len(id_element.attrib['code']) > 25:
            #             code = id_element.attrib['code']
            #         else:
            #             add_log(iati_import, 'location_code',
            #                     'code is too long (25 characters allowed)', project)
            #     if 'vocabulary' in id_element.attrib.keys():
            #         if not len(id_element.attrib['vocabulary']) > 2:
            #             vocabulary = id_element.attrib['vocabulary']
            #         else:
            #             add_log(iati_import, 'location_vocabulary',
            #                     'vocabulary is too long (2 characters allowed)', project)
            name = self.get_child_element_text(location, 'name', 'name')
            # name_element = location.find('name')
            # if not name_element is None:
            #     name = get_text(name_element, activities_globals['version'])
            #     if len(name) > 100:
            #         add_log(iati_import, 'location_name', 'name is too long (100 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         name = name[:100]

            description = self.get_child_element_text(location, 'description', 'description')
            # description_element = location.find('description')
            # if not description_element is None:
            #     description = get_text(description_element, activities_globals['version'])
            #     if len(description) > 255:
            #         add_log(iati_import, 'location_decription',
            #                 'description is too long (255 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         description = description[:255]

            activity_description = self.get_child_element_text(
                    location, 'activity-description', 'activity_description')
            # act_description_element = location.find('activity-description')
            # if not act_description_element is None:
            #     activity_description = get_text(act_description_element, activities_globals['version'])
            #     if len(activity_description) > 255:
            #         add_log(iati_import, 'location_activity_decription',
            #                 'description is too long (255 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         activity_description = activity_description[:255]

            point = location.find('point')
            if point is not None:
                lat_long = self.get_child_element_text(point, 'pos', None, '0 0')
                latitude = float(lat_long.split(' ')[0])
                longitude = float(lat_long.split(' ')[1])
            else:
                coordinates = location.find('coordinates')
                if coordinates is not None:
                    latitude = self.get_child_elem_attrib(coordinates, 'latitude', 'latitude', 0)
                    longitude = self.get_child_elem_attrib(coordinates, 'longitude', 'longitude', 0)
                else:
                    latitude = None
                    longitude = None

            # try:
            #     point_element = location.find('point')
            #     coordinates_element = location.find('coordinates')
            #     if not point_element is None:
            #         pos_element = point_element.find('pos')
            #         if not pos_element is None:
            #             latlong_text = pos_element.text
            #             latitude = float(latlong_text.split(' ')[0])
            #             longitude = float(latlong_text.split(' ')[1])
            #     elif not coordinates_element is None:
            #         if 'latitude' in coordinates_element.attrib.keys():
            #             latitude = float(coordinates_element.attrib['latitude'])
            #         if 'longitude' in coordinates_element.attrib.keys():
            #             longitude = float(coordinates_element.attrib['longitude'])
            # except ValueError as e:
            #     add_log(iati_import, 'location_coordinates', str(e), project)

            exactness = self.get_child_elem_attrib(location, 'exactness', 'code', 'exactness')
            # exactness_element = location.find('exactness')
            # if not exactness_element is None and 'code' in exactness_element.attrib.keys():
            #     if not len(exactness_element.attrib['code']) > 1:
            #         exactness = exactness_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'location_exactness',
            #                 'exactness is too long (1 character allowed)', project)

            location_class = self.get_child_elem_attrib(
                    location, 'location-class', 'code', 'location_class')
            # class_element = location.find('location-class')
            # if not class_element is None and 'code' in class_element.attrib.keys():
            #     if not len(class_element.attrib['code']) > 1:
            #         location_class = class_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'location_class',
            #                 'class is too long (1 character allowed)', project)

            feature_designation = self.get_child_elem_attrib(
                    location, 'feature-designation', 'code', 'feature_designation').upper()
            if not feature_designation:
                feature_designation = self.get_child_elem_attrib(
                    location, 'location-type', 'code', 'feature_designation').upper()

            # fd_element = location.find('feature-designation')
            # type_element = location.find('location-type')
            # if not fd_element is None and 'code' in fd_element.attrib.keys():
            #     if not len(fd_element.attrib['code']) > 5:
            #         feature_designation = fd_element.attrib['code'].upper()
            #     else:
            #         add_log(iati_import, 'location_feature_designation',
            #                 'feature designation is too long (5 characters allowed)', project)
            # elif not type_element is None and 'code' in type_element.attrib.keys():
            #     if not len(type_element.attrib['code']) > 5:
            #         feature_designation = type_element.attrib['code'].upper()
            #     else:
            #         add_log(iati_import, 'location_type',
            #                 'type is too long (5 characters allowed)', project)

            country_code = self.get_child_elem_attrib(
                location, 'administrative', 'country', 'country_code').lower()
            if not country_code and len(self.parent_elem.findall('recipient-country')) == 1:
                country_code = self.get_child_elem_attrib(
                        self.parent_elem, 'recipient-country', 'code', 'country_code').lower()

            # country_code = ''
            # administrative_element = location.find('administrative')
            # if not administrative_element is None and 'country' in administrative_element.attrib.keys():
            #     country_code = administrative_element.attrib['country'].lower()
            # elif len(activity.findall('recipient-country')) == 1:
            #     country_element = activity.find('recipient-country')
            #     if 'code' in country_element.attrib.keys():
            #         if not len(country_element.attrib['code']) > 2:
            #             country_code = country_element.attrib['code'].lower()
            #         else:
            #             add_log(iati_import, 'location_country_code',
            #                     'code is too long (2 characters allowed)', project)
            country = None
            if country_code:
                try:
                    country = Country.objects.get(iso_code=country_code)
                except ObjectDoesNotExist as e:
                    self.add_log('administrative', 'country', str(e))

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
            if not loc in imported_locations:
                if created:
                    changes.append(u'added location (id: {}): {}'.format(loc.pk, loc))
                imported_locations.append(loc)

                # Process location administratives
                administratives = Administratives(
                        self.iati_import, self.parent_elem, self.project, self.globals,
                        related_obj=loc)
                for admin_change in administratives.do_import():
                    changes.append(admin_change)

                # for admin_change in administratives(iati_import, location, location, activities_globals):
                #     changes.append(admin_change)
        changes += self.delete_objects(self.project.locations, imported_locations, 'location')
        # for location in self.project.locations.all():
        #     if not location in imported_locations:
        #         changes.append(u'deleted location (id: {}): {}'.format(
        #                 location.pk, location.__unicode__()))
        #         location.delete()
        return changes


class Administratives(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Administratives, self).__init__(
                iati_import, parent_elem, project, globals, related_obj)
        self.model = AdministrativeLocation

    def do_import(self):
        """
        Retrieve and store the location administratives.
        The conditions will be extracted from the 'administrative' elements in the 'location' element.

        :param iati_import: IatiImport instance
        :param location_element: ElementTree; contains all data of the location
        :param location: ProjectLocation instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_admins = []
        changes = []

        for administrative in self.parent_elem.findall('administrative'):
            code = ''
            vocabulary = ''
            level = None

            code = self.get_attrib(administrative, 'code', 'code')
            # if 'code' in administrative.attrib.keys():
            #     if not len(administrative.attrib['code']) > 25:
            #         code = administrative.attrib['code']
            #     else:
            #         add_log(iati_import, 'administrative_location_code',
            #                 'code is too long (25 characters allowed)', location.location_target)

            vocabulary = self.get_attrib(administrative, 'vocabulary', 'vocabulary')
            # if 'vocabulary' in administrative.attrib.keys():
            #     if not len(administrative.attrib['vocabulary']) > 2:
            #         vocabulary = administrative.attrib['vocabulary']
            #     else:
            #         add_log(iati_import, 'administrative_location_vocabulary',
            #                 'vocabulary is too long (2 characters allowed)', location.location_target)

            level = self.get_attrib(administrative, 'level', 'level', None)
            if level:
                try:
                    level = int(level)
                except ValueError as e:
                    self.add_log('administrative', 'level',str(e))
            # if 'level' in administrative.attrib.keys():
            #     if not len(administrative.attrib['level']) > 1:
            #         try:
            #             level = int(administrative.attrib['level'])
            #         except ValueError as e:
            #             add_log(iati_import, 'administrative_location_level', str(e),
            #                     location.location_target)
            #     else:
            #         add_log(iati_import, 'administrative_location_level',
            #                 'level is too long (1 character allowed)', location.location_target)

            admin, created = AdministrativeLocation.objects.get_or_create(
                location=self.related_obj,
                code=code,
                vocabulary=vocabulary,
                level=level
            )

            if created:
                changes.append(u'added location administrative (id: {): {}'.format(admin.pk, admin))

            imported_admins.append(admin)

        changes += self.delete_objects(
                self.related_obj.administratives, imported_admins, 'location administrative')
        # for administrative in self.related_obj.administratives.all():
        #     if not administrative in imported_admins:
        #         changes.append(u'deleted location administrative (id: {}): {}'.format(
        #                 administrative.pk, administrative.__unicode__()))
        #         administrative.delete()
        return changes


class RecipientCountries(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(RecipientCountries, self).__init__(iati_import, parent_elem, project, globals)
        self.model = RecipientCountry

    def do_import(self):
        """
        Retrieve and store the recipient countries.
        The conditions will be extracted from the 'recipient-country' elements.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_countries = []
        changes = []

        for country in self.parent_elem.findall('recipient-country'):
            # code = ''
            # percentage = None

            text = self.get_element_text(country, 'text')
            # text = get_text(country, activities_globals['version'])
            # if len(text) > 50:
            #     add_log(iati_import, 'recipient_country_description',
            #             'description is too long (50 characters allowed)', project,
            #             IatiImportLog.VALUE_PARTLY_SAVED)
            #     text = text[:50]

            country_code = self.get_attrib(country,'code', 'country')
            # if 'code' in country.attrib.keys():
            #     if not len(country.attrib['code']) > 2:
            #         code = country.attrib['code'].upper()
            #     else:
            #         add_log(iati_import, 'recipient_country_code',
            #                 'code is too long (2 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)

            percentage = self.get_attrib(country,'percentage', 'percentage')
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
        # for country in self.project.recipient_countries.all():
        #     if not country in imported_countries:
        #         changes.append(u'deleted recipient country (id: {}): {}'.format(
        #                 country.pk, country.__unicode__()))
        #         country.delete()
        return changes


class RecipientRegions(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(RecipientRegions, self).__init__(iati_import, parent_elem, project, globals)
        self.model = RecipientRegion

    def do_import(self):
        """
        Retrieve and store the recipient regions.
        The conditions will be extracted from the 'recipient-region' elements.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_regions = []
        changes = []

        for region in self.parent_elem.findall('recipient-region'):
            code = ''
            percentage = None
            vocabulary = ''

            text = self.get_element_text(region, 'text')
            # text = get_text(region, activities_globals['version'])
            # if len(text) > 50:
            #     add_log(iati_import, 'recipient_region_description',
            #             'decription is too long (50 characters allowed)', project,
            #             IatiImportLog.VALUE_PARTLY_SAVED)
            #     text = text[:50]

            region_code = self.get_attrib(region, 'code', 'region')
            # if 'code' in region.attrib.keys():
            #     if not len(region.attrib['code']) > 3:
            #         code = region.attrib['code']
            #     else:
            #         add_log(iati_import, 'recipient_region_code',
            #                 'code is too long (3 characters allowed)', project)

            percentage = self.get_attrib(region,'percentage', 'percentage')
            percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')
            # try:
            #     if 'percentage' in region.attrib.keys():
            #         percentage = Decimal(region.attrib['percentage'])
            # except InvalidOperation as e:
            #     add_log(iati_import, 'recipient_region_percentage', str(e), project)

            region_vocabulary = self.get_attrib(region, 'vocabulary', 'region_vocabulary')
            # if 'vocabulary' in region.attrib.keys():
            #     if not len(region.attrib['vocabulary']) > 1:
            #         vocabulary = region.attrib['vocabulary']
            #     else:
            #         add_log(iati_import, 'recipient_region_vocabulary',
            #                 'vocabulary is too long (1 character allowed)', project)

            region_obj, created = RecipientRegion.objects.get_or_create(
                project=self.project,
                region=region_code,
                percentage=percentage,
                text=text,
                region_vocabulary=region_vocabulary
            )

            if created:
                changes.append(
                        u'added recipient region (id: {}): {}'.format(region_obj.pk, region_obj))

            imported_regions.append(region_obj)

        changes += self.delete_objects(
            self.project.recipient_regions, imported_regions, 'recipient region')
        # for region in self.project.recipient_regions.all():
        #     if not region in imported_regions:
        #         changes.append(u'deleted recipient region (id: {}): {}'.format(
        #                 region.pk, region.__unicode__()))
        #         region.delete()
        return changes
