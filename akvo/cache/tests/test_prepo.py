import unittest

from django.test import SimpleTestCase

from akvo.cache.prepo import QuerysetPrePo, QuerysetReduction
from akvo.rsr.models import Project


class QuerysetPrePotest(SimpleTestCase):

    def test_reduce(self):
        reduction = QuerysetPrePo.reduce(Project.objects.all())
        self.assertEqual(reduction.model_name, "akvo.rsr.models.project.Project")

    def test_expand(self):
        queryset = Project.objects.filter(title="title").distinct()
        expanded_queryset = QuerysetPrePo.expand(QuerysetReduction(
            "akvo.rsr.models.project.Project",
            queryset.query
        ))
        self.assertEqual(expanded_queryset.model, queryset.model)


if __name__ == '__main__':
    unittest.main()
