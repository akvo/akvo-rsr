# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.db.models import get_model


def results(activity, project, activities_globals):
    """
    Retrieve and store the result information.
    The results will be extracted from the 'result' elements.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_results = []
    changes = []

    for result in activity.findall('result'):
        result_type = result.attrib['type'] if 'type' in result.attrib.keys() else ''

        result_title_element = result.find('title')
        if not result_title_element is None:
            result_title_text = get_text(result_title_element, activities_globals['version'])
        else:
            result_title_text = ''

        result_desc_element = result.find('description')
        if not result_desc_element is None:
            result_desc_text = get_text(result_desc_element, activities_globals['version'])
        else:
            result_desc_text = ''

        if 'aggregation-status' in result.attrib.keys():
            result_aggr_status = result.attrib['aggregation-status']
        else:
            result_aggr_status = ''

        if result_aggr_status.lower() in ['1', 'true', 't', 'yes']:
            result_aggr_status = True
        elif result_aggr_status.lower() in ['0', 'false', 'f', 'no']:
            result_aggr_status = False
        else:
            result_aggr_status = None

        res, created = get_model('rsr', 'result').objects.get_or_create(
            project=project,
            type=result_type,
            title=result_title_text,
            aggregation_status=result_aggr_status,
            description=result_desc_text
        )
        imported_results.append(res)
        if created:
            changes.append(u'added result (id: %s): %s' % (str(res.pk), res))

        for ind_change in indicators(result, res, activities_globals):
            changes.append(ind_change)

    for result in project.results.all():
        if not result in imported_results:
            changes.append(u'deleted result (id: %s): %s' %
                           (str(result.pk),
                            result.__unicode__()))
            result.delete()

    return changes


def indicators(result_element, result, activities_globals):
    """
    Retrieve and store the indicator information of a result.
    The indicators will be extracted from the 'indicator' elements.

    :param result_element: ElementTree; contains all data for the result
    :param result: Result instance
    :param activities_globals: Dictionary; contains all global activities information
    :param created: Boolean; indicates whether the result has just been created or not
    :return: List; contains fields that have changed
    """
    imported_indicators = []
    changes = []

    for indicator in result_element.findall('indicator'):
        indicator_meas = indicator.attrib['measure'] if 'measure' in indicator.attrib.keys() else ''

        if 'ascending' in indicator.attrib.keys():
            indicator_asc = indicator.attrib['ascending']
        else:
            indicator_asc = ''

        if indicator_asc.lower() in ['1', 'true', 't', 'yes']:
            indicator_asc = True
        elif indicator_asc.lower() in ['0', 'false', 'f', 'no']:
            indicator_asc = False
        else:
            indicator_asc = None

        indicator_title_element = indicator.find('title')
        if not indicator_title_element is None:
            indicator_title_text = get_text(indicator_title_element, activities_globals['version'])
        else:
            indicator_title_text = ''

        indicator_desc_element = indicator.find('description')
        if not indicator_desc_element is None:
            indicator_desc_text = get_text(indicator_desc_element, activities_globals['version'])
        else:
            indicator_desc_text = ''

        base_element = indicator.find('baseline')
        if not base_element is None:
            year = base_element.attrib['year'] if 'year' in base_element.attrib.keys() else None
            value = base_element.attrib['value'] if 'value' in base_element.attrib.keys() else ''

            base_comment = base_element.find('comment')
            if not base_comment is None:
                base_comment_text = get_text(base_comment, activities_globals['version'])
            else:
                base_comment_text = ''
        else:
            year = None
            value = ''
            base_comment_text = ''

        ind, created = get_model('rsr', 'indicator').objects.get_or_create(
            result=result,
            measure=indicator_meas,
            ascending=indicator_asc,
            title=indicator_title_text,
            description=indicator_desc_text,
            baseline_year=int(year) if year else None,
            baseline_value=value,
            baseline_comment=base_comment_text
        )
        imported_indicators.append(ind)
        if created:
            changes.append(u'added indicator (id: %s): %s' % (str(ind.pk), ind))

        # TODO: indicator periods

    for indicator in result.indicators.all():
        if not indicator in imported_indicators:
            changes.append(u'deleted indicator (id: %s): %s' %
                           (str(indicator.pk),
                            indicator.__unicode__()))
            indicator.delete()

    return changes
