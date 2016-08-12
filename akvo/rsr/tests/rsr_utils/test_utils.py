# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import User, Project, Invoice, Country, Keyword, Sector
from akvo.codelists.models import Sector as CodelistSector
from akvo.utils import (rsr_send_mail_to_users, model_and_instance_based_filename,
                        send_donation_confirmation_emails, who_am_i, who_is_parent, to_gmt,
                        custom_get_or_create_country, right_now_in_akvo, rsr_show_keywords,
                        pagination, filter_query_string, codelist_name, )

from django.core import mail
from django.http.request import QueryDict
from django.test import TestCase

import datetime, pytz


class GeneralUtilsTestCase(TestCase):
    """Tests the RSR's utils."""

    def setUp(self):
        """
        A user and a project are needed in most of these tests.
        """
        self.user = User.objects.create_superuser(
            username="Utils user",
            email="test.utils@test.akvo.org",
            password="password",
        )
        self.project = Project.objects.create()

    def test_rsr_send_mail_to_users(self):
        """
        Checks sending a test mail to RSR users.
        """
        rsr_send_mail_to_users([self.user])

        # Test that the mail is in the outbox.
        self.assertIn("Test subject", [sent_mail.subject for sent_mail in mail.outbox])

    def test_create_filename(self):
        """
        Create a file name for an image based on the model name, the current object's pk, the
        field name of the model and the current date and time.
        """
        filename = model_and_instance_based_filename('objectname', 1, 'fieldname', 'imgname.jpg')
        filename_list = filename.split('_')

        # Test that the filename contains the correct parts
        self.assertIn('objectname', filename_list)
        self.assertIn('1', filename_list)
        self.assertIn('fieldname', filename_list)
        self.assertEqual('.jpg', filename[-4:])

    def test_send_donation_confirmation_emails(self):
        """
        Test sending a confirmation email for donations.
        """
        invoice = Invoice.objects.create(
            test=True,
            user=self.user,
            project=self.project,
            amount=50,
        )
        send_donation_confirmation_emails(invoice)

        # Test that the mail is in the outbox.
        self.assertIn("Thank you from Akvo.org!", [sent_mail.subject for sent_mail in mail.outbox])

    def test_inspection_definitions(self):
        """
        Tests for inspecting definitions.
        """
        this_definition = who_am_i()
        parent_definition = who_is_parent()
        self.assertEqual(this_definition, "test_inspection_definitions")
        self.assertEqual(parent_definition, "run")

    def test_to_gmt(self):
        """
        Test for converting to GMT.
        """
        gmt = pytz.timezone('GMT')
        current_datetime = datetime.datetime.now(tz=gmt)
        gmt_datetime = to_gmt(current_datetime)
        self.assertEqual(current_datetime, gmt_datetime)

    def test_get_country(self):
        """
        Test for getting or creating a country.
        """
        country = custom_get_or_create_country('NL')
        self.assertIsInstance(country, Country)

        # Try again for existing country
        country = custom_get_or_create_country('NL')
        self.assertIsInstance(country, Country)

    def test_right_now_in_akvo(self):
        """
        Testing the right_now_in_akvo definition.
        """
        keys = ['number_of_organisations', 'number_of_projects', 'people_served',
                'projects_budget_millions', 'number_of_project_updates', ]

        right_now = right_now_in_akvo()
        for key in keys:
            self.assertIn(key, right_now)

    def test_keywords_display(self):
        """
        Test the display of keywords.
        """
        no_keyword = rsr_show_keywords(self.project)
        self.assertEqual(no_keyword, 'None')

        keyword, _created = Keyword.objects.get_or_create(label='A keyword')
        self.project.keywords.add(keyword)
        with_keyword = rsr_show_keywords(self.project)
        self.assertIn('<ul>', with_keyword)
        self.assertIn('<li>', with_keyword)
        self.assertIn('A keyword', with_keyword)

    def test_pagination(self):
        """
        Test the pagination.
        """
        page, paginator, page_range = pagination(1000, Project.objects.all(), 10)
        self.assertEqual(page.number, paginator.num_pages)

        for num in range(0, 10):
            Project.objects.create()

        page, paginator, page_range = pagination(5, Project.objects.all(), 1)
        self.assertEqual(page.number, 5)

    def test_filter_query_string(self):
        """
        Test the filter query string definition.
        """
        test_dict = {'test': '1'}
        query_dict = QueryDict('', mutable=True)
        query_dict.update(test_dict)
        new_query_string = filter_query_string(query_dict)
        self.assertEqual(new_query_string, '&test=1')

    def test_codelist_name(self):
        """
        Test retrieving a codelist name.
        """
        sector = Sector.objects.create(project=self.project, sector_code='140')
        name = codelist_name(CodelistSector, sector, 'sector_code', version='16')
        self.assertEqual(name, '140')
