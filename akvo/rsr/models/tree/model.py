from functools import cached_property
from typing import Optional
from uuid import UUID, uuid4

from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django_ltree.fields import PathValue
from django_ltree.models import TreeModel

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

    def set_parent(self, new_parent: "AkvoTreeModel", force: bool = False) -> "AkvoTreeModel":
        """
        Add this node as a child to a parent

        There's NO a check if this is possible.
        Use the helper if you want checks
        """
        parent_path = new_parent.path.copy()
        parent_path.append(uuid_to_label(self.uuid))
        self.path = parent_path

        return self

    def delete_parent(self):
        """
        Basically removes all parents
        """
        self.path = PathValue(uuid_to_label(self.uuid))
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
