# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from unittest.mock import patch, Mock

from akvo.rsr.tests.base import BaseTestCase


class GoogleMapsProxyTestCase(BaseTestCase):
    """Test Google Maps proxy endpoints."""

    def setUp(self):
        """Set up test fixtures."""
        super().setUp()
        self.user = self.create_user('test@example.com', 'password')

    def test_places_search_requires_authentication(self):
        """Test that places search endpoint requires authentication."""
        response = self.c.get('/rest/v1/places/search')
        self.assertEqual(response.status_code, 403)

    def test_places_search_requires_input_parameter(self):
        """Test that places search requires input parameter."""
        self.c.login(username='test@example.com', password='password')
        response = self.c.get('/rest/v1/places/search')
        self.assertEqual(response.status_code, 400)

    @patch('requests.get')
    def test_places_search_success(self, mock_get):
        """Test successful places search request."""
        # Mock Google API response
        mock_response = Mock()
        mock_response.json.return_value = {
            'predictions': [
                {
                    'description': 'Amsterdam, Netherlands',
                    'place_id': 'ChIJVXealLU_xkcRja_At0z9AGY'
                }
            ],
            'status': 'OK'
        }
        mock_get.return_value = mock_response

        self.c.login(username='test@example.com', password='password')
        response = self.c.get('/rest/v1/places/search', {'input': 'Amsterdam', 'format': 'json'})

        self.assertEqual(response.status_code, 200)
        self.assertIn('predictions', response.data)
        self.assertEqual(len(response.data['predictions']), 1)
        self.assertEqual(response.data['predictions'][0]['description'], 'Amsterdam, Netherlands')

    def test_geocode_requires_authentication(self):
        """Test that geocode endpoint requires authentication."""
        response = self.c.get('/rest/v1/places/geocode')
        self.assertEqual(response.status_code, 403)

    def test_geocode_requires_place_id_parameter(self):
        """Test that geocode requires place_id parameter."""
        self.c.login(username='test@example.com', password='password')
        response = self.c.get('/rest/v1/places/geocode')
        self.assertEqual(response.status_code, 400)

    @patch('requests.get')
    def test_geocode_success(self, mock_get):
        """Test successful geocode request."""
        # Mock Google API response
        mock_response = Mock()
        mock_response.json.return_value = {
            'results': [
                {
                    'geometry': {
                        'location': {
                            'lat': 52.3675734,
                            'lng': 4.9041389
                        }
                    },
                    'address_components': [
                        {
                            'long_name': 'Netherlands',
                            'short_name': 'NL',
                            'types': ['country', 'political']
                        }
                    ]
                }
            ],
            'status': 'OK'
        }
        mock_get.return_value = mock_response

        self.c.login(username='test@example.com', password='password')
        response = self.c.get('/rest/v1/places/geocode', {
            'place_id': 'ChIJVXealLU_xkcRja_At0z9AGY',
            'format': 'json'
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['geometry']['location']['lat'], 52.3675734)
