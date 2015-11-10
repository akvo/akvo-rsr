# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.country import Country, RecipientCountry
from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.location import AdministrativeLocation, ProjectLocation
from ....rsr.models.region import RecipientRegion

from ..utils import add_log, get_text

from decimal import Decimal, InvalidOperation

from django.core.exceptions import ObjectDoesNotExist


def locations(iati_import, activity, project, activities_globals):
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

    for location in activity.findall('location'):
        ref = ''
        reach = ''
        code = ''
        vocabulary = ''
        name = ''
        description = ''
        activity_description = ''
        latitude = None
        longitude = None
        exactness = ''
        location_class = ''
        feature_designation = ''
        country = None

        if 'ref' in location.attrib.keys():
            if not len(location.attrib['ref']) > 50:
                ref = location.attrib['ref']
            else:
                add_log(iati_import, 'location_ref',
                        'reference is too long (50 characters allowed)', project)

        reach_element = location.find('location-reach')
        if not reach_element is None and 'code' in reach_element.attrib.keys():
            if not len(reach_element.attrib['code']) > 1:
                reach = reach_element.attrib['code']
            else:
                add_log(iati_import, 'location_reach',
                        'reach is too long (1 character allowed)', project)

        id_element = location.find('location-id')
        if not id_element is None:
            if 'code' in id_element.attrib.keys():
                if not len(id_element.attrib['code']) > 25:
                    code = id_element.attrib['code']
                else:
                    add_log(iati_import, 'location_code',
                            'code is too long (25 characters allowed)', project)

            if 'vocabulary' in id_element.attrib.keys():
                if not len(id_element.attrib['vocabulary']) > 2:
                    vocabulary = id_element.attrib['vocabulary']
                else:
                    add_log(iati_import, 'location_vocabulary',
                            'vocabulary is too long (2 characters allowed)', project)

        name_element = location.find('name')
        if not name_element is None:
            name = get_text(name_element, activities_globals['version'])
            if len(name) > 100:
                add_log(iati_import, 'location_name', 'name is too long (100 characters allowed)',
                        project, IatiImportLog.VALUE_PARTLY_SAVED)
                name = name[:100]

        description_element = location.find('description')
        if not description_element is None:
            description = get_text(description_element, activities_globals['version'])
            if len(description) > 255:
                add_log(iati_import, 'location_decription',
                        'description is too long (255 characters allowed)', project,
                        IatiImportLog.VALUE_PARTLY_SAVED)
                description = description[:255]

        act_description_element = location.find('activity-description')
        if not act_description_element is None:
            activity_description = get_text(act_description_element, activities_globals['version'])
            if len(activity_description) > 255:
                add_log(iati_import, 'location_activity_decription',
                        'description is too long (255 characters allowed)', project,
                        IatiImportLog.VALUE_PARTLY_SAVED)
                activity_description = activity_description[:255]

        try:
            point_element = location.find('point')
            coordinates_element = location.find('coordinates')
            if not point_element is None:
                pos_element = point_element.find('pos')
                if not pos_element is None:
                    latlong_text = pos_element.text
                    latitude = float(latlong_text.split(' ')[0])
                    longitude = float(latlong_text.split(' ')[1])
            elif not coordinates_element is None:
                if 'latitude' in coordinates_element.attrib.keys():
                    latitude = float(coordinates_element.attrib['latitude'])
                if 'longitude' in coordinates_element.attrib.keys():
                    longitude = float(coordinates_element.attrib['longitude'])
        except ValueError as e:
            add_log(iati_import, 'location_coordinates', str(e), project)

        exactness_element = location.find('exactness')
        if not exactness_element is None and 'code' in exactness_element.attrib.keys():
            if not len(exactness_element.attrib['code']) > 1:
                exactness = exactness_element.attrib['code']
            else:
                add_log(iati_import, 'location_exactness',
                        'exactness is too long (1 character allowed)', project)

        class_element = location.find('location-class')
        if not class_element is None and 'code' in class_element.attrib.keys():
            if not len(class_element.attrib['code']) > 1:
                location_class = class_element.attrib['code']
            else:
                add_log(iati_import, 'location_class',
                        'class is too long (1 character allowed)', project)

        fd_element = location.find('feature-designation')
        type_element = location.find('location-type')
        if not fd_element is None and 'code' in fd_element.attrib.keys():
            if not len(fd_element.attrib['code']) > 5:
                feature_designation = fd_element.attrib['code'].upper()
            else:
                add_log(iati_import, 'location_feature_designation',
                        'feature designation is too long (5 characters allowed)', project)
        elif not type_element is None and 'code' in type_element.attrib.keys():
            if not len(type_element.attrib['code']) > 5:
                feature_designation = type_element.attrib['code'].upper()
            else:
                add_log(iati_import, 'location_type',
                        'type is too long (5 characters allowed)', project)

        country_code = ''
        administrative_element = location.find('administrative')
        if not administrative_element is None and 'country' in administrative_element.attrib.keys():
            country_code = administrative_element.attrib['country'].lower()
        elif len(activity.findall('recipient-country')) == 1:
            country_element = activity.find('recipient-country')
            if 'code' in country_element.attrib.keys():
                if not len(country_element.attrib['code']) > 2:
                    country_code = country_element.attrib['code'].lower()
                else:
                    add_log(iati_import, 'location_country_code',
                            'code is too long (2 characters allowed)', project)
        if country_code:
            try:
                country = Country.objects.get(iso_code=country_code)
            except ObjectDoesNotExist as e:
                add_log(iati_import, 'location_country', str(e), project)

        loc, created = ProjectLocation.objects.get_or_create(
            location_target=project,
            latitude=latitude,
            longitude=longitude,
            country=country,
            reference=ref,
            location_code=code,
            vocabulary=vocabulary,
            name=name,
            description=description,
            activity_description=activity_description,
            exactness=exactness,
            location_reach=reach,
            location_class=location_class,
            feature_designation=feature_designation
        )

        # Disregard double locations
        if not loc in imported_locations:
            if created:
                changes.append(u'added location (id: %s): %s' % (str(loc.pk), loc))

            imported_locations.append(loc)

            # Process location administratives
            for admin_change in administratives(iati_import, location, loc, activities_globals):
                changes.append(admin_change)

    for location in project.locations.all():
        if not location in imported_locations:
            changes.append(u'deleted location (id: %s): %s' %
                           (str(location.pk),
                            location.__unicode__()))
            location.delete()

    return changes


