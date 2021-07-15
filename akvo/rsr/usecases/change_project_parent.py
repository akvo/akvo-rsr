# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Q
from akvo.rsr.models import (
    Project, RelatedProject, Result, Indicator, IndicatorPeriod, IndicatorDimensionName, IndicatorDimensionValue, DefaultPeriod
)


def get_lineage(project):
    project_id = project.id
    family = [project_id]
    while True:
        parent_id = Project.objects.filter(
            Q(
                related_projects__related_project=project_id,
                related_projects__relation=RelatedProject.PROJECT_RELATION_CHILD
            ) | Q(
                related_to_projects__project=project_id,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_PARENT
            )
        ).values_list('id', flat=True).first()
        if parent_id is None:
            break
        family.append(parent_id)
        project_id = parent_id
    return Project.objects.filter(id__in=family)


def get_nearest_common_ancestor(first_lineage, second_lineage):
    for it in first_lineage:
        if it in second_lineage:
            return it


def make_tree_from_list(items, parent_attr):
    tree = []
    lookup = {}
    ids = [it['id'] for it in items]
    for item in items:
        item_id = item['id']
        if item_id not in lookup:
            lookup[item_id] = {'children': []}
        lookup[item_id]['item'] = item
        node = lookup[item_id]
        parent_id = item.get(parent_attr, None)
        if not parent_id or parent_id not in ids:
            tree.append(node)
        else:
            if parent_id not in lookup:
                lookup[parent_id] = {'children': []}
            lookup[parent_id]['children'].append(node)
    return tree


def get_leave(branch):
    return get_leave(branch['children'][0]) if len(branch['children']) else branch['item']


def make_target_parent_map(tree, project_attr, object_id, target_id):
    target_parent_map = {}
    for node in tree:
        if len(node['children']) < 2:
            continue
        children = node['children']
        first, second = get_leave(children[0]), get_leave(children[1])
        if first[project_attr] == object_id and second[project_attr] == target_id:
            target_parent_map[first['id']] = second['id']
        elif second[project_attr] == object_id and first[project_attr] == target_id:
            target_parent_map[second['id']] = first['id']
    return target_parent_map


RF_MODELS_CONFIG = {
    # key: (Model, parent_attribute, project_relation)
    'results': (Result, 'parent_result', 'project'),
    'indicators': (Indicator, 'parent_indicator', 'result__project'),
    'periods': (IndicatorPeriod, 'parent_period', 'indicator__result__project'),
    'dimension_names': (IndicatorDimensionName, 'parent_dimension_name', 'project'),
    'dimension_values': (IndicatorDimensionValue, 'parent_dimension_value', 'name__project'),
    'default_periods': (DefaultPeriod, 'parent_id', 'project'),
}


def get_rf_change_candidates(project, new_parent):
    project_lineage_ids = [*get_lineage(project).values_list('id', flat=True)]
    new_parent_lineage_ids = [*get_lineage(new_parent).values_list('id', flat=True)]
    # no need to include project to find commond ancestor
    common_ancestor_id = get_nearest_common_ancestor(project_lineage_ids[1:], new_parent_lineage_ids)
    if common_ancestor_id is None:
        print('No common ancestor found')
        return {}
    project_ids = set(project_lineage_ids).symmetric_difference(new_parent_lineage_ids) | {common_ancestor_id}
    candidates = {}
    for key, config in RF_MODELS_CONFIG.items():
        model, parent_attr, project_relation = config
        filter_arg = {f"{project_relation}__in": project_ids}
        items = model.objects.filter(**filter_arg).values('id', parent_attr, project_relation)
        items_tree = make_tree_from_list(items, parent_attr)
        candidates[key] = make_target_parent_map(items_tree, project_relation, project.id, new_parent.id)
    return candidates


def change_parent(project, new_parent, verbosity=0):
    old_parent = project.parents_all().first()
    if old_parent.id == new_parent.id:
        if verbosity > 0:
            print("New parent same as current parent")
        return
    # change parents of RF items
    change_candidates = get_rf_change_candidates(project, new_parent)
    for key, candidates in change_candidates.items():
        model, parent_attr, _ = RF_MODELS_CONFIG[key]
        items = model.objects.filter(id__in=candidates.keys())
        for item in items:
            if verbosity > 1:
                print(f"Change {key} parent of {item} to {candidates[item.id]}")
            setattr(item, f"{parent_attr}_id", candidates[item.id])
            item.save()
    # change project parent
    if verbosity > 1:
        print(f"Change project {project.title} (ID:{project.id}) parent to {new_parent.title} (ID:{new_parent.id})")
    RelatedProject.objects.filter(
        project=old_parent, related_project=project, relation='2'
    ).update(project=new_parent)
    RelatedProject.objects.filter(
        related_project=old_parent, project=project, relation='1'
    ).update(related_project=new_parent)
    # Handle any results etc only on the new parent, but not on the old parent.
    project.do_import_results(new_parent)
    # FIXME: The function could possibly be re-written to make this
    # unnecessary? The new ordering is only necessary at the child level if
    # parent has no ordering...
    ordering = sorted([
        # Avoid int vs None comaparison errors
        tuple(9999 if it is None else it for it in each)
        for each
        in project.results.values_list('parent_result__order', 'parent_result__id', 'order', 'id')
    ])
    for order, (_, _, _, result_id) in enumerate(ordering, start=1):
        project.results.filter(id=result_id).update(order=order)
