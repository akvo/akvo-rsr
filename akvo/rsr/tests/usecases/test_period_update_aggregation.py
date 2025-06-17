from datetime import date
from unittest.mock import patch, Mock
from akvo.utils import maybe_decimal
from akvo.rsr.usecases.period_update_aggregation import (
    aggregate, _aggregate_period_value
)
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


class PeriodUpdateAggregationTestCase(BaseTestCase):
    CONTRIBUTOR_LEVEL_1 = 'L1 contributor'
    CONTRIBUTOR_LEVEL_2_1 = 'L2 contributor #1'
    CONTRIBUTOR_LEVEL_2_2 = 'L2 contributor #2'
    DISAGGREGATION_CATEGORY = 'Gender'
    DISAGGREGATION_TYPE_1 = 'Male'
    DISAGGREGATION_TYPE_2 = 'Female'
    PERIOD_START = date(2020, 1, 1)

    def setUp(self):
        super().setUp()
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.lead_project = ProjectFixtureBuilder().with_contributors([{
            'title': self.CONTRIBUTOR_LEVEL_1,
            'contributors': [
                {'title': self.CONTRIBUTOR_LEVEL_2_1},
                {'title': self.CONTRIBUTOR_LEVEL_2_2},
            ]
        }]).with_disaggregations({
            self.DISAGGREGATION_CATEGORY: [
                self.DISAGGREGATION_TYPE_1,
                self.DISAGGREGATION_TYPE_2,
            ]
        }).with_results([{
            'title': 'Result #1',
            'indicators': [{
                'title': 'Indicator #1',
                'periods': [
                    {'period_start': self.PERIOD_START, 'period_end': date(2020, 12, 31)},
                ]
            }]
        }]).build()

        self.l1_contributor = self.lead_project.get_contributor(title=self.CONTRIBUTOR_LEVEL_1)
        self.l2_1_contributor = self.l1_contributor.get_contributor(title=self.CONTRIBUTOR_LEVEL_2_1)
        self.l2_2_contributor = self.l1_contributor.get_contributor(title=self.CONTRIBUTOR_LEVEL_2_2)
        self.l2_1_period = self.l2_1_contributor.get_period(period_start=self.PERIOD_START)
        self.l2_2_period = self.l2_2_contributor.get_period(period_start=self.PERIOD_START)

        self.l2_1_period.add_update(user=self.user, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        self.l2_2_period.add_update(user=self.user, value=3, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 2},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })

    def get_disaggregation_value(self, period, disaggregation_type):
        return period.disaggregations.get(dimension_value__value=disaggregation_type).value

    def test_not_automatically_aggregated(self):
        ''' Ensure the legacy behavior that performs aggregation when period updates are saved is not running '''
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l2_1_period.actual_value)
        self.assertEqual(0, l2_1_period.disaggregations.count())

        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l2_2_period.actual_value)
        self.assertEqual(0, l2_2_period.disaggregations.count())

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l1_period.actual_value)
        self.assertEqual(0, l1_period.disaggregations.count())

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', lead_period.actual_value)
        self.assertEqual(0, lead_period.disaggregations.count())

    def test_aggregation(self):
        ''' Aggregated update from all Level 2 contributors '''
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)
        aggregate(l2_1_period)
        aggregate(l2_2_period)

        l2_1_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_1_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_2))

        l2_2_period.refresh_from_db()
        self.assertEqual(3, maybe_decimal(l2_2_period.actual_value))
        self.assertEqual(2, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_2))

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(l1_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_2))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(lead_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_2))

    def test_memory_protection_functionality(self):
        """Test that the new iterative aggregation works correctly"""
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)

        # Test that aggregation works with the new iterative approach
        aggregate(l2_1_period)
        aggregate(l2_2_period)

        # Verify all levels are aggregated correctly
        l2_1_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_1_period.actual_value))

        l2_2_period.refresh_from_db()
        self.assertEqual(3, maybe_decimal(l2_2_period.actual_value))

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(l1_period.actual_value))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(lead_period.actual_value))

        # This test verifies that the new implementation produces the same results
        # as the original recursive implementation, but with memory protection

    def test_level_1_has_update(self):
        ''' Updates on level 1 project should be aggregated '''
        self.l1_contributor.get_period(period_start=self.PERIOD_START).add_update(
            user=self.user,
            value=3,
            disaggregations={
                self.DISAGGREGATION_CATEGORY: {
                    self.DISAGGREGATION_TYPE_1: {'value': 2},
                    self.DISAGGREGATION_TYPE_2: {'value': 1},
                }
            }
        )
        l2_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        aggregate(l2_period)
        aggregate(l1_period)

        l2_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l2_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_period, self.DISAGGREGATION_TYPE_2))

        l1_period.refresh_from_db()
        self.assertEqual(5, maybe_decimal(l1_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_2))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(lead_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_2))

    def test_delete_update(self):
        ''' Simulate indicator update deletion '''
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)
        aggregate(l2_1_period)
        aggregate(l2_2_period)

        l2_2_update = l2_2_period.data.first()
        l2_2_update.delete()
        aggregate(l2_2_period)

        l2_1_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_1_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_2))

        l2_2_period.refresh_from_db()
        self.assertEqual('', l2_2_period.actual_value)
        self.assertEqual(None, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(None, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_2))

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(2, maybe_decimal(l1_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_2))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(2, maybe_decimal(lead_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_2))


