# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import User, Project, Country, Keyword, Sector
from akvo.codelists.models import Sector as CodelistSector
from akvo.utils import (rsr_send_mail_to_users, model_and_instance_based_filename,
                        who_am_i, who_is_parent, to_gmt, rsr_show_keywords,
                        custom_get_or_create_country, right_now_in_akvo,
                        pagination, filter_query_string, codelist_name,
                        codelist_choices, single_period_dates, get_placeholder_thumbnail)

from django.core import mail
from django.http.request import QueryDict
from django.test import TestCase

import datetime
import pytz


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
        Country.objects.all().delete()
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

    def test_codelist_choices_true(self):
        """
        Test calling codelist_choices(<codelist>, True)
        """
        # snippet of FINANCE_TYPE codelist
        codelist_1 = (
            (u"code", u"name", u"description"),
            (u"1", u"Global", u"The activity scope is global"),
            (u"2", u"Regional", u"The activity scope is a supranational region"),
            (u"3", u"Multi-national",
             u"The activity scope covers multiple countries, that don't constitute a region"),
            (u"4", u"National", u"The activity scope covers one country"),
        )
        choices_with_code_1 = [
            (u"1", u"1 - Global",),
            (u"2", u"2 - Regional",),
            (u"3", u"3 - Multi-national",),
            (u"4", u"4 - National",),
        ]
        codelist_2 = (
            (u"category", u"code", u"name"),
            (u"100", u"110", u"Standard grant"),
            (u"100", u"111", u"Subsidies to national private investors"),
            (u"100", u"210", u"Interest subsidy"),
            (u"200", u"211", u"Interest subsidy to national private exporters"),
        )
        choices_with_code_2 = [
            (u"110", u"110 - Standard grant"),
            (u"111", u"111 - Subsidies to national private investors"),
            (u"210", u"210 - Interest subsidy"),
            (u"211", u"211 - Interest subsidy to national private exporters"),
        ]
        generated_choices_with_code_1 = codelist_choices(codelist_1)
        self.assertEqual(choices_with_code_1, generated_choices_with_code_1)
        generated_choices_with_code_2 = codelist_choices(codelist_2)
        self.assertEqual(choices_with_code_2, generated_choices_with_code_2)

    def test_codelist_choices_false(self):
        """
        Test calling codelist_choices(<codelist>, False)
        """
        # snippet of FINANCE_TYPE codelist
        codelist_1 = (
            (u"code", u"name", u"description"),
            (u"1", u"Global", u"The activity scope is global"),
            (u"2", u"Regional", u"The activity scope is a supranational region"),
            (u"3", u"Multi-national",
             u"The activity scope covers multiple countries, that don't constitute a region"),
            (u"4", u"National", u"The activity scope covers one country"),
        )
        choices_1 = [
            (u"1", u"Global",),
            (u"2", u"Regional",),
            (u"3", u"Multi-national",),
            (u"4", u"National",),
        ]
        codelist_2 = (
            (u"category", u"code", u"name"),
            (u"100", u"110", u"Standard grant"),
            (u"100", u"111", u"Subsidies to national private investors"),
            (u"100", u"210", u"Interest subsidy"),
            (u"200", u"211", u"Interest subsidy to national private exporters"),
        )
        choices_2 = [
            (u"110", u"Standard grant"),
            (u"111", u"Subsidies to national private investors"),
            (u"210", u"Interest subsidy"),
            (u"211", u"Interest subsidy to national private exporters"),
        ]
        codelist_3 = (
            (u"category", u"code"),
            (u"application", u"application/1d-interleaved-parityfec"),
            (u"application", u"application/3gpdash-qoe-report+xml"),
            (u"application", u"application/3gpp-ims+xml"),
            (u"application", u"application/A2L"),
        )
        choices_with_code_3 = [
            (u"application/1d-interleaved-parityfec", u"application/1d-interleaved-parityfec"),
            (u"application/3gpdash-qoe-report+xml", u"application/3gpdash-qoe-report+xml"),
            (u"application/3gpp-ims+xml", u"application/3gpp-ims+xml"),
            (u"application/A2L", u"application/A2L"),
        ]
        generated_choices_1 = codelist_choices(codelist_1, False)
        self.assertEqual(choices_1, generated_choices_1)
        generated_choices_2 = codelist_choices(codelist_2, False)
        self.assertEqual(choices_2, generated_choices_2)
        generated_choices_with_code_3 = codelist_choices(codelist_3)
        self.assertEqual(choices_with_code_3, generated_choices_with_code_3)

    def test_single_period_dates(self):
        timeout, start, end = single_period_dates('EUTF')
        self.assertEqual(timeout, 90)
        self.assertEqual(start, datetime.date(2015, 01, 01))
        self.assertEqual(end, datetime.date(2025, 12, 31))
        timeout, start, end = single_period_dates('Wrong name')
        self.assertEqual(timeout, None)
        self.assertEqual(start, None)
        self.assertEqual(end, None)

    def test_placeholder_thumbnail_w_x_h(self):
        """Test for the placeholder thumbnail with both width and height."""

        # Given
        geometry_string = '350x150'
        image_path = '/media/db/test.img'

        # When
        url = get_placeholder_thumbnail(image_path, geometry_string)

        # Then
        self.assertEqual('//placehold.it/350x150', url.url)

    def test_placeholder_thumbnail_w_only(self):
        """Test for the placeholder thumbnail with only width."""

        # Given
        geometry_string = '350'
        image_path = '/media/db/test.img'

        # When
        url = get_placeholder_thumbnail(image_path, geometry_string)

        # Then
        self.assertEqual('//placehold.it/350x350', url.url)

    def test_placeholder_thumbnail_h_only(self):
        """Test for the placeholder thumbnail with only height."""

        # Given
        geometry_string = 'x150'
        image_path = '/media/db/test.img'

        # When
        url = get_placeholder_thumbnail(image_path, geometry_string)

        # Then
        self.assertEqual('//placehold.it/150x150', url.url)
