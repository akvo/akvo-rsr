# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import User, Project, Invoice
from akvo.utils import (rsr_send_mail_to_users, model_and_instance_based_filename,
                        send_donation_confirmation_emails, who_am_i, who_is_parent, to_gmt, )

from django.core import mail
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
        send_donation_confirmation_emails(invoice.pk)

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
