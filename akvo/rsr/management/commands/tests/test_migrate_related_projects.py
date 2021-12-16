import factory
from django.test import TestCase

from akvo.rsr.factories.project import ProjectFactory
from akvo.rsr.management.commands.migrate_related_projects import migrate_siblings
from akvo.rsr.models import Project, RelatedProject


class MigrateSiblingsTest(TestCase):
    def create_siblings(self, sibling_count):
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

        self.assertEqual(len(parent.descendants()), sibling_count)

    def test_multiple_parents(self):
        """
        A group of sibling have multiple parents, which a problem, shouldn't get new parents
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
