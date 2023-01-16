from django_ltree.fields import PathValue
from django_ltree.managers import TreeManager, TreeQuerySet


class AkvoTreeQuerySet(TreeQuerySet):

    def descendants(self, path: PathValue, with_self=False) -> "AkvoTreeQuerySet":
        queryset = self.filter(path__descendants=path)
        if not with_self:
            queryset = queryset.exclude(path=path)
        return queryset


class AkvoTreeManager(TreeManager):
    def get_queryset(self):
        return AkvoTreeQuerySet(model=self.model, using=self._db).order_by("path")

    def descendants(self, path: PathValue, with_self=False) -> AkvoTreeQuerySet:
        return self.filter().descendants(path, with_self=with_self)
