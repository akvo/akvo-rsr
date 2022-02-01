from typing import List

from akvo.rsr.models.tree.errors import NodeIsSame, ParentIsSame, TreeWillBreak
from akvo.rsr.models.tree.model import AkvoTreeModel
from akvo.rsr.models.tree.usecases import check_set_parent, delete_parent, set_parent
from akvo.rsr.tests.mixins import ModelMixinTestCase


class DescendantsTestCase(ModelMixinTestCase[AkvoTreeModel]):
    mixin = AkvoTreeModel

    def create_descendant_tree(self, depth: int) -> List[AkvoTreeModel]:
        nodes = []
        for i in range(depth):
            nodes.append(self.model.objects.create())
        for parent, child in zip(nodes, nodes[1:]):
            child.set_parent(parent)
        self.model.objects.bulk_update(nodes, ["path"])

        return nodes

    def test_max_depth(self):
        nodes = self.create_descendant_tree(10)
        root = nodes[0]

        self.assertEqual(root.descendants(with_self=False).count(), 9)
        self.assertEqual(root.descendants(max_depth=1, with_self=False).count(), 1)
        self.assertEqual(root.descendants(max_depth=5, with_self=False).count(), 5)
        self.assertEqual(root.descendants(max_depth=10, with_self=False).count(), 9)


class ChangeParentTestCase(ModelMixinTestCase[AkvoTreeModel]):
    mixin = AkvoTreeModel

    def setUp(self):
        super().setUp()
        # Build tree
        # root
        #    left_child
        #    right_child
        #       right_descendant1
        #       right_descendant2
        self.root = self.model.objects.create()
        self.left_child = self.model.objects.create()
        self.right_child = self.model.objects.create()
        self.right_descendant1 = self.model.objects.create()
        self.right_descendant2 = self.model.objects.create()

        self.left_child.set_parent(self.root).save()
        self.right_child.set_parent(self.root).save()
        self.right_descendant1.set_parent(self.right_child).save()
        self.right_descendant2.set_parent(self.right_child).save()

    @staticmethod
    def set_parent(project: AkvoTreeModel, new_parent: AkvoTreeModel):
        check_set_parent(project, new_parent)
        return set_parent(project, new_parent)

    def test_self(self):
        """
        Passing the same object should fail
        """
        with self.assertRaises(NodeIsSame):
            self.set_parent(self.right_child, self.right_child)

    def test_self_from_db(self):
        """
        Passing the same object retrieved from the DB should also fail
        """
        right_child = self.model.objects.get(id=self.right_child.id)

        with self.assertRaises(NodeIsSame):
            self.set_parent(self.right_child, right_child)

    def test_same_parent(self):
        """
        Passing the same parent should fail as there'll be no change
        """
        with self.assertRaises(ParentIsSame):
            self.set_parent(self.right_child, self.root)

    def test_forced_subtree_move(self):
        """
        Movea subtree and check that the new descendants are at the right place
        """
        self.set_parent(self.right_child, self.left_child)

        left_children_uuids = self.left_child.descendants(with_self=False).values_list("uuid", flat=True)
        right_children_uuids = self.right_child.descendants(with_self=False).values_list("uuid", flat=True)

        self.assertTrue(set(right_children_uuids).issubset(set(left_children_uuids)))

    def test_forced_bad_subtree_move(self):
        """
        Attempt a subtree move to on of its own descendants, which shouldn't work
        """
        with self.assertRaises(TreeWillBreak):
            self.set_parent(self.right_child, self.right_descendant2)


class DeleteParentTestCase(ModelMixinTestCase[AkvoTreeModel]):
    mixin = AkvoTreeModel

    def setUp(self):
        super().setUp()
        # Build tree
        # root
        #    left_child
        #    right_child
        #       right_descendant1
        #       right_descendant2
        self.root = self.model.objects.create()
        self.left_child = self.model.objects.create()
        self.right_child = self.model.objects.create()
        self.right_descendant1 = self.model.objects.create()
        self.right_descendant2 = self.model.objects.create()

        self.left_child.set_parent(self.root).save()
        self.right_child.set_parent(self.root).save()
        self.right_descendant1.set_parent(self.right_child).save()
        self.right_descendant2.set_parent(self.right_child).save()

    def test_delete(self):
        delete_parent(self.right_child)
        self.assertIsNone(self.right_child.get_parent_uuid())

    def test_delete_no_ancestor(self):
        self.assertIsNone(self.root.get_parent_uuid())
        delete_parent(self.root)
        self.assertIsNone(self.root.get_parent_uuid())
