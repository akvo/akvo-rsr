# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os
import re

from xml.sax.saxutils import XMLGenerator

from django.contrib.syndication.views import FeedDoesNotExist, Feed
from django.core.urlresolvers import reverse
from django.utils.feedgenerator import Rss201rev2Feed
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.models import Project, ProjectUpdate, Organisation


def __dict_replace(s, d):
    """Replace substrings of a string using a dictionary."""
    for key, value in d.items():
        s = s.replace(key, value)
    return s

def __escape(data, entities):
    # must do ampersand first
    data = data.replace("&", "&amp;")
    data  = data.replace(">", "&gt;")
    data  = data.replace("<", "&lt;")
    if entities:
        data = __dict_replace(data, entities)
    return data

def escape(data, entities={}):
    """Modification to xml.sax.saxutils.escape to that detects CDATA blocks that are not escaped

    Escape &, <, and > in a string of data.

    You can escape other strings of data by passing a dictionary as
    the optional entities parameter.  The keys and values must all be
    strings; each key will be replaced with its corresponding value.

    """
    # find character data, re.DOTALL includes linefeed in .
    pattern = re.compile('<!\[CDATA\[.*\]\]>', re.DOTALL)
    iterator = pattern.finditer(data)
    start = 0
    bits = []
    for match in iterator:
        #grab chunk before first match
        bit = data[start:match.span()[0]]
        bit = __escape(bit, entities)
        bits.append(bit)
        #grab match
        bit = data[match.span()[0]:match.span()[1]]
        bits.extend(bit)
        start = match.span()[1]
    # escape tail bit after last match
    bit = data[start:]
    bit = __escape(bit, entities)
    bits.extend(bit)
    data = ''.join(bits)
    return data


class RSRSimplerXMLGenerator(XMLGenerator):
    """subclassed to be able to call custom escape() function, see above
    """
    def characters(self, content):
        self._write(escape(content))

    def addQuickElement(self, name, contents=None, attrs=None):
        "Convenience method for adding an element with no children"
        if attrs is None: attrs = {}
        self.startElement(name, attrs)
        if contents is not None:
            self.characters(contents)
        self.endElement(name)


class RSRMediaRssFeed(Rss201rev2Feed):
    def rss_attributes(self):
        attrs = super(RSRMediaRssFeed, self).rss_attributes()
        attrs['xmlns:media']    = 'http://search.yahoo.com/mrss/'
        attrs['xmlns:atom']     = 'http://www.w3.org/2005/Atom'
        return attrs

    def add_item_elements(self, handler, item):
        """Callback to add elements to each item (item/entry) element."""
        super(RSRMediaRssFeed, self).add_item_elements(handler, item)

        if 'media:title' in item:
            handler.addQuickElement(u"media:title", item['title'])
        if 'media:description' in item:
            handler.addQuickElement(u"media:description", item['media:description'])
        if 'media:credit' in item:
            handler.addQuickElement(u"media:credit", item['media:credit'])

        if 'content_url' in item:
            content = dict(url=item['content_url'])
            if 'content_width' in item:
                content['width'] = str(item['content_width'])
            if 'content_height' in item:
                content['height'] = str(item['content_height'])
            handler.addQuickElement(u"media:content", '', content)

        if 'thumbnail_url' in item:
            thumbnail = dict(url=item['thumbnail_url'])
            if 'thumbnail_width' in item:
                thumbnail['width'] = str(item['thumbnail_width'])
            if 'thumbnail_height' in item:
                thumbnail['height'] = str(item['thumbnail_height'])
            handler.addQuickElement(u"media:thumbnail", '', thumbnail)

        if 'keywords' in item:
            handler.addQuickElement(u"media:keywords", item['keywords'])

    def write(self, outfile, encoding):
        handler = RSRSimplerXMLGenerator(outfile, encoding)
        handler.startDocument()
        handler.startElement(u"rss", self.rss_attributes())
        handler.startElement(u"channel", self.root_attributes())
        self.add_root_elements(handler)
        self.write_items(handler)
        self.endChannelElement(handler)
        handler.endElement(u"rss")

