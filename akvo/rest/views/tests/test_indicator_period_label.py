from akvo.rsr.models import Project
from akvo.rsr.models.result.tests.factory import IndicatorPeriodLabelFactory
from akvo.rsr.tests.base import BaseTestCase


class ProjectPeriodLabelsTests(BaseTestCase):

    def get(self, project_pk: int):
        return self.c.get(f'/rest/v1/project/{project_pk}/period-labels/', HTTP_ACCEPT='application/json')

    def assertHasLabels(self, project: Project, label_count: int):
        result = self.get(project.pk)

        self.assertEqual(result.status_code, 200, msg=f"Couldn't get labels of {project}")

        result_labels = result.json().get("period_labels")
        self.assertEqual(
            len(result_labels), label_count,
            msg=f"Project {project} doesn't have {label_count} labels",
        )

    def test_missing_project(self):
        self.assertEqual(self.get(19191).status_code, 404)

    def test_no_period_labels(self):
        self.assertHasLabels(Project.objects.create(), 0)

    def test_project_with_period_labels(self):
        project = Project.objects.create()

        label_count = 10
        IndicatorPeriodLabelFactory.create_batch(label_count, project=project)
        self.assertHasLabels(project, label_count)

    def test_hierarchy_with_period_labels(self):
        # simple hierarchy program -> project -> child
        program = Project.objects.create(title="Program")
        project = Project.objects.create(title="Project")
        child = Project.objects.create(title="Child")
        project.set_parent(program).save()
        child.set_parent(project).save()

        label_count = 10
        IndicatorPeriodLabelFactory.create_batch(label_count, project=program)
        # Children of the program should have the labels of the program
        self.assertHasLabels(project, label_count)
        self.assertHasLabels(child, label_count)
