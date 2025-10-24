# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import requests
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def places_search(request):
    """Proxy endpoint for Google Places API search."""
    input_text = request.GET.get('input')
    if not input_text:
        return Response({'error': 'Missing input'}, status=status.HTTP_400_BAD_REQUEST)

    # Call Google Places API
    google_api_url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    params = {
        'input': input_text,
        'types': '(regions)',
        'key': settings.GOOGLE_MAPS_API_KEY
    }

    response = requests.get(google_api_url, params=params)
    return Response(response.json(), status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def geocode(request):
    """Proxy endpoint for Google Geocoding API."""
    place_id = request.GET.get('place_id')
    if not place_id:
        return Response({'error': 'Missing place_id'}, status=status.HTTP_400_BAD_REQUEST)

    # Call Google Geocoding API
    google_api_url = 'https://maps.googleapis.com/maps/api/geocode/json'
    params = {
        'place_id': place_id,
        'key': settings.GOOGLE_MAPS_API_KEY
    }

    response = requests.get(google_api_url, params=params)
    return Response(response.json(), status=status.HTTP_200_OK)
