# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from textwrap import dedent

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.utils import rsr_show_keywords

from ..fields import NullCharField, ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin


class PartnerSite(TimestampsMixin, models.Model):

    def about_image_path(instance, file_name):
        return 'db/partner_sites/%s/image/%s' % (instance.hostname, file_name)

    def custom_css_path(instance, filename):
        return 'db/partner_sites/%s/custom.css' % instance.hostname

    def custom_favicon_path(instance, filename):
        return 'db/partner_sites/%s/favicon.ico' % instance.hostname

    def custom_logo_path(instance, filename):
        return 'db/partner_sites/%s/logo/%s' % (instance.hostname, filename)

    def show_keywords(self):
        return rsr_show_keywords(self)
    show_keywords.short_description = 'Keywords'
    show_keywords.allow_tags = True
    show_keywords.admin_order_field = 'keywords'

    organisation = models.ForeignKey('Organisation', verbose_name=_(u'organisation'),
        help_text=_('Select your organisation from the drop-down list.')
    )
    notes = ValidXMLTextField(verbose_name=u'Akvo partner site notes', blank=True, default='')
    hostname = ValidXMLCharField(_(u'hostname'), max_length=50, unique=True,
        help_text=_(
            u'<p>Your hostname is used in the default web address of your partner site. '
            u'The web address created from  the hostname <em>myorganisation</em> would be '
            u'<em>http://myorganisation.akvoapp.org/</em>.</p>'
        )
    )
    cname = NullCharField(_(u'CNAME'), max_length=100, unique=True, blank=True, null=True,
        help_text=_(
            u'<p>Enter a custom domain name for accessing the partner site, '
            u'for example <i>projects.mydomain.org</i>. Optional. Requires additional DNS setup.</p>'
        )
    )
    custom_return_url = models.URLField(_(u'Return URL'), blank=True,
        help_text=_(
            u'<p>Enter the full URL (including http://) for the page to which users '
            u'should be returned when leaving the partner site.</p>'
        )
    )
    custom_return_url_text = ValidXMLCharField(_(u'Return URL text'), blank=True, max_length=50, default='',
        help_text=_(
            u'<p>Enter a text for the back button and return URL. '
            u'Leave empty to display "Back to <em>myorganisation</em>".</p>'
        )
    )
    piwik_id = models.PositiveIntegerField(_('Piwik analytics ID'), blank=True, null=True)
    custom_css = models.FileField(_(u'stylesheet'), blank=True, upload_to=custom_css_path)
    custom_logo = models.FileField(_(u'organisation banner logo'), blank=True, upload_to=custom_logo_path,
        help_text=_(
            u'<p>Upload a logo file for the logo at the top of the partner site page. '
            u'By default logo of the organisation belonging to the Akvo Page will be displayed.</p>'
        )
    )
    custom_favicon = models.FileField(_(u'favicon'), blank=True, upload_to=custom_favicon_path,
        help_text=_(
            u"<p>A favicon (.ico file) is the 16x16 pixel image shown inside the browser's location bar, "
            u'on tabs and in the bookmark menu.</p>'
        )
    )
    about_box = ValidXMLTextField(_(u'about box text'), max_length=500, blank=True,
        help_text=_(
            u'Enter HTML that will make up the top left box of the home page. (500 characters)'
            u'<p>'
            u'    Any text added should be wrapped in 2 &lt;div&gt; tags, an outer one specifying position and width'
            u'    of the text, and an inner for formatting of the text .'
            u'</p>'
            u'<p>'
            u'    The Outer &lt;div&gt; tag can use the classes <code>quarter, half, three_quarters and full</code> to'
            u'    specify the'
            u'    width of the text. It can use the classes <code>bottom</code> and <code>right</code> to specify a '
            u'    position other than top left.'
            u'</p>'
            u'<p>'
            u'    The Inner &lt;div&gt; tag can use the class <code>text_bg</code> to create a semi-transparent text'
            u'    background if a background image will be uploaded. Any other inline styles can also be used within '
            u'    the inner &lt;div&gt;. The tags &lt;h1&gt;, &lt;h3&gt;, &lt;h5&gt; and &lt;a&gt; are blue, while'
            u'    &lt;p&gt; tags are black by default. Use the classes <code>first</code> and <code>last</code> with '
            u'    &lt;p&gt; tags to reduce the margins above or below respectively.'
            u'</p>'
            u'<p>'
            u'    Add additional styling inline, or upload a .css stylesheet in the Stylesheet setting above.'
            u'    <em>Tip:</em> When using a .css file, use the #about_box ID selector to apply a style only to'
            u'    the About box.'
            u'</p>'
        )
    )
    about_image = models.ImageField(_(u'about box image'), blank=True, upload_to=about_image_path,
        help_text=_(
            u'<p>The optional background image for the About box '
            u'<em>must</em> be 470 pixels wide and 250 pixels tall.</p>'
        )
    )

    enabled = models.BooleanField(_(u'enabled'), default=True)
    default_language = ValidXMLCharField(
        _(u'Site UI default language'), max_length=5, choices=settings.LANGUAGES, default=settings.LANGUAGE_CODE
    )
    ui_translation = models.BooleanField(_(u'Translate user interface'), default=False)
    google_translation = models.BooleanField(_(u'Google translation widget'), default=False)
    facebook_button = models.BooleanField(_(u'Facebook Like button'), default=False)
    twitter_button = models.BooleanField(_(u'Twitter button'), default=False)
    facebook_app_id = ValidXMLCharField(_(u'Facebook App Id'), max_length=40, blank=True, null=True,
        help_text=_(
            u'<p>Your FaceBook app id is used when sharing pages from your partner site. '
            u'It can be obtained by creating a Facebook app, which will let you monitor when your pages are referenced. '
            u'Follow the instructions '
            u'<a href="http://help.yahoo.com/l/us/yahoo/smallbusiness/store/edit/social/social-06.html">here</a>'
        )
    )
    partner_projects = models.BooleanField(
        _(u'Show only projects of partner'), default=True,
        help_text=_(u'Uncheck to list all projects on this partnersite.')
    )
    keywords = models.ManyToManyField('Keyword', verbose_name=_(u'keywords'), related_name='partnersites', blank=True)
    exclude_keywords = models.BooleanField(_(u'Exclude projects with selected keyword(s)'), default=False)


    def __unicode__(self):
        return u'Partner site for %(organisation_name)s' % {'organisation_name': self.organisation.name}

    @property
    def logo(self):
        return self.custom_logo or None

    @property
    def return_url(self):
        return self.custom_return_url or self.organisation.url

    @property
    def stylesheet(self):
        return self.custom_css or None

    @property
    def favicon(self):
        return self.custom_favicon or None

    @property
    def full_domain(self):
        return '%s.%s' % (self.hostname, getattr(settings, 'AKVOAPP_DOMAIN', 'akvoapp.org'))

    def get_absolute_url(self):
        url = ''
        # TODO: consider the ramifications of get_absolute_url using CNAME if available
        if self.cname:
            return self.cname

        protocol = 'http'
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = '%ss' % protocol

        url = '%s://%s/' % (protocol, self.full_domain)
        return url

    class Meta:
        app_label = 'rsr'
        verbose_name = u'partner site'
        verbose_name_plural = u'partner sites'
        ordering = ('organisation__name',)