class UpdateFeed(Feed):
    """base class generating Update feeds
    """
    feed_type = RSRMediaRssFeed

    def link(self, obj):
        if not obj:
            raise FeedDoesNotExist
        return obj.get_absolute_url()

    def item_link(self, item):
        return item.get_absolute_url()

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        try:
            size = item.photo.size
            return '<![CDATA[<p><a href="%s"><img src="%s" alt="" /></a></p><p>%s</p>]]>' % (
                item.get_absolute_url(),
                item.photo.thumbnail.absolute_url,
                item.text,
            )
        except:
            return item.text

    def item_pubdate(self, item):
        return item.time

    def item_author_name(self, item):
        return item.user.get_full_name()

    def item_credit(self, item):
        return item.photo_credit

    def item_extra_kwargs(self, item):
        """return a dictionary to the feedgenerator for each item to be added to the feed.
        """
        try:
            size = item.photo.size
            photo = item.photo
            kwargs = {
                'media:title': item.title,
                'media:description': item.photo_caption,
                'media:credit': item.photo_credit,
                'content_url': photo.url,
                'content_width': photo.width,
                'content_height': photo.height,
                'thumbnail_url': photo.thumbnail.absolute_url,
                'thumbnail_width': photo.thumbnail.width(),
                'thumbnail_height': photo.thumbnail.height(),
            }
            return kwargs
        except:
            return {}


class ProjectUpdates(UpdateFeed):
    """feed with all updates for a particular project
    """
    def get_object(self, request, project_id):
        return Project.objects.get(pk__exact=project_id)

    def title(self, obj):
        return _(u'Akvo RSR project %(id)d: %(project_title)s') % {'id':obj.id, 'project_title':obj.title}

    def description(self, obj):
        return _(u'Project updates for project %(project_title)s' % {'project_title': obj.title})

    def items(self, obj):
        return ProjectUpdate.objects.filter(project__id__exact=obj.id).order_by('-time')


class OrganisationUpdates(UpdateFeed):
    """feed that aggregates all updates from all projects that an organisation is a partner to
    """
    feed_type = RSRMediaRssFeed

    def get_object(self, request, org_id):
        return Organisation.objects.get(pk__exact=org_id)

    def title(self, obj):
        return _(u'Projects of %(org_name)s') % {'org_name':obj.name,}

    def description(self, obj):
        if obj.name == obj.long_name:
            return _(u"Project updates for projects partnered by %(org_name)s") % {'org_name': obj.name}
        else:
            return _(
                u"Project updates for projects partnered by %(org_name)s - %(long_name)s"
            ) % {'org_name': obj.name, 'long_name': obj.long_name}

    def items(self, obj):
        projects = Organisation.objects.get(pk=obj.id).projects.published()
        return ProjectUpdate.objects.filter(project__id__in=projects).order_by('-time')

    def item_title(self, item):
        return _(
            u'Project %(project_id)d - %(project_title)s: %(update_title)s'
        ) % {
            'project_id': item.project.id,
            'project_title': item.project.title,
            'update_title': item.title
        }


class AllProjectUpdates(UpdateFeed):
    """all updates in RSR!
    """
    title = _(u'Akvo RSR all project updates')
    
    def link(self):
        return reverse('project_list', args=['all'])

    description = _(u'Project updates for all Akvo RSR projects')

    def items(self):
        # Limited to 100 items to prevent gateway timeouts & since only the last 100 items
        # are required for current usage anyway.
        # TODO: rename or create a new appropriately named feed.
        return ProjectUpdate.objects.filter(project__publishingstatus__status='published').order_by('-time')[:100]

    def item_title(self, item):
        return _(
            u'Project %(project_id)d - %(project_title)s: %(update_title)s'
        ) % {
            'project_id': item.project.id,
            'project_title': item.project.title,
            'update_title': item.title
        }
