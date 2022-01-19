import copy
from typing import List

from django.db import transaction
from django_ltree.fields import PathValue

from akvo.rsr.models.tree.errors import TreeWillBreak
from akvo.rsr.models.tree.model import AkvoTreeModel


@transaction.atomic
def set_parent(node: AkvoTreeModel, new_parent: AkvoTreeModel):
    old_path = copy.deepcopy(node.path)

    node.set_parent(new_parent).save()

    descendants = update_descendant_parents(old_path, node)
    node.manager.bulk_update(descendants, ["path"])


def check_set_parent(node: AkvoTreeModel, new_parent: AkvoTreeModel):
    # Ensure that new_parent is in the DB
    if not new_parent.pk:
        raise node.DoesNotExist("New parent not in DB")

    if node.uuid == new_parent.uuid:
        raise ValueError("Nodes are the same")

    old_parent_uuid = node.get_parent_uuid()
    if old_parent_uuid and (old_parent_uuid == new_parent.uuid):
        raise ValueError("New parent same as current parent")

    if new_parent in node.descendants():
        raise TreeWillBreak("New parent is a descendant")

@transaction.atomic()
def delete_parent(node: AkvoTreeModel):
    """
    Delete parent and update the descendants
    """
    if not node.has_ancestors:
        return
    old_path = node.path.copy()
    node.delete_parent().save()
    update_descendant_parents(old_path, node)
    return node

def update_descendant_parents(old_path: PathValue, new_parent: AkvoTreeModel) -> List[AkvoTreeModel]:
    """
    Basically updates a given tree and makes this node the parent

    Made private as it has the potential to destroy trees and shouldn't be called willy-nilly.

    :param old_path: The old path to this node that can be used to find old descendants
    :param new_parent:
    :return: The updated descendants (may or may not be reflected in the DB depending on `save`)
    """
    descendant_lookup = {new_parent.uuid: new_parent}
    descendants = []
    for descendant in new_parent.manager.descendants(old_path).order_by("path"):
        descendant_lookup[descendant.uuid] = descendant
        parent = descendant_lookup[descendant.get_parent_uuid()]
        descendant.set_parent(parent)
        descendants.append(descendant)

    return descendants