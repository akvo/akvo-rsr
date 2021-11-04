# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class ProjectHierarchy(models.Model):
    project_relation = 'projecthierarchy__in'
    root_project = models.OneToOneField('Project', on_delete=models.CASCADE, db_index=True)
    max_depth = models.PositiveSmallIntegerField()
    is_master = models.BooleanField(_('is master program'), default=False)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('program')
        verbose_name_plural = _('programs')
        ordering = ['-id']

    @property
    def descendants(self):
        return self.root_project.descendants(self.max_depth)

    @property
    def project_count(self):
        return self.descendants.count() - 1  # remove root_project from count

    @property
    def project_ids(self):
        return self.descendants.values_list('id', flat=True)

    @property
    def organisation(self):
        return self.root_project.reporting_org

    def __str__(self):
        return self.root_project.title
