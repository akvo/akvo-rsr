import factory
from django.test import TestCase

from akvo.rsr.factories.project import ProjectFactory
from akvo.rsr.management.commands.migrate_related_projects import migrate_siblings
from akvo.rsr.models import Project, RelatedProject


class MigrateSiblingsTest(TestCase):
    def test_one_parent(self):
        """
        A group of siblings with one sibling that has a parent should end up all having the same parent
        """
        parent = ProjectFactory.create(title="Parent")
        sibling_count = 10
        siblings = ProjectFactory.create_batch(sibling_count, title=factory.Sequence(lambda n: 'child%d' % n))
        sibling_rp = []

        # iterate i, i+1
        for left, right in zip(siblings, siblings[1:]):
            sibling_rp.append(RelatedProject.objects.create(
                project=left,
                related_project=right,
                relation=RelatedProject.PROJECT_RELATION_SIBLING
            ))
        # One parent in the group
        last_sibling = siblings[-1]
        last_sibling.set_parent(parent)
        last_sibling.save()

        migrate_siblings()

        self.assertEqual(len(parent.descendants()), sibling_count)
