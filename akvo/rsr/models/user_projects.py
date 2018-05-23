# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.db.models.query import QuerySet as DjangoQuerySet
from django.utils.translation import ugettext_lazy as _

from .models_utils import QuerySetManager


class UserProjects(models.Model):

    user = models.OneToOneField('User', related_name='user_projects')
    projects = models.ManyToManyField('Project', related_name='permitted_users')

    def __unicode__(self):
        return '{} - {} projects'.format(
            self.user.email,
            self.projects.count())

    # objects = QuerySetManager()
    #
    # class QuerySet(DjangoQuerySet):
    #     def projects(self):
    #         """
    #         """
    #         from ..models import Project
    #
    #         ### DEBUG ###
    #         import pdb
    #         pdb.set_trace()
    #         ### DEBUG ###
    #
    #         return Project.objects.filter(employees__in=self).distinct()

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'user projects')
        verbose_name_plural = _(u'users projects')
        ordering = ('user_id',)

