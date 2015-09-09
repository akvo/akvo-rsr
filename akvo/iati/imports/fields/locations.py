# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import get_model


def locations(activity, project, activities_globals):
    """
    Retrieve and store the locations.
    The conditions will be extracted from the 'location' elements.

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
        latitude = 0
        longitude = 0
        exactness = ''
        location_class = ''
        feature_designation = ''
        country = None

        if 'ref' in location.attrib.keys():
            ref = location.attrib['ref']

        reach_element = location.find('location-reach')
        if not reach_element is None and 'code' in reach_element.attrib.keys():
            reach = reach_element.attrib['code']

        id_element = location.find('location-id')
        if not id_element is None:
            if 'code' in id_element.attrib.keys():
                code = id_element.attrib['code']

            if 'vocabulary' in id_element.attrib.keys():
                vocabulary = id_element.attrib['vocabulary']

        name_element = location.find('name')
        if not name_element is None:
            name = get_text(name_element, activities_globals['version'])

        description_element = location.find('description')
        if not description_element is None:
            description = get_text(description_element, activities_globals['version'])

        act_description_element = location.find('activity-description')
        if not act_description_element is None:
            activity_description = get_text(act_description_element, activities_globals['version'])

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
        except ValueError:
            pass

        exactness_element = location.find('exactness')
        if not exactness_element is None and 'code' in exactness_element.attrib.keys():
            exactness = exactness_element.attrib['code']

        class_element = location.find('location-class')
        if not class_element is None and 'code' in class_element.attrib.keys():
            location_class = class_element.attrib['code']

        fd_element = location.find('feature-designation')
        type_element = location.find('location-type')
        if not fd_element is None and 'code' in fd_element.attrib.keys():
            feature_designation = fd_element.attrib['code'].upper()
        elif not type_element is None and 'code' in type_element.attrib.keys():
            feature_designation = type_element.attrib['code'].upper()

        administrative_element = location.find('administrative')
        if not administrative_element is None and 'country' in administrative_element.attrib.keys():
            country_code = administrative_element.attrib['country'].lower()
            try:
                country = get_model('rsr', 'country').objects.get(iso_code=country_code)
            except ObjectDoesNotExist:
                pass

        loc, created = get_model('rsr', 'projectlocation').objects.get_or_create(
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

        # Disregard double transactions
        if not loc in imported_locations:
            if created:
                changes.append(u'added location (id: %s): %s' % (str(loc.pk), loc))

            imported_locations.append(loc)

            # Process location administratives
            for admin_change in administratives(location, loc, activities_globals):
                changes.append(admin_change)

    for location in project.locations.all():
        if not location in imported_locations:
            changes.append(u'deleted location (id: %s): %s' %
                           (str(location.pk),
                            location.__unicode__()))
            location.delete()

    return changes


def administratives(location_element, location, activities_globals):
    """
    Retrieve and store the location administratives.
    The conditions will be extracted from the 'administrative' elements in the 'location' element.

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
            code = administrative.attrib['code']

        if 'vocabulary' in administrative.attrib.keys():
            vocabulary = administrative.attrib['vocabulary']

        if 'level' in administrative.attrib.keys():
            try:
                level = int(administrative.attrib['level'])
            except ValueError:
                pass

        admin, created = get_model('rsr', 'administrativelocation').objects.get_or_create(
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
