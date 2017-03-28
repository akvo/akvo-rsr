# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.utils import rsr_show_keywords

from ..fields import NullCharField, ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin


def about_image_path(instance, file_name):
    """Return absolute image path."""
    return 'db/partner_sites/%s/image/%s' % (instance.hostname, file_name)


def custom_css_path(instance, filename):
    """Return custom css path."""
    return 'db/partner_sites/%s/custom.css' % instance.hostname


def custom_favicon_path(instance, filename):
    """Return custom favicon path."""
    return 'db/partner_sites/%s/favicon.ico' % instance.hostname


def custom_logo_path(instance, filename):
    """Return custom logo path."""
    return 'db/partner_sites/%s/logo/%s' % (instance.hostname, filename)


class PartnerSite(TimestampsMixin, models.Model):

    """Model makes it possible to cater different data sets based on request's hostname."""

    def show_keywords(self):
        """Return keywords for PartnerSite."""
        return rsr_show_keywords(self)
    show_keywords.short_description = 'Keywords'
    show_keywords.allow_tags = True
    show_keywords.admin_order_field = 'keywords'

    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'),
        help_text=_('Select your organisation from the drop-down list.'))
    notes = ValidXMLTextField(verbose_name=_(u'Akvo page notes'), blank=True, default='')
    hostname = ValidXMLCharField(
        _(u'hostname'), max_length=50, unique=True, help_text=_(
            u'<p>Your hostname is used in the default web address of your Akvo page. '
            u'The web address created from  the hostname <em>myorganisation</em> would be '
            u'<em>http://myorganisation.akvoapp.org/</em>.</p>'
        )
    )
    cname = NullCharField(
        _(u'CNAME'), max_length=100, unique=True, blank=True, null=True, help_text=_(
            u'<p>Enter a custom domain name for accessing the Akvo page, for example '
            u'<i>projects.mydomain.org</i>. Optional. Requires additional DNS setup.</p>'
        )
    )
    custom_return_url = models.URLField(
        _(u'Return URL'), blank=True, help_text=_(
            u'<p>Enter the full URL (including http://) for the page to which users '
            u'should be returned when leaving the Akvo page.</p>'
        )
    )
    custom_return_url_text = ValidXMLCharField(
        _(u'Return URL text'), blank=True, max_length=50, default='', help_text=_(
            u'<p>Enter a text for the back button and return URL. '
            u'Leave empty to display "Back to <em>myorganisation</em>".</p>'
        )
    )
    piwik_id = models.PositiveIntegerField(_(u'Piwik analytics ID'))
    custom_css = models.FileField(_(u'stylesheet'), blank=True, upload_to=custom_css_path)
    custom_logo = models.FileField(
        _(u'organisation banner logo'), blank=True, upload_to=custom_logo_path, help_text=_(
            u'<p>Upload a logo file for the logo at the top of the Akvo page. By default '
            u'logo of the organisation belonging to the Akvo Page will be displayed.</p>'
        )
    )
    custom_favicon = models.FileField(
        _(u'favicon'), blank=True, upload_to=custom_favicon_path, help_text=_(
            u'<p>A favicon (.ico file) is the 16x16 pixel image shown inside the browser\'s '
            u'location bar, on tabs and in the bookmark menu.</p>'
        )
    )
    show_keyword_logos = models.BooleanField(_(u'Show keyword logos on project pages'),
                                             default=False)
    about_box = ValidXMLTextField(
        _(u'about box text'), max_length=500, blank=True, help_text=_(
            u'Enter HTML that will make up the top left box of the home page. (500 characters)'
            u'<p>'
            u'    Any text added should be wrapped in 2 &lt;div&gt; tags, an outer one specifying '
            u'    position and width of the text, and an inner for formatting of the text .'
            u'</p>'
            u'<p>'
            u'    The Outer &lt;div&gt; tag can use the classes <code>quarter, half, '
            u'    three_quarters and full</code> to specify the'
            u'    width of the text. It can use the classes <code>bottom</code> and '
            u'    <code>right</code> to specify a position other than top left.'
            u'</p>'
            u'<p>'
            u'    The Inner &lt;div&gt; tag can use the class <code>text_bg</code> to create a '
            u'    semi-transparent text background if a background image will be uploaded. '
            u'    Any other inline styles can also be used within the inner &lt;div&gt;. The '
            u'    tags &lt;h1&gt;, &lt;h3&gt;, &lt;h5&gt; and &lt;a&gt; are blue, while '
            u'    &lt;p&gt; tags are black by default. Use the classes <code>first</code> and '
            u'    <code>last</code> with &lt;p&gt; tags to reduce the margins above or below '
            u'    respectively.'
            u'</p>'
            u'<p>'
            u'    Add additional styling inline, or upload a .css stylesheet in the Stylesheet '
            u'    setting above. <em>Tip:</em> When using a .css file, use the #about_box ID '
            u'    selector to apply a style only to the About box.'
            u'</p>'
        )
    )
    about_image = models.ImageField(
        _(u'about box image'), blank=True, upload_to=about_image_path, help_text=_(
            u'<p>The optional background image for the About box '
            u'<em>must</em> be 470 pixels wide and 250 pixels tall.</p>'
        )
    )

    enabled = models.BooleanField(_(u'enabled'), default=True)
    default_language = ValidXMLCharField(
        _(u'Site UI default language'), max_length=5, choices=settings.LANGUAGES,
        default=settings.LANGUAGE_CODE)
    ui_translation = models.BooleanField(_(u'Translate user interface'), default=False)
    google_translation = models.BooleanField(_(u'Google translation widget'), default=False)
    facebook_button = models.BooleanField(_(u'Facebook share button'), default=False)
    twitter_button = models.BooleanField(_(u'Twitter share button'), default=False)
    facebook_app_id = ValidXMLCharField(
        _(u'Facebook App Id'), max_length=40, blank=True, null=True, help_text=_(
            u'<p>Your FaceBook app id is used when sharing pages from your partner site. '
            u'It can be obtained by creating a Facebook app, which will let you monitor when your '
            u'pages are referenced. Follow the instructions '
            u'<a href="http://help.yahoo.com/l/us/yahoo/smallbusiness/store/edit/social/'
            u'social-06.html">here</a>'
        )
    )
    partner_projects = models.BooleanField(
        _(u'Show only projects of partner'), default=True,
        help_text=_(u'Uncheck to list all projects on this Akvo page.')
    )
    keywords = models.ManyToManyField(
        'Keyword', verbose_name=_(u'keywords'), related_name='partnersites', blank=True)
    exclude_keywords = models.BooleanField(
        _(u'Exclude projects with selected keyword(s)'), default=False)
    all_maps = models.BooleanField(
        _(u'Show all projects, updates and organisations on the maps.'), default=False
    )

    def __unicode__(self):
        """Unicode representation."""
        return _(u'Akvo page for {}').format(self.organisation.name)

    def save(self, *args, **kwargs):
        if self.hostname:
            self.hostname = self.hostname.lower().strip()

        super(PartnerSite, self).save(*args, **kwargs)

    def updates(self):
        "All updates of all projects of the Page"
        return self.projects().all_updates()

    def partners(self):
        "All partner organisations of all projects of the Page"
        return self.projects().all_partners()

    def projects(self):
        from .project import Project
        "All projects of the Page"
        # Get all projects associated via the Page's organisation
        if self.partner_projects:
            fk_projects = self.organisation.published_projects().public()
        else:
            fk_projects = Project.objects.public().published()
        # Add (or remove) projects via keywords
        return self.apply_keywords(fk_projects)


    def apply_keywords(self, projects):
        "Apply keywords to the Page's projects"
        keywords = self.keywords.all()
        if not keywords:
            return projects
        # Either exclude or include projects via keyword association
        if self.exclude_keywords:
            return projects.exclude(keywords__in=keywords)
        else:
            return projects.filter(keywords__in=keywords)

    @property
    def logo(self):
        """Return logo."""
        return self.custom_logo or None

    @property
    def return_url(self):
        """Return custom url or /."""
        return self.custom_return_url or "/"

    @property
    def stylesheet(self):
        """Return stylesheet."""
        return self.custom_css or None

    @property
    def favicon(self):
        """Return favicon."""
        return self.custom_favicon or None

    @property
    def full_domain(self):
        """Return full domain."""
        return '%s.%s' % (self.hostname, getattr(settings, 'AKVOAPP_DOMAIN', 'akvoapp.org'))

    def get_absolute_url(self):
        """Return absolute url."""
        url = ''
        # TODO: consider the ramifications of get_absolute_url using CNAME if available
        if self.cname:
            return self.cname

        protocol = 'http'
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = '%ss' % protocol

        url = '%s://%s/' % (protocol, self.full_domain)
        return url

    @classmethod
    def yank_hostname(cls, netloc):
        """Get <partner1> from <partner1.akvoapp.org>.

        From a netloc return what is stored as "hostname" on the PartnerSite model.
        """
        return netloc.replace('.{}'.format(settings.AKVOAPP_DOMAIN), '')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'Akvo page')
        verbose_name_plural = _(u'Akvo pages')
        ordering = ('organisation__name',)
