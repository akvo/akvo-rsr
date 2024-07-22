# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db.models import JSONField
from django.db import models
from django.utils.translation import gettext_lazy as _


class OrganisationCodelist(models.Model):
    slug = models.SlugField(
        _('slug'), max_length=50, db_index=True,
        help_text=_('Enter a short word or hyphenated-words to identify the codelist.')
    )
    data = JSONField()

    def __str__(self):
        return self.slug

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation codelist')
        verbose_name_plural = _('organisation codelists')
        ordering = ['-id', ]
