from parameterized import parameterized
from django.conf import settings
from akvo.iati.checks.fields.sectors import sectors as sectors_checks, VOCABULARY_CODE_MODEL_MAP
from akvo.rsr.models import Sector
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import random_string


class IatiCheckSectorVocabularyCodeTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project = self.create_project("Test project")

    def get_first_vocabulary_code(self, vocabulary, version=settings.IATI_VERSION):
        model = VOCABULARY_CODE_MODEL_MAP[vocabulary]
        objects = getattr(model, 'objects')
        return objects.filter(version__code=version).first().code

    @parameterized.expand([('1'), ('2'), ('7'), ('8')])
    def test_vocabulary_code_invalid(self, vocabulary):
        Sector.objects.create(
            project=self.project,
            vocabulary=vocabulary,
            sector_code=random_string(),
        )

        all_checks_passed, checks = sectors_checks(self.project)

        self.assertFalse(all_checks_passed)
        self.assertEqual('error', checks[0][0])
        self.assertIn('has invalid sector code', checks[0][1])

    @parameterized.expand([('1'), ('2'), ('7'), ('8')])
    def test_vocabulary_code_valid(self, vocabulary):
        code = self.get_first_vocabulary_code(vocabulary)
        Sector.objects.create(
            project=self.project,
            vocabulary=vocabulary,
            sector_code=code,
        )

        all_checks_passed, _ = sectors_checks(self.project)

        self.assertTrue(all_checks_passed)

    @parameterized.expand([('3'), ('4'), ('5'), ('6'), ('9'), ('10'), ('11'), ('98'), ('99')])
    def test_other_vocabulary(self, vocabulary):
        Sector.objects.create(
            project=self.project,
            vocabulary=vocabulary,
            sector_code=random_string(),
        )
        all_checks_passed, _ = sectors_checks(self.project)

        self.assertTrue(all_checks_passed)
