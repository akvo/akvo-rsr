# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import add_log

from django.db.models import get_model


def legacy_data(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the legacy data.
    The conditions will be extracted from the 'legacy-data' elements.

    :param iati_import: IatiImport instance
    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_lds = []
    changes = []

    for legacy in activity.findall('legacy-data'):
        name = ''
        value = ''
        iati_equivalent = ''

        if 'name' in legacy.attrib.keys():
            name = legacy.attrib['name']
            if len(name) > 100:
                add_log(iati_import, 'legacy_data_name',
                        'name too long (100 characters allowed)', project, 3)
                name = name[:100]

        if 'value' in legacy.attrib.keys():
            value = legacy.attrib['value']
            if len(value) > 100:
                add_log(iati_import, 'legacy_data_value',
                        'value too long (100 characters allowed)', project, 3)
                value = value[:100]

        if 'iati-equivalent' in legacy.attrib.keys():
            iati_equivalent = legacy.attrib['iati-equivalent']
            if len(iati_equivalent) > 100:
                add_log(iati_import, 'legacy_data_iati_equivalent',
                        'iati equivalent too long (100 characters allowed)', project, 3)
                iati_equivalent = iati_equivalent[:100]

        ld, created = get_model('rsr', 'legacydata').objects.get_or_create(
            project=project,
            name=name,
            value=value,
            iati_equivalent=iati_equivalent
        )

        if created:
            changes.append(u'added legacy data (id: %s): %s' % (str(ld.pk), ld))

        imported_lds.append(ld)

    for legacy in project.legacy_data.all():
        if not legacy in imported_lds:
            changes.append(u'deleted legacy data (id: %s): %s' %
                           (str(legacy.pk),
                            legacy.__unicode__()))
            legacy.delete()

    return changes
