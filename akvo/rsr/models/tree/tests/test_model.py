from typing import List

from akvo.rsr.models.tree.model import AkvoTreeModel
from akvo.rsr.tests.mixins import ModelMixinTestCase


class DescendantsTestCase(ModelMixinTestCase):
    mixin = AkvoTreeModel

    def create_descendant_tree(self, depth: int) -> List[AkvoTreeModel]:
        nodes = []
        for i in range(depth):
            nodes.append(self.model.objects.create())
        for parent, child in zip(nodes, nodes[1:]):
            child.set_parent(parent, force=True, update_descendants=False)
        self.model.objects.bulk_update(nodes, ["path"])

        return nodes

    def test_max_depth(self):
        nodes = self.create_descendant_tree(10)
        root = nodes[0]

        self.assertEqual(root.descendants(with_self=False).count(), 9)
        self.assertEqual(root.descendants(max_depth=1, with_self=False).count(), 1)
        self.assertEqual(root.descendants(max_depth=5, with_self=False).count(), 5)
        self.assertEqual(root.descendants(max_depth=10, with_self=False).count(), 9)
