from typing import List

import factory
from django.test import TestCase

from akvo.rsr.factories.project import ProjectFactory
from akvo.rsr.management.commands.migrate_related_projects import migrate_siblings
from akvo.rsr.models import Project, RelatedProject


class MigrateSiblingsTest(TestCase):
    def create_siblings(self, sibling_count) -> List[Project]:
        siblings = ProjectFactory.create_batch(sibling_count, title=factory.Sequence(lambda n: 'child%d' % n))
        sibling_rp = []
        # iterate i, i+1
        for left, right in zip(siblings, siblings[1:]):
            sibling_rp.append(RelatedProject.objects.create(
                project=left,
                related_project=right,
                relation=RelatedProject.PROJECT_RELATION_SIBLING
            ))
        return siblings

    def test_one_parent(self):
        """
        A group of siblings with one sibling that has a parent should end up all having the same parent
        """
        parent = ProjectFactory.create(title="Parent")
        sibling_count = 10
        siblings = self.create_siblings(sibling_count)
        # One parent in the group
        last_sibling = siblings[-1]
        last_sibling.set_parent(parent, True)
        last_sibling.save()

        migrate_siblings()

        self.assertEqual(len(parent.descendants(with_self=False)), sibling_count)

    def test_multiple_parents(self):
        """
        A group of sibling have multiple parents, which is a problem, shouldn't get new parents
        """
        siblings = self.create_siblings(10)
        # Two parents in the group
        for i, sibling in enumerate(siblings[:2]):
            sibling.set_parent(Project.objects.create(title=f"Parent {i}"), True)
            sibling.save()

        migrate_siblings()

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

        siblings1[0].set_parent(Project.objects.create(title=f"Group 1 Parent")).save()

        RelatedProject.objects.create(
            project=siblings1[-1],
            related_project=siblings2[-1],
            relation=RelatedProject.PROJECT_RELATION_SIBLING
        )

        migrate_siblings()

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