def administratives(iati_import, location_element, location, activities_globals):
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

    for administrative in location_element.findall('administrative'):
        code = ''
        vocabulary = ''
        level = None

        if 'code' in administrative.attrib.keys():
            if not len(administrative.attrib['code']) > 25:
                code = administrative.attrib['code']
            else:
                add_log(iati_import, 'administrative_location_code',
                        'code is too long (25 characters allowed)', location.location_target)

        if 'vocabulary' in administrative.attrib.keys():
            if not len(administrative.attrib['vocabulary']) > 2:
                vocabulary = administrative.attrib['vocabulary']
            else:
                add_log(iati_import, 'administrative_location_vocabulary',
                        'vocabulary is too long (2 characters allowed)', location.location_target)

        if 'level' in administrative.attrib.keys():
            if not len(administrative.attrib['level']) > 1:
                try:
                    level = int(administrative.attrib['level'])
                except ValueError as e:
                    add_log(iati_import, 'administrative_location_level', str(e),
                            location.location_target)
            else:
                add_log(iati_import, 'administrative_location_level',
                        'level is too long (1 character allowed)', location.location_target)

        admin, created = AdministrativeLocation.objects.get_or_create(
            location=location,
            code=code,
            vocabulary=vocabulary,
            level=level
        )

        if created:
            changes.append(u'added location administrative (id: %s): %s' % (str(admin.pk), admin))

        imported_admins.append(admin)

    for administrative in location.administratives.all():
        if not administrative in imported_admins:
            changes.append(u'deleted location administrative (id: %s): %s' %
                           (str(administrative.pk),
                            administrative.__unicode__()))
            administrative.delete()

    return changes


def recipient_countries(iati_import, activity, project, activities_globals):
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

    for country in activity.findall('recipient-country'):
        code = ''
        percentage = None

        text = get_text(country, activities_globals['version'])
        if len(text) > 50:
            add_log(iati_import, 'recipient_country_description',
                    'description is too long (50 characters allowed)', project,
                    IatiImportLog.VALUE_PARTLY_SAVED)
            text = text[:50]

        if 'code' in country.attrib.keys():
            if not len(country.attrib['code']) > 2:
                code = country.attrib['code'].upper()
            else:
                add_log(iati_import, 'recipient_country_code',
                        'code is too long (2 characters allowed)', project,
                        IatiImportLog.VALUE_PARTLY_SAVED)

        try:
            if 'percentage' in country.attrib.keys():
                percentage = Decimal(country.attrib['percentage'])
        except InvalidOperation as e:
            add_log(iati_import, 'recipient_country_percentage', str(e), project)

        rc, created = RecipientCountry.objects.get_or_create(
            project=project,
            country=code,
            percentage=percentage,
            text=text
        )

        if created:
            changes.append(u'added recipient country (id: %s): %s' % (str(rc.pk), rc))

        imported_countries.append(rc)

    for country in project.recipient_countries.all():
        if not country in imported_countries:
            changes.append(u'deleted recipient country (id: %s): %s' %
                           (str(country.pk),
                            country.__unicode__()))
            country.delete()

    return changes


def recipient_regions(iati_import, activity, project, activities_globals):
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

    for region in activity.findall('recipient-region'):
        code = ''
        percentage = None
        vocabulary = ''

        text = get_text(region, activities_globals['version'])
        if len(text) > 50:
            add_log(iati_import, 'recipient_region_description',
                    'decription is too long (50 characters allowed)', project,
                    IatiImportLog.VALUE_PARTLY_SAVED)
            text = text[:50]

        if 'code' in region.attrib.keys():
            if not len(region.attrib['code']) > 3:
                code = region.attrib['code']
            else:
                add_log(iati_import, 'recipient_region_code',
                        'code is too long (3 characters allowed)', project)

        try:
            if 'percentage' in region.attrib.keys():
                percentage = Decimal(region.attrib['percentage'])
        except InvalidOperation as e:
            add_log(iati_import, 'recipient_region_percentage', str(e), project)

        if 'vocabulary' in region.attrib.keys():
            if not len(region.attrib['vocabulary']) > 1:
                vocabulary = region.attrib['vocabulary']
            else:
                add_log(iati_import, 'recipient_region_vocabulary',
                        'vocabulary is too long (1 character allowed)', project)

        rr, created = RecipientRegion.objects.get_or_create(
            project=project,
            region=code,
            percentage=percentage,
            text=text,
            region_vocabulary=vocabulary
        )

        if created:
            changes.append(u'added recipient region (id: %s): %s' % (str(rr.pk), rr))

        imported_regions.append(rr)

    for region in project.recipient_regions.all():
        if not region in imported_regions:
            changes.append(u'deleted recipient region (id: %s): %s' %
                           (str(region.pk),
                            region.__unicode__()))
            region.delete()

    return changes
