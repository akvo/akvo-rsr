from functools import cached_property
from typing import List, Optional
from uuid import UUID, uuid4

from django.db import models, transaction
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django_ltree.fields import PathValue
from django_ltree.models import TreeModel

from .errors import NodesWillBeOrphaned, TreeWillBreak
from .helpers import label_to_uuid, uuid_to_label
from .managers import AkvoTreeManager, AkvoTreeQuerySet


class AkvoTreeModel(TreeModel):
    objects = AkvoTreeManager()

    uuid = models.UUIDField(editable=False, default=uuid4, unique=True)

    class Meta:
        abstract = True

    @cached_property
    def manager(self) -> AkvoTreeManager:
        return type(self)._default_manager

    @property
    def has_ancestors(self) -> bool:
        return len(self.path) > 1

    def ancestors(self, with_self=True) -> AkvoTreeQuerySet:
        """
        Get ancestors sorted by closest to farthest

        That means parent, then parent's parent, etc.
        """
        ancestors = super().ancestors().order_by("-path")
        if not with_self:
            return ancestors.exclude(id=self.id)
        return ancestors

    def parent(self) -> Optional["AkvoTreeModel"]:
        if self.has_ancestors:
            return self.ancestors(with_self=False).first()

    def get_parent_uuid(self) -> Optional[UUID]:
        if len(self.path) > 1:
            return label_to_uuid(self.path[-2])

    def get_root(self) -> "AkvoTreeModel":
        """
        Get the root node of a tree, which can be the node itself
        """
        if len(self.path) > 1:
            return self.manager.get(uuid=label_to_uuid(self.path[0]))
        else:
            return self

    def descendants(self, max_depth: int = None, with_self: bool = True):
        """
        All sub-nodes and their subnodes and so on

        :param max_depth: Max amount of levels
        :param with_self: Include self in the result
        """
        descendants = self.manager.descendants(self.path, with_self=with_self)
        if max_depth:
            return descendants.filter(path__depth__lte=len(self.path) + max_depth)
        return descendants

    def set_parent(self, new_parent: "AkvoTreeModel", force=False, update_descendants=True):
        """
        Add this node as a child to a parent

        By default, there's a check if this is possible
        :param new_parent:
        :param force:
        :param update_descendants: Descendants won't be orphaned and their paths updated
        :return:
        """

        if not force:
            if self.descendants(with_self=False).exists():
                raise NodesWillBeOrphaned()
            if new_parent in self.descendants():
                raise TreeWillBreak("New parent is a descendant")

        old_path = self.path.copy()
        parent_path = new_parent.path.copy()
        parent_path.append(uuid_to_label(self.uuid))
        self.path = parent_path

        if update_descendants:
            self._update_descendant_parents(old_path)

        return self

    @transaction.atomic()
    def _update_descendant_parents(self, old_path: PathValue, save=True) -> List["AkvoTreeModel"]:
        """
        Basically updates a given tree and makes this node the parent

        Made private as it has the potential to destroy trees and shouldn't be called willy-nilly.

        :param old_path: The old path to this node that can be used to find old descendants
        :param save: will also update the descendants in the DB
        :return: The updated descendants (may or may not be reflected in the DB depending on `save`)
        """
        descendant_lookup = {self.uuid: self}
        descendants = []
        for descendant in self.manager.descendants(old_path).order_by("path"):
            descendant_lookup[descendant.uuid] = descendant
            parent = descendant_lookup[descendant.get_parent_uuid()]
            descendant.set_parent(parent, force=True, update_descendants=False)
            descendants.append(descendant)

        if save:
            self.manager.bulk_update(descendants, ["path"])

        return descendants

    @transaction.atomic()
    def delete_parent(self, force=False, update_descendants=True):
        """
        Basically removes all parents
        """
        if not force:
            if self.path and self.descendants(with_self=False).exists():
                raise NodesWillBeOrphaned()

        old_path = self.path.copy()
        self.path = PathValue(uuid_to_label(self.uuid))
        if update_descendants:
            self._update_descendant_parents(old_path)
        return self


@receiver(pre_save)
def set_path(sender, **kwargs):
    """
    Set path for new AkvoTreeModels

    A new AkvoTreeModel doesn't have a path set yet and it's mandatory.
    """
    if not issubclass(sender, AkvoTreeModel):
        return

    project: AkvoTreeModel = kwargs['instance']
    if project.path:
        return
    project.path = PathValue(uuid_to_label(project.uuid))
