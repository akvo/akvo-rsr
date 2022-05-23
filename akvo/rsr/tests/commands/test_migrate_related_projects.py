from sys import stderr, stdout
from typing import List

import factory

from akvo.rsr.factories.project import ProjectFactory
from akvo.rsr.management.commands.migrate_related_projects import (
    Command, Migrator,
)
from akvo.rsr.models.project import TreeNode, build_tree
from akvo.rsr.management.commands.tests.base import BaseCommandTestCase
from akvo.rsr.models import Project, RelatedProject
from akvo.rsr.tests.base import BaseTestCase


class CommandTest(BaseCommandTestCase[Command]):
    command_class = Command

    def setUp(self) -> None:
        super().setUp()
        self.maxDiff = None
        # Build tree
        # Program
        #   Left Project
        #       Left Child 1
        #       Left Child 2
        #       Left Child 3
        #       Left Child 4
        #   Right Project
        #       Right Child

        self.program = Project.objects.create(title="Program")
        self.left_project = Project.objects.create(title="Left Project")
        self.right_project = Project.objects.create(title="Right Project")
        self.left_child1 = Project.objects.create(title="Left Child 1")
        self.left_child2 = Project.objects.create(title="Left Child 2")
        self.left_child3 = Project.objects.create(title="Left Child 3")
        self.left_child4 = Project.objects.create(title="Left Child 4")
        self.right_child = Project.objects.create(title="Right Child")

        # Left branch
        RelatedProject.objects.create(
            project=self.program,
            related_project=self.left_project,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )

        # Left children
        RelatedProject.objects.create(
            project=self.left_project,
            related_project=self.left_child1,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        RelatedProject.objects.create(
            project=self.left_child2,
            related_project=self.left_project,
            relation=RelatedProject.PROJECT_RELATION_PARENT
        )
        # Sibling group of left children
        RelatedProject.objects.create(
            project=self.left_child2,
            related_project=self.left_child3,
            relation=RelatedProject.PROJECT_RELATION_SIBLING
        )
        RelatedProject.objects.create(
            project=self.left_child3,
            related_project=self.left_child4,
            relation=RelatedProject.PROJECT_RELATION_SIBLING
        )

        # Right branch
        RelatedProject.objects.create(
            project=self.right_project,
            related_project=self.program,
            relation=RelatedProject.PROJECT_RELATION_PARENT
        )
        RelatedProject.objects.create(
            project=self.right_project,
            related_project=self.right_child,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )

    def test_apply(self):
        self.run_command("--apply")

        self.assertDictEqual(
            build_tree(Project.objects.get(title="Program")).to_dict(),
            TreeNode(
                item=Project.objects.get(title="Program"),
                children={
                    self.left_project.uuid: TreeNode(
                        item=self.left_project,
                        children={
                            self.left_child1.uuid: TreeNode(item=Project.objects.get(uuid=self.left_child1.uuid)),
                            self.left_child2.uuid: TreeNode(item=Project.objects.get(uuid=self.left_child2.uuid)),
                            self.left_child3.uuid: TreeNode(item=Project.objects.get(uuid=self.left_child3.uuid)),
                            self.left_child4.uuid: TreeNode(item=Project.objects.get(uuid=self.left_child4.uuid)),
                        }
                    ),
                    self.right_project.uuid: TreeNode(
                        item=self.right_project,
                        children={
                            self.right_child.uuid: TreeNode(item=Project.objects.get(uuid=self.right_child.uuid))
                        }
                    )
                }
            ).to_dict()
        )

    def test_no_apply(self):
        self.run_command()
        self.assertIn("Changes not applied", self.stdout.getvalue())
        # No changes should've been applied and all projects should be ltree roots
        self.assertEqual(Project.objects.filter(path__depth=1).count(), Project.objects.all().count())


class MigrateSiblingsTest(BaseTestCase):

    def setUp(self):
        self.migrator = Migrator(stdout, stderr, apply=True)

    def create_siblings(self, sibling_count) -> List[Project]:
        siblings = ProjectFactory.create_batch(sibling_count, title=factory.Sequence(lambda n: 'child%d' % n))
        sibling_rp = []
        # iterate i, i+1
        for left, right in zip(siblings, siblings[1:]):
            sibling_rp.append(
                RelatedProject.objects.create(
                    project=left,
                    related_project=right,
                    relation=RelatedProject.PROJECT_RELATION_SIBLING
                )
            )
        return siblings

    def test_no_parent(self):
        """
        A group of siblings and none have a parent

        No parent should be magically associated
        """
        Project.objects.create(title="Not a parent")
        sibling_count = 10
        self.create_siblings(sibling_count)

        self.migrator.migrate_siblings()

        self.assertEqual(Project.objects.filter(path__depth=1).count(), sibling_count + 1)

    def test_one_parent(self):
        """
        A group of siblings with one sibling that has a parent should end up all having the same parent
        """
        parent = ProjectFactory.create(title="Parent")
        sibling_count = 10
        siblings = self.create_siblings(sibling_count)
        # One parent in the group
        last_sibling = siblings[-1]
        last_sibling.set_parent(parent)
        last_sibling.save()

        self.migrator.migrate_siblings()

        self.assertEqual(len(parent.descendants(with_self=False)), sibling_count)

    def test_multiple_parents(self):
        """
        A group of sibling have multiple parents, which is a problem, shouldn't get new parents
        """
        siblings = self.create_siblings(10)
        # Two parents in the group
        for i, sibling in enumerate(siblings[:2]):
            sibling.set_parent(Project.objects.create(title=f"Parent {i}"))
            sibling.save()

        self.migrator.migrate_siblings()

        # We should still have only 2 parents
        self.assertEqual(
            len(set(project.get_parent_uuid()
                    # Projects with parents
                    for project in Project.objects.filter(path__match="*{2,}"))
                ),
            2
        )

    def test_multiple_groups(self):
        """
        Two groups of siblings have one sibling that is in both groups

        The two groups should be merged as they are all siblings.
        """
        siblings1 = self.create_siblings(5)
        siblings2 = self.create_siblings(5)

        siblings1[0].set_parent(Project.objects.create(title="Group 1 Parent")).save()

        RelatedProject.objects.create(
            project=siblings1[-1],
            related_project=siblings2[-1],
            relation=RelatedProject.PROJECT_RELATION_SIBLING
        )

        self.migrator.migrate_siblings()

        # Only one parent should exist
        parents = Project.objects.filter(path__depth=1)
        self.assertEqual(parents.count(), 1)

        # All siblings should have the same parent
        children = parents.first().children()
        self.assertEqual(children.count(), len(siblings1 + siblings2))
        self.assertEqual(
            set(child.uuid for child in children),
            set(child.uuid for child in siblings1) | set(child.uuid for child in siblings2)
        )
