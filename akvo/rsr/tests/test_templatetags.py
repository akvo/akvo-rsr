# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.contrib.staticfiles.finders import FileSystemFinder

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import ProjectEditorValidation, ProjectEditorValidationSet
from akvo.rsr.templatetags.project_editor import mandatory_or_hidden, invalidate_validation_cache
from akvo.rsr.templatetags import maps


class TemplateTagsTestCase(BaseTestCase):
    """Tests for template tags."""

    @classmethod
    def setUpClass(cls):
        cls.tearDownClass()
        MANDATORY = ProjectEditorValidation.MANDATORY_ACTION
        HIDDEN = ProjectEditorValidation.HIDDEN_ACTION
        validation1 = [
            ('rsr_project.title', MANDATORY),
            ('rsr_project.subtitle', MANDATORY),
            ('rsr_project.date_start_planned||rsr_project.date_start_actual', MANDATORY),
            ('rsr_project.current_image', MANDATORY),
            ('rsr_project.current_image||rsr_project.test_image', MANDATORY),
            ('rsr_partnership', MANDATORY),
            ('rsr_partnership.organisation', MANDATORY),
            ('rsr_partnership.iati_organisation_role', MANDATORY),
            ('rsr_project.iati_activity_id', HIDDEN),
            ('rsr_project.hierarchy', HIDDEN),
            ('rsr_transaction', HIDDEN),
            ('rsr_planneddisbursement', HIDDEN),
        ]

        validation2 = [
            ('rsr_project.title', MANDATORY),
            ('rsr_project.iati_activity_id', MANDATORY),
            ('rsr_project.date_start_planned||rsr_project.date_start_actual', MANDATORY),
            ('rsr_partnership', MANDATORY),
            ('rsr_partnership.organisation', MANDATORY),
            ('rsr_partnership.iati_organisation_role', MANDATORY),
            ('rsr_transaction.transaction_type', MANDATORY),
            ('rsr_transaction.transaction_date', MANDATORY),
            ('rsr_transaction.value', MANDATORY),
            ('rsr_transaction.value_date', MANDATORY),
            ('rsr_projectdocument.url||rsr_projectdocument.document', MANDATORY),
            ('rsr_planneddisbursement.value', MANDATORY),
            ('rsr_planneddisbursement.period_start', MANDATORY),
            ('rsr_planneddisbursement.period_end', MANDATORY),
            ('rsr_planneddisbursement.value_date', MANDATORY)
        ]

        for i, validations in enumerate([validation1, validation2], start=1):
            validation_set = ProjectEditorValidationSet.objects.create(name='validation-{}'.format(i))
            setattr(cls, 'validation{}'.format(i), validation_set)
            for validation, action in validations:
                ProjectEditorValidation.objects.create(
                    validation=validation,
                    action=action,
                    validation_set=validation_set,
                )

        cls.validations = ProjectEditorValidation.objects.all()
        id_1, id_2 = ProjectEditorValidationSet.objects.values_list('id', flat=True)
        cls.ids = {'id_1': id_1, 'id_2': id_2}

    @classmethod
    def tearDownClass(cls):
        ProjectEditorValidation.objects.all().delete()
        ProjectEditorValidationSet.objects.all().delete()
        cls.validations = None
        invalidate_validation_cache()

    def _indications(self, field):
        return mandatory_or_hidden(self.validations, field).strip()

    def assertIndications(self, field, expected_indications):
        self.assertEqual(self._indications(field), expected_indications)

    def test_current_image_field(self):
        field = 'rsr_project.current_image.2'
        expected_indications = (
            'mandatory-{id_1} mandatory-{id_1} mandatory-{id_1}-or-test_image'.format(**self.ids)
        )
        self.assertIndications(field, expected_indications)

    def test_current_image(self):
        field = 'rsr_project.current_image'
        expected_indications = ''
        self.assertIndications(field, expected_indications)

    def test_title(self):
        field = 'rsr_project.title.2'
        expected_indications = 'mandatory-{id_1} mandatory-{id_2}'.format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_date_start(self):
        field = 'rsr_project.date_start_planned.2'
        expected_indications = (
            'mandatory-{id_1} mandatory-{id_1}-or-date_start_actual '
            'mandatory-{id_2} mandatory-{id_2}-or-date_start_actual'
        ).format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_partnership_iati_organisation_role(self):
        field = 'rsr_partnership.iati_organisation_role.1099'
        expected_indications = 'mandatory-{id_1} mandatory-{id_2}'.format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_transaction_type(self):
        field = 'rsr_transaction.transaction_type.11'
        expected_indications = 'mandatory-{id_2}'.format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_projectdocument_url(self):
        field = 'rsr_projectdocument.url.2_new-0'
        expected_indications = 'mandatory-{id_2} mandatory-{id_2}-or-document'.format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_planned_disbursement_currency(self):
        field = 'rsr_planneddisbursement.currency.2_new-0'
        expected_indications = ''
        self.assertIndications(field, expected_indications)

    def test_planned_disbursement_value(self):
        field = 'rsr_planneddisbursement.value.2_new-0'
        expected_indications = 'mandatory-{id_2}'.format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_subtitle(self):
        field = 'rsr_project.subtitle.2'
        expected_indications = 'mandatory-{id_1}'.format(**self.ids)
        self.assertIndications(field, expected_indications)

    def test_update_subtitle_validation(self):
        # Given
        field = 'rsr_project.subtitle.2'
        ProjectEditorValidation.objects.create(
            validation='rsr_project.subtitle',
            action=1,
            validation_set=self.validation2
        )
        expected_indications = 'mandatory-{id_1} mandatory-{id_2}'.format(**self.ids)
        self.assertIndications(field, expected_indications)


class MapsTestCase(BaseTestCase):
    """Test case for the maps templatetags"""

    def test_maps_markers_exist(self):
        # Given
        icons = [
            getattr(maps, attr) for attr in dir(maps) if attr.endswith('_ICON')
        ]
        finder = FileSystemFinder()
        relative_paths = [
            icon.lstrip(settings.STATIC_URL) for icon in icons
        ]

        # When
        absolute_paths = [finder.find(path) for path in relative_paths]

        # Then
        for path in absolute_paths:
            self.assertTrue(path)
