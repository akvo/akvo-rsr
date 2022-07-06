# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json
from django.core import mail
from django.test import override_settings
from akvo.rsr.tests.base import BaseTestCase


class DemoRequestTestCase(BaseTestCase):
    def get_csrf_token(self):
        response = self.c.get('/auth/csrf-token/')
        return response.client.cookies['csrftoken'].value

    def post_request(self, data):
        csrftoken = self.get_csrf_token()
        return self.c.post('/rest/v1/demo_request', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

    def test_required_fields(self):
        response = self.post_request({})
        self.assertEqual(400, response.status_code)
        data = response.data
        self.assertEqual({
            ('first_name', 'This field is required.'),
            ('last_name', 'This field is required.'),
            ('email', 'This field is required.'),
            ('akvo_hub', 'This field is required.'),
            ('message', 'This field is required.')
        }, {(field, str(error)) for field, errors in data.items() for error in errors})

    def test_blank_fields(self):
        response = self.post_request({
            'first_name': '',
            'last_name': '',
            'email': '',
            'phone': '',
            'akvo_hub': '',
            'message': ''
        })
        self.assertEqual(400, response.status_code)
        data = response.data
        self.assertEqual({
            ('first_name', 'This field may not be blank.'),
            ('last_name', 'This field may not be blank.'),
            ('email', 'This field may not be blank.'),
            ('akvo_hub', 'This field may not be blank.'),
            ('message', 'This field may not be blank.')
        }, {(field, str(error)) for field, errors in data.items() for error in errors})

    def test_invalid_email_address(self):
        response = self.post_request({
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe-example.com',
            'akvo_hub': 'Akvo Asia',
            'message': 'I need to learn more about RSR'
        })
        self.assertEqual(400, response.status_code)
        data = response.data
        self.assertEqual({
            ('email', 'Enter a valid email address.'),
        }, {(field, str(error)) for field, errors in data.items() for error in errors})

    def test_sent_mail(self):
        recipient = ['admin@akvo.org']
        payload = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe@example.com',
            'phone': '123456789',
            'akvo_hub': 'Akvo Asia',
            'message': 'I need to learn more about RSR'
        }
        with override_settings(RSR_DEMO_REQUEST_TO_EMAILS=recipient):
            response = self.post_request(payload)
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(mail.outbox))
        msg = mail.outbox[0]
        self.assertEqual(recipient, msg.to)
        self.assertIn(payload['first_name'], msg.body)
        self.assertIn(payload['last_name'], msg.body)
        self.assertIn(payload['email'], msg.body)
        self.assertIn(payload['email'], msg.body)
        self.assertIn(payload['akvo_hub'], msg.body)
        self.assertIn(payload['message'], msg.body)
