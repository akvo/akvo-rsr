from django.db import models
from django.test import TestCase
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory

from akvo.rest.filters import RSRGenericFilterBackend
from akvo.rsr.models import ProjectUpdate


class TestRSRGenericFilterBackend(TestCase):

    def test_filter_queryset(self):
        factory = APIRequestFactory()
        request = Request(factory.get(
            reverse("project_update-list", kwargs={"version": "v1"}),
            data={
                "filter": '{"project__partnerships__in":[43]}'
            }
        ))
        backend = RSRGenericFilterBackend()
        queryset = backend.filter_queryset(request, ProjectUpdate.objects.all(), None)
        self.assertIsInstance(queryset, models.QuerySet)
        self.assertEqual(queryset.model, ProjectUpdate)

    def test_filter_queryset__bad_filter(self):
        factory = APIRequestFactory()
        request = Request(factory.get(
            reverse("project_update-list", kwargs={"version": "v1"}),
            data={
                "filter": 'very bad python'
            }
        ))
        backend = RSRGenericFilterBackend()
        self.assertRaises(
            APIException,
            backend.filter_queryset,
            request, ProjectUpdate.objects.all(), None
        )
