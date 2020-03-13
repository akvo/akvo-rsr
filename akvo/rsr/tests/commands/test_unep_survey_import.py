# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from os.path import abspath, dirname, join

from django.core import management

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Organisation, Project

HERE = dirname(abspath(__file__))
TEST_CSV = join(HERE, 'unep-sample-survey-test.csv')


class UnepSurveyImportTestCase(BaseTestCase):

    def test_fresh_unep_survey_import_works(self):

        # When
        management.call_command('unep_survey_import', TEST_CSV)

        # Then
        self.assertEqual(4, Project.objects.all().count())
        unep = Organisation.objects.get(name='UNEP')
        self.assertEqual(4, unep.all_projects().count())
        title = 'Funded Project: Unpackaging Alameda'
        project = Project.objects.get(title=title)

        # # Test quetion 9
        field_name = "TYPE OF ACTION: What did the MAIN action/activity focus on? (Please tick ONE which best describes the action you are reporting)."
        custom_field = project.custom_fields.get(name=field_name)
        self.assertEqual(len(custom_field.dropdown_selection), 1)
        selection = custom_field.dropdown_selection[0]
        self.assertEqual(selection['name'],
                         ('WORKING WITH PEOPLE: Encouraging or enabling others '
                          '(e.g., education, training, communication, awareness raising, '
                          'behaviour change programmes'))
        self.assertEqual(len(selection['options']), 2)
        awareness, education = selection['options']
        self.assertEqual(len(awareness['options']), 3)
        self.assertEqual(
            {option['name'] for option in awareness['options']},
            {'Behaviour change campaign/programme',
             'Community Engagement',
             'Stakeholder Engagement'})
        self.assertEqual(len(education['options']), 1)
        self.assertEqual(
            education['options'][0]['extra_text'],
            'Technical assistance to restaurant owners')

        # # Test quetion 12
        field_name = 'Who is responsible for the action implementation?'
        custom_field = project.custom_fields.get(name=field_name)
        self.assertEqual(len(custom_field.dropdown_selection), 2)
        private_sector, third_sector = custom_field.dropdown_selection
        self.assertTrue(private_sector['name'].startswith('PRIVATE SECTOR ORGANISATION'))
        self.assertEqual(len(private_sector['options']), 1)
        self.assertEqual(private_sector['options'][0]['name'], 'Small-medium sized enterprise')
        self.assertTrue(third_sector['name'].startswith('THIRD SECTOR'))
        self.assertEqual(third_sector['options'][0]['name'], 'Non-governmental organisation')
