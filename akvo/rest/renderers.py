# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework_csv.renderers import CSVRenderer, PaginatedCSVRenderer


class AkvoCSVRenderer(PaginatedCSVRenderer):
    """Fixed paginated renderer

    Use the PaginatedCSVRenderer or the simple CSVRenderer based on what kind
    of data we have. If the data is a list or has the "results_field" field on
    it, use the paginated renderer, otherwise the vanilla one.

    """

    def render(self, data, *args, **kwargs):
        if not isinstance(data, list) and self.results_field in data:
            data = data[self.results_field]
        if isinstance(data, list):
            return super(PaginatedCSVRenderer, self).render(data, *args, **kwargs)
        return CSVRenderer.render(self, data, *args, **kwargs)
