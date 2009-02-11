# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.syndication.feeds import FeedDoesNotExist, Feed
from akvo.rsr.models import Project, ProjectUpdate

class ProjectUpdates(Feed):
    def get_object(self, bits):
        # In case of "/rss/beats/0613/foo/bar/baz/", or other such clutter,
        # check that bits has only one member.
        if len(bits) != 1:
            raise ObjectDoesNotExist
        return Project.objects.get(pk__exact=bits[0])

    def title(self, obj):
        return "Akvo RSR-no %d: %s" % (obj.id, obj.name)

    def link(self, obj):
        if not obj:
            raise FeedDoesNotExist
        return '/rsr/project/%d/' % obj.id

    def description(self, obj):
        return "Project updates for project %s" % obj.name

    def items(self, obj):
        return ProjectUpdate.objects.filter(project__id__exact=obj.id).order_by('-time')[:30]
    
    def item_link(self, item):
        return '/rsr/project/%d/updates#%d' % (item.project.id, item.id, )
 
    def item_pubdate(self, item):
        return item.time