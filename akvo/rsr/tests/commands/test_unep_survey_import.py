# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from os.path import abspath, dirname, join

from django.core import management

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Organisation, Project, ProjectCustomField

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
        field_name = "Type of action"
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

        # # Test question 9, monitoring and analysis inputs
        urn = '545728-545719-54334516'
        other_project = Project.objects.get(custom_fields__value__in=[urn])
        custom_field = other_project.custom_fields.get(name=field_name)
        self.assertEqual(len(custom_field.dropdown_selection), 1)
        selection = custom_field.dropdown_selection[0]
        self.assertEqual(selection['name'],
                         ('MONITORING and ANALYSIS: Collecting evidence around plastic '
                          'discharge to the ocean/waterways? (e.g. monitoring, analysis)'))
        self.assertEqual(len(selection['options']), 4)
        self.assertEqual(
            {option['name'] for option in selection['options']},
            {'Monitoring: On or near ocean surface',
             'Monitoring: On the shoreline',
             'Monitoring: In Biota',
             'Review and synthesis :Environmental'})
        field_name = "For monitoring in Biota, which programme/protocol did you use?"
        custom_field = other_project.custom_fields.get(name=field_name)
        self.assertEqual(custom_field.value, 'own programme/protocol')

        # # Test quetion 12
        field_name = 'Responsible actor'
        custom_field = project.custom_fields.get(name=field_name)
        self.assertEqual(len(custom_field.dropdown_selection), 2)
        private_sector, third_sector = custom_field.dropdown_selection
        self.assertTrue(private_sector['name'].startswith('PRIVATE SECTOR ORGANISATION'))
        self.assertEqual(len(private_sector['options']), 1)
        self.assertEqual(private_sector['options'][0]['name'], 'Small-medium sized enterprise')
        self.assertTrue(third_sector['name'].startswith('THIRD SECTOR'))
        self.assertEqual(third_sector['options'][0]['name'], 'Non-governmental organisation')

        # # Test question 12 other field
        urn = '545728-545719-54478964'
        other_project = Project.objects.get(custom_fields__value__in=[urn])
        custom_field = other_project.custom_fields.get(name=field_name)
        self.assertEqual(len(custom_field.dropdown_selection), 1)
        other_selection, = custom_field.dropdown_selection
        self.assertEqual(other_selection['extra_text'], 'Fourth Sector')

    def test_reimport_correctly_updates_projects(self):
        # Given
        management.call_command('unep_survey_import', TEST_CSV)
        project_count = Project.objects.count()
        project = Project.objects.first()
        old_title = project.title
        custom_field_name = 'Please specify the currency.'
        custom_field = ProjectCustomField.objects.get(name=custom_field_name, project=project)
        old_custom_field_value = custom_field.value
        dropdown_field_name = 'Funding'
        dropdown_field = ProjectCustomField.objects.get(name=dropdown_field_name, project=project)
        old_dropdown_value = dropdown_field.dropdown_selection

        # When
        project.title = 'Test Project'
        project.save(update_fields=['title'])
        custom_field.value = 'Indian Rupee'
        custom_field.save(update_fields=['value'])
        dropdown_field.dropdown_selection = [{'name': 'Crowdfunded'}]
        dropdown_field.save(update_fields=['dropdown_selection'])
        management.call_command('unep_survey_import', TEST_CSV)

        # Then
        self.assertEqual(Project.objects.count(), project_count)
        project.refresh_from_db()
        custom_field = ProjectCustomField.objects.get(project=project, name=custom_field_name)
        dropdown_field = ProjectCustomField.objects.get(name=dropdown_field_name, project=project)
        self.assertEqual(project.title, old_title)
        self.assertEqual(custom_field.value, old_custom_field_value)
        self.assertEqual(dropdown_field.dropdown_selection, old_dropdown_value)
