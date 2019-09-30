# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class DisaggregationContributionHandler(object):

    def __init__(self, period_disaggregations, disaggregation_contributions):
        self.period_disaggregations = period_disaggregations
        self.disaggregation_contributions = disaggregation_contributions

    def handle(self, disaggregation):
        child_dimension_values = disaggregation.dimension_value.child_dimension_values.all()
        for dimension_value in child_dimension_values:
            contributing_project = dimension_value.name.project
            child_disaggregations = self.period_disaggregations.filter(dimension_value=dimension_value).all()
            for child_disaggregation in child_disaggregations:
                contribution, _ = self.disaggregation_contributions.get_or_create(
                    disaggregation=disaggregation,
                    contributing_project=contributing_project
                )
                contribution.value = child_disaggregation.value
                contribution.numerator = child_disaggregation.numerator
                contribution.denominator = child_disaggregation.denominator
                contribution.save()
