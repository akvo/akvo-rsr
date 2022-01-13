from akvo.rsr.models import ProjectEditorValidation, ProjectEditorValidationSet
from akvo.rsr.tests.base import BaseTestCase


class ProjectValidationFixtures(BaseTestCase):
    """
    The project validation fixtures have to exist so that the dev env
    can use validation sets and their validations.
    Without it, the frontend simply displays them, but can't use them.

    We check if they can still be loaded: the loaddate command might not fail
     when the DB schema changes (migrations)
    """
    fixtures = ["project_validations.yaml"]

    def test_load(self):
        self.assertNotEqual(ProjectEditorValidationSet.objects.all().count(), 0)
        self.assertNotEqual(ProjectEditorValidation.objects.all().count(), 0)
