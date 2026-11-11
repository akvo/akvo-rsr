import os
from decimal import Decimal

# Force a headless backend before matplotlib is imported via the report module.
os.environ.setdefault("MPLBACKEND", "Agg")

from django.test import SimpleTestCase

from akvo.rsr.views.py_reports.project_overview_pdf_report import get_funders_chart


class GetFundersChartTestCase(SimpleTestCase):
    """Regression tests for the project overview funders chart.

    numpy >= 2 refuses np.isfinite() on Decimal/object arrays, which
    matplotlib's pie() calls internally. Funder amounts are Decimal
    (ensure_decimal), so the chart must cast them to float or every
    project overview report returns a 500.
    """

    def test_renders_with_decimal_amounts(self):
        funding_partners = [
            {"amount": Decimal("100.00"), "color": "#fcab26"},
            {"amount": Decimal("250.50"), "color": "#fdc158"},
            {"amount": Decimal("350.50"), "color": "#fed98a"},
        ]
        image = get_funders_chart(funding_partners)
        self.assertIsInstance(image, str)
        self.assertGreater(len(image), 0)

    def test_renders_with_none_amount(self):
        funding_partners = [
            {"amount": Decimal("100.00"), "color": "#fcab26"},
            {"amount": None, "color": "#fdc158"},
            {"amount": Decimal("350.50"), "color": "#fed98a"},
        ]
        image = get_funders_chart(funding_partners)
        self.assertIsInstance(image, str)
        self.assertGreater(len(image), 0)

    def test_renders_with_no_partners(self):
        image = get_funders_chart([])
        self.assertIsInstance(image, str)
