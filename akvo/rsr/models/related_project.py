# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import RelatedActivityType
from akvo.utils import codelist_choices, codelist_value


class RelatedProject(models.Model):
    project = models.ForeignKey('Project', related_name='related_projects')
    related_project = models.ForeignKey(
        'Project', related_name='related_to_projects', null=True, blank=True, on_delete=models.SET_NULL
    )
    related_iati_id = ValidXMLCharField(
        _(u'related project IATI identifier'), max_length=100, blank=True,
        help_text=_(u'The IATI Identifier for the related project.<br>'
                    u'Fill this in if the related project does not exist in RSR')
    )
    relation = ValidXMLCharField(
        _(u'relation'), max_length=1, choices=codelist_choices(RelatedActivityType),
        help_text=_(u'The relation between a project and related project. '
        u'(E.g. select the \'Parent\' relation when the selected project here is the parent of this project).')
    )

    def iati_relation(self):
        return codelist_value(RelatedActivityType, self, 'relation')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'related project')
        verbose_name_plural = _(u'related projects')
        ordering = ['project', ]
