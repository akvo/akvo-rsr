# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class InternalOrganisationID(models.Model):
    """Model allowing organisations to record their internal references to other organisations."""
    recording_org = models.ForeignKey(
        'Organisation', verbose_name=_(u'recording organisation'), related_name='internal_ids'
    )
    referenced_org = models.ForeignKey(
        'Organisation', verbose_name=_(u'referenced organisation'), related_name='reference_ids'
    )
    # TODO: add index
    identifier = ValidXMLCharField(
        max_length=200, verbose_name=_(u'internal ID of referenced organisation'),
    )

    def __unicode__(self):
        return _(u"{rec_org_name}'s internal ID for {ref_org_name}: {identifier}").format(
            rec_org_name=self.recording_org.name,
            ref_org_name=self.referenced_org.name,
            identifier=self.identifier,
        )

    class Meta:
        app_label = 'rsr'
        unique_together = ('recording_org', 'referenced_org',)
