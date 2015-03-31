# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""


def get_domain(request):
    """Get domain from request."""
    original_domain = request.get_host().split(":")[0]
    if original_domain == "rsr.akvo.org":
        domain = original_domain
    else:
        domain_parts = original_domain.split(".")[-4:]
        domain = ".".join(domain_parts)
    return domain


class ReallySimpleRouterMiddleware(object):

    """Simple test for middleware testing."""

    def process_request(self, request, cname_domain=False, rsr_page=None):
        """Route on request."""
        domain = get_domain(request)
        print "Domain: {}".format(domain)
        return None

    def process_response(self, request, response):
        """Route on response."""
        return None
