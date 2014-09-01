# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from textwrap import dedent

from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField, ValidXMLTextField
from akvo.utils import rsr_image_path


class MiniCMS(models.Model):
    '''
    A model that holds a bunch of fields for editable text on the home page and the project listing page.
    '''
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/home_page/%(file_name)s')

    label = ValidXMLCharField(u'label', max_length=50, help_text=u'The label is used for identification only', )
    feature_box = ValidXMLTextField(
        u'feature box text', max_length=350,
        help_text=_(
            u'Enter the text that will appear in the feature box of the home page. (350 characters)'
            u'<p>'
            u'    Text should be wrapped in two &lt;div&gt; tags, one outer specifying position and width and an inner '
            u'    for text formatting.'
            u'</p>'
            u'<p>The outer &lt;div&gt; can use the classes<br/>'
            u'<code>quarter, half, three_quarters and full</code><br/>'
            u'to specify the width of the text and'
            u'<code>bottom and right</code><br/> if a position other than top left is desired.</p>'
            u'<p>'
            u'    The inner &lt;div&gt; should have the class <code>text_bg</code> to create the semi-transparent '
            u'    background and any inline styles you want to apply to the text itself.<br/>'
            u'    The last &lt;p&gt; can have the class <code>last</code> to make the bottom margin smaller.'
            u'</p>'
            u'<p>'
            u'    &lt;h1&gt;, &lt;h3&gt;, &lt;h5&gt; and &lt;a&gt; tags are yellow while &lt;p&gt; is black by default.'
            u'</p>'
            u'<p>'
            u'    The following classes can be used to give text "Akvo colors":'
            u'    <code>green, red, blue, yellow, grey, black, white, lt_grey, link_blue</code>.'
            u'</p>'
            u'<p>Use the <code>serif</code> class to get a serif font (Georgia).</p>'
        )
    )
    feature_image = models.ImageField(
        u'feature image', blank=True, upload_to=image_path,
        help_text=u'Ideally the image should be 645x363 pixels in size.'
    )
    top_right_box = ValidXMLTextField(
        u'top right box text', max_length=350,
        help_text=u'Enter the text that will appear in the top right box of the home page. (350 characters)'
    )
    lower_height = models.IntegerField(u'accordion height', default=500,)
    active = models.BooleanField(u'currently active home page', default=False,)

    def __unicode__(self):
        return '%d: %s' % (self.id, self.label)

    class Meta:
        app_label = 'rsr'
        verbose_name = u'MiniCMS'
        verbose_name_plural = u'MiniCMS'
        ordering = ['-active', '-id', ]
