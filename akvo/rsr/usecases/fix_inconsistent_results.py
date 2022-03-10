# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from typing import Iterable, Dict, Optional
from django.db import transaction
from akvo.rsr.models import Result, Project
from akvo.rsr.usecases.utils import (
    RF_MODELS_CONFIG, get_direct_lineage_hierarchy_ids, make_trees_from_list, filter_trees, make_source_to_target_map
)


def fix_inconsistent_results(results: Iterable[Result]):
    for result in results:
        fix_inconsistent_result(result)


@transaction.atomic
def fix_inconsistent_result(result: Result):
    """Fix inconsisten result between parent result project and parent project.

    This function fixes the parent of a result that have inconsistency between the project
    of the parent result and the parent project of the result. It also fixes the parent of
    all the indicators and indicator periods under the result. It resolve the correct parents
    by traversing from the false parent result project up to the project hierarchy to find
    the nearest common ancestor than creates a binary lineage tree connecting the false
    parent result project to to correct result's parent project using the nearest common
    ancestor as root. Then, it uses the lineage tree path to resolve the correct parent
    of the result, indicators, and periods respectively.

    """

    if result.parent_result is None:
        return

    parent_project = result.project.parents_all().first()
    parent_result = result.parent_result

    if parent_project == parent_result.project:
        return

    change_candidates = get_change_candidates(parent_result, parent_project)
    for key, candidates in change_candidates.items():
        model, parent_attr, project_relation, _ = RF_MODELS_CONFIG[key]
        for source_parent_id, target_parent_id in candidates.items():
            filter_args = {parent_attr: source_parent_id, project_relation: result.project}
            model.objects.filter(**filter_args).update(**{f"{parent_attr}_id": target_parent_id})


def get_change_candidates(result: Result, target_project: Optional[Project]) -> Dict[str, Dict[int, Optional[int]]]:
    source_project = result.project
    project_ids = get_direct_lineage_hierarchy_ids(source_project, target_project)
    candidates = {}
    for key, config in RF_MODELS_CONFIG.items():
        if key not in ['results', 'indicators', 'periods']:
            continue
        model, parent_attr, project_relation, result_relation = config
        filter_args = {f"{project_relation}__in": project_ids}
        select_attrs = [a for a in ['id', parent_attr, project_relation, result_relation] if a is not None]
        items = model.objects.filter(**filter_args).values(*select_attrs)
        is_member_of_result = (lambda node: node.item[result_relation] == result.pk) \
            if result_relation is not None \
            else (lambda node: node.item['id'] == result.pk)
        item_trees = make_trees_from_list(items, parent_attr)
        filtered_item_trees = filter_trees(item_trees, is_member_of_result)
        candidates[key] = make_source_to_target_map(filtered_item_trees, project_relation, source_project.pk, target_project.pk if target_project else None)
    return candidates
