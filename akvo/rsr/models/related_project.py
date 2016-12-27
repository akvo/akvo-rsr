# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import RelatedActivityType
from akvo.codelists.store.codelists_v202 import RELATED_ACTIVITY_TYPE
from akvo.utils import codelist_choices, codelist_value


class RelatedProject(models.Model):
    project = models.ForeignKey('Project', related_name='related_projects')
    related_project = models.ForeignKey(
        'Project', related_name='related_to_projects', null=True, blank=True,
        on_delete=models.SET_NULL
    )
    related_iati_id = ValidXMLCharField(
        _(u'related project iati identifier'), max_length=100, blank=True,
        help_text=_(u'In case you know the IATI identifier of a project that does not exist in '
                    u'RSR, you can point out the IATI identifier here.')
    )
    relation = ValidXMLCharField(
        _(u'relation'), max_length=1, choices=codelist_choices(RELATED_ACTIVITY_TYPE), blank=True,
        help_text=_(u'The relationship between a project and related project. There are five types '
                    u'of relationships:<br/>'
                    u'1 - Parent: the project you are now creating is a sub-component of the '
                    u'selected related project.<br/>'
                    u'2 - Child: the selected related project is a sub-component of the project '
                    u'you are now creating.<br/>'
                    u'3 - Sibling: the selected related project and the project you are now '
                    u'creating are both sub-components of a parent project.<br/>'
                    u'4 - Co-funded: a project that receives funding from more than one '
                    u'organisation.<br/>'
                    u'5 - Third party: a report by another organisation on the same project '
                    u'that you are reporting on.')
    )

    def iati_relation(self):
        return codelist_value(RelatedActivityType, self, 'relation')

    def iati_relation_unicode(self):
        return str(self.iati_relation())

    def related_project_show_link(self):
        if self.related_project:
            return u'<a href="{0}">{1}</a>'.format(self.related_project.get_absolute_url(),
                                                   self.related_project.title)
        return u''

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'related project')
        verbose_name_plural = _(u'related projects')
        ordering = ['project', ]
        unique_together = ('project', 'related_project')

    def __unicode__(self):
        if self.related_project:
            return self.related_project.title
        elif self.related_iati_id:
            return self.related_iati_id
        return u'%s' % _(u'No related project specified')
