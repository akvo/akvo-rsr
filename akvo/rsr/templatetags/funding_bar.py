# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
register = template.Library()


@register.inclusion_tag('inclusion_tags/funding_bar.html')
def funding_bar(project):
    return {'p': project}
