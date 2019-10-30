# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re

from xml.sax.saxutils import XMLGenerator, escape as __escape

from django.contrib.syndication.views import FeedDoesNotExist, Feed
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.utils.feedgenerator import Rss201rev2Feed
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.models import Project, ProjectUpdate, Organisation


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
        # grab chunk before first match
        bit = data[start:match.span()[0]]
        bit = __escape(bit, entities)
        bits.append(bit)
        # grab match
        bit = data[match.span()[0]:match.span()[1]]
        bits.extend(bit)
        start = match.span()[1]
    # escape tail bit after last match
    bit = data[start:]
    bit = __escape(bit, entities)
    bits.extend(bit)
    data = u''.join(bits)
    return data


class RSRSimplerXMLGenerator(XMLGenerator):
    """subclassed to be able to call custom escape() function, see above
    """

    def characters(self, content):
        if not isinstance(content, unicode):
            content = unicode(content, self._encoding)
        self._write(escape(content))

    def addQuickElement(self, name, contents=None, attrs=None):
        "Convenience method for adding an element with no children"
        if attrs is None:
            attrs = {}
        self.startElement(name, attrs)
        if contents is not None:
            self.characters(contents)
        self.endElement(name)


class RSRMediaRssFeed(Rss201rev2Feed):
    def rss_attributes(self):
        attrs = super(RSRMediaRssFeed, self).rss_attributes()
        attrs['xmlns:media'] = 'http://search.yahoo.com/mrss/'
        attrs['xmlns:atom'] = 'http://www.w3.org/2005/Atom'
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
            item.photo.size
            return '<![CDATA[<p><a href="%s"><img src="%s" alt="" /></a></p><p>%s</p>]]>' % (
                item.get_absolute_url(),
                item.photo.thumbnail.absolute_url,
                item.text,
            )
        except:
            return item.text

    def item_pubdate(self, item):
        return item.created_at

    def item_author_name(self, item):
        return item.user.get_full_name()

    def item_credit(self, item):
        return item.photo_credit

    def item_extra_kwargs(self, item):
        """return a dictionary to the feedgenerator for each item to be added to the feed.
        """
        try:
            item.photo.size
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
    """RSS feed for last 25 RSR updates of a project."""

    def get_object(self, request, project_id):
        return Project.objects.get(pk__exact=project_id)

    def title(self, obj):
        return _(u'Akvo RSR project %(id)d: %(project_title)s') % {
            'id': obj.id,
            'project_title': obj.title
        }

    def description(self, obj):
        return _(u'Project updates for project %(project_title)s') % {
            'project_title': obj.title
        }

    def items(self, obj):
        # Limited to 25 items to prevent gateway timeouts.
        return ProjectUpdate.objects.filter(project__id=obj.id)[:25]


class OrganisationUpdates(UpdateFeed):
    """RSS feed for last 25 RSR updates of an organisation."""
    feed_type = RSRMediaRssFeed

    def get_object(self, request, org_id):
        return get_object_or_404(Organisation, id=int(org_id))

    def title(self, obj):
        return _(u'Projects of %(org_name)s') % {'org_name': obj.name, }

    def description(self, obj):
        if obj.name == obj.long_name:
            return _(u"Project updates for projects partnered by %(org_name)s") % {
                'org_name': obj.name
            }
        else:
            return _(
                u"Project updates for projects partnered by %(org_name)s - %(long_name)s"
            ) % {'org_name': obj.name, 'long_name': obj.long_name}

    def items(self, obj):
        # Limited to 25 items to prevent gateway timeouts.
        return obj.all_updates()[:25]

    def item_title(self, item):
        return _(
            u'Project %(project_id)d - %(project_title)s: %(update_title)s'
        ) % {
            'project_id': item.project.id,
            'project_title': item.project.title,
            'update_title': item.title
        }


class AllProjectUpdates(UpdateFeed):
    """RSS feed for last 25 RSR updates."""
    title = _(u'Last 25 RSR project updates')

    def link(self):
        return reverse('update-directory')

    description = _(u'Project updates for all Akvo RSR projects')

    def items(self):
        # Limited to 25 items to prevent gateway timeouts.
        return ProjectUpdate.objects.all()[:25]

    def item_title(self, item):
        return _(
            u'Project %(project_id)d - %(project_title)s: %(update_title)s'
        ) % {
            'project_id': item.project.id,
            'project_title': item.project.title,
            'update_title': item.title
        }