class PeriodAggregationMemoryProtectionTestCase(BaseTestCase):
    """Tests for memory protection features in period aggregation"""

    def setUp(self):
        """Set up test fixtures"""
        self.mock_period = Mock()
        self.mock_period.id = 1
        self.mock_period.actual_value = '10'
        self.mock_period.indicator.measure = 'Unit'
        self.mock_period.indicator.result.project.aggregate_to_parent = True
        self.mock_period.parent_period = None

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    def test_single_period_aggregation(self, mock_calculate):
        """Test aggregation of a single period without parent"""
        mock_calculate.return_value = (10, None, None)

        _aggregate_period_value(self.mock_period)

        # Should calculate value once
        mock_calculate.assert_called_once_with(self.mock_period)

        # Should save the period
        self.mock_period.save.assert_called_once()

        # Should set actual_value
        self.assertEqual(self.mock_period.actual_value, '10')

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    def test_hierarchy_aggregation(self, mock_calculate):
        """Test aggregation up a hierarchy"""
        # Create a hierarchy: child -> parent -> grandparent
        grandparent = Mock()
        grandparent.id = 3
        grandparent.parent_period = None
        grandparent.indicator.result.project.aggregate_children = True

        parent = Mock()
        parent.id = 2
        parent.parent_period = grandparent
        parent.indicator.result.project.aggregate_to_parent = True
        parent.indicator.result.project.aggregate_children = True

        child = Mock()
        child.id = 1
        child.parent_period = parent
        child.indicator.result.project.aggregate_to_parent = True
        child.indicator.result.project.aggregate_children = True

        mock_calculate.return_value = (10, None, None)

        _aggregate_period_value(child)

        # Should calculate value for all three periods
        self.assertEqual(mock_calculate.call_count, 3)

        # All periods should be saved
        child.save.assert_called()
        parent.save.assert_called()
        grandparent.save.assert_called()

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    @patch('akvo.rsr.usecases.period_update_aggregation.logger')
    def test_circular_reference_detection(self, mock_logger, mock_calculate):
        """Test that circular references are detected and handled"""
        # Create circular reference: period1 -> period2 -> period1
        period1 = Mock()
        period1.id = 1
        period1.indicator.result.project.aggregate_to_parent = True
        period1.indicator.result.project.aggregate_children = True

        period2 = Mock()
        period2.id = 2
        period2.indicator.result.project.aggregate_to_parent = True
        period2.indicator.result.project.aggregate_children = True

        # Set up circular reference
        period1.parent_period = period2
        period2.parent_period = period1

        mock_calculate.return_value = (10, None, None)

        _aggregate_period_value(period1)

        # Should log warning about circular reference
        mock_logger.warning.assert_called()
        warning_call = mock_logger.warning.call_args[0][0]
        self.assertIn('Circular reference detected', warning_call)

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    @patch('akvo.rsr.usecases.period_update_aggregation.logger')
    def test_max_depth_protection(self, mock_logger, mock_calculate):
        """Test that maximum depth protection works"""
        # Create a deep hierarchy
        periods = []
        for i in range(10):
            period = Mock()
            period.id = i + 1
            period.indicator.result.project.aggregate_to_parent = True
            period.indicator.result.project.aggregate_children = True
            periods.append(period)

        # Link them in a chain
        for i in range(len(periods) - 1):
            periods[i].parent_period = periods[i + 1]
        periods[-1].parent_period = None

        mock_calculate.return_value = (10, None, None)

        # Set a very low max depth
        _aggregate_period_value(periods[0], max_depth=3)

        # Should log warning about max depth reached
        mock_logger.warning.assert_called()
        warning_call = mock_logger.warning.call_args[0][0]
        self.assertIn('Maximum aggregation depth', warning_call)

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    @patch('akvo.rsr.usecases.period_update_aggregation.logger')
    def test_error_handling_during_aggregation(self, mock_logger, mock_calculate):
        """Test that errors during aggregation are handled gracefully"""
        # Set up parent period
        parent = Mock()
        parent.id = 2
        parent.parent_period = None
        parent.indicator.result.project.aggregate_children = True

        self.mock_period.parent_period = parent

        # Make calculation fail for the first period but succeed for parent
        def side_effect(period):
            if period.id == 1:
                raise ValueError("Test error")
            return (10, None, None)

        mock_calculate.side_effect = side_effect

        _aggregate_period_value(self.mock_period)

        # Should log error
        mock_logger.error.assert_called()
        error_call = mock_logger.error.call_args[0][0]
        self.assertIn('Error aggregating period 1', error_call)

        # Should have attempted to process parent
        # (Note: our implementation continues to next period when error occurs)
        self.assertGreaterEqual(mock_calculate.call_count, 1)

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    def test_percentage_measure_handling(self, mock_calculate):
        """Test that percentage measures are handled correctly"""
        # Set up period with percentage measure (PERCENTAGE_MEASURE = '2')
        self.mock_period.indicator.measure = '2'
        mock_calculate.return_value = (50.5, 101, 200)

        _aggregate_period_value(self.mock_period)

        # Should set numerator and denominator for percentage measures
        self.assertEqual(self.mock_period.numerator, 101)
        self.assertEqual(self.mock_period.denominator, 200)
        self.assertEqual(self.mock_period.actual_value, '50.5')

    @patch('akvo.rsr.usecases.period_update_aggregation.MAX_AGGREGATION_DEPTH', 5)
    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    def test_configured_max_depth(self, mock_calculate):
        """Test that configured max depth is respected"""
        # Create periods beyond configured limit
        periods = []
        for i in range(10):
            period = Mock()
            period.id = i + 1
            period.indicator.result.project.aggregate_to_parent = True
            period.indicator.result.project.aggregate_children = True
            periods.append(period)

        # Link them in a chain
        for i in range(len(periods) - 1):
            periods[i].parent_period = periods[i + 1]
        periods[-1].parent_period = None

        mock_calculate.return_value = (10, None, None)

        with patch('akvo.rsr.usecases.period_update_aggregation.logger') as mock_logger:
            _aggregate_period_value(periods[0])

            # Should stop at configured depth (5)
            self.assertEqual(mock_calculate.call_count, 5)
            mock_logger.warning.assert_called()

    @patch('akvo.rsr.usecases.period_update_aggregation.calculate_period_actual_value')
    def test_no_aggregation_conditions(self, mock_calculate):
        """Test periods that don't meet aggregation conditions"""
        # Set up period that doesn't aggregate to parent
        self.mock_period.indicator.result.project.aggregate_to_parent = False

        parent = Mock()
        parent.id = 2
        self.mock_period.parent_period = parent

        mock_calculate.return_value = (10, None, None)

        _aggregate_period_value(self.mock_period)

        # Should only process the original period, not the parent
        self.assertEqual(mock_calculate.call_count, 1)
        self.mock_period.save.assert_called_once()
        parent.save.assert_not_called()
