# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils.translation import ugettext_lazy as _


class OrganisationCodelist(models.Model):
    slug = models.SlugField(
        _(u'slug'), max_length=50, db_index=True,
        help_text=_(u'Enter a short word or hyphenated-words to identify the codelist.')
    )
    data = JSONField()

    def __unicode__(self):
        return self.slug

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation codelist')
        verbose_name_plural = _(u'organisation codelists')
        ordering = ['-id', ]
