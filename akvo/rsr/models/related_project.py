# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import RelatedActivityType
from akvo.codelists.store.default_codelists import RELATED_ACTIVITY_TYPE
from akvo.utils import codelist_choices, codelist_value
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver


class RelatedProject(models.Model):

    PROJECT_RELATION_PARENT = '1'
    PROJECT_RELATION_CHILD = '2'
    PROJECT_RELATION_SIBLING = '3'
    PROJECT_RELATION_CO_FUNDED = '4'
    PROJECT_RELATION_THIRD_PARTY = '5'

    project = models.ForeignKey('Project', related_name='related_projects')
    related_project = models.ForeignKey(
        'Project', related_name='related_to_projects', null=True, blank=True,
        on_delete=models.SET_NULL
    )
    related_iati_id = ValidXMLCharField(
        _('related project iati identifier'), max_length=100, blank=True,
        help_text=_('In case you know the IATI identifier of a project that does not exist in '
                    'RSR, you can point out the IATI identifier here.')
    )
    relation = ValidXMLCharField(
        _('relation'), max_length=1, choices=codelist_choices(RELATED_ACTIVITY_TYPE), blank=True,
        help_text=_('The relationship between a project and related project. There are five types '
                    'of relationships:<br/>'
                    '1 - Parent: the project you are now creating is a sub-component of the '
                    'selected related project.<br/>'
                    '2 - Child: the selected related project is a sub-component of the project '
                    'you are now creating.<br/>'
                    '3 - Sibling: the selected related project and the project you are now '
                    'creating are both sub-components of a parent project.<br/>'
                    '4 - Co-funded: a project that receives funding from more than one '
                    'organisation.<br/>'
                    '5 - Third party: a report by another organisation on the same project '
                    'that you are reporting on.')
    )

    @property
    def reciprocal_relation(self):
        """Return the relation between related_project and project.

        `relation` specifies the relationship between project and
        related_project.  This returns the reciprocal relationship.

        """

        if self.relation == RelatedProject.PROJECT_RELATION_PARENT:
            return RelatedProject.PROJECT_RELATION_CHILD

        elif self.relation == RelatedProject.PROJECT_RELATION_CHILD:
            return RelatedProject.PROJECT_RELATION_PARENT

        else:
            return self.relation

    def iati_relation(self):
        return codelist_value(RelatedActivityType, self, 'relation')

    def iati_relation_unicode(self):
        return str(self.iati_relation())

    def related_project_show_link(self):
        if self.related_project:
            return '<a href="{0}">{1}</a>'.format(self.related_project.get_absolute_url(),
                                                  self.related_project.title)
        return ''

    class Meta:
        app_label = 'rsr'
        verbose_name = _('related project')
        verbose_name_plural = _('related projects')
        ordering = ['project', ]
        unique_together = ('project', 'related_project')

    def __str__(self):
        if self.related_project:
            return self.related_project.title
        elif self.related_iati_id:
            return self.related_iati_id
        return '%s' % _('No related project specified')


class MultipleParentsDisallowed(Exception):
    """Exception raised when trying to create multiple parents for a project."""
    message = _('A project can have only one parent.')

    def __str__(self):
        return str(self.message)


class ParentChangeDisallowed(Exception):
    """Exception raised when trying to change parent after importing results."""
    message = _("Cannot change a project's parent after importing results.")

    def __str__(self):
        return str(self.message)


PARENT_RELATIONS = {
    RelatedProject.PROJECT_RELATION_CHILD,
    RelatedProject.PROJECT_RELATION_PARENT
}


@receiver(pre_save, sender=RelatedProject)
def validate_parents(sender, **kwargs):
    """Validate creation and changing of parents for a project.

    1. Prevent creating multiple parents for a project.

    2. Prevent modifying the parent for a project that has already imported
    results from the parent.

    """

    from akvo.rsr.models import Result

    related_project = kwargs['instance']

    # Creating a new parent/child relation
    if related_project.id is None and related_project.relation in PARENT_RELATIONS:
        if related_project.relation == RelatedProject.PROJECT_RELATION_CHILD:
            child_project = related_project.related_project
        else:
            child_project = related_project.project

        # Allow only one parent
        if child_project is not None and child_project.parents_all().exists():
            raise MultipleParentsDisallowed

    # Changing an existing parent/child relation
    elif related_project.id is not None and related_project.relation in PARENT_RELATIONS:
        if related_project.relation == RelatedProject.PROJECT_RELATION_CHILD:
            parent_project = related_project.project
            child_project = related_project.related_project
        else:
            child_project = related_project.project
            parent_project = related_project.related_project

        project_results = Result.objects.filter(project=child_project)
        child_results = project_results.exclude(parent_result=None)
        other_parent_child_results = child_results.exclude(parent_result__project=parent_project)

        if other_parent_child_results.exists():
            raise ParentChangeDisallowed


@receiver(pre_delete, sender=RelatedProject)
def prevent_parent_delete(sender, **kwargs):
    from akvo.rsr.models import Result

    related_project = kwargs['instance']
    if related_project.id is not None and related_project.relation in PARENT_RELATIONS:
        if related_project.relation == RelatedProject.PROJECT_RELATION_CHILD:
            parent_project = related_project.project
            child_project = related_project.related_project
        else:
            child_project = related_project.project
            parent_project = related_project.related_project

        project_results = Result.objects.filter(project=child_project)
        child_results = project_results.filter(parent_result__project=parent_project)

        if child_results.exists():
            raise ParentChangeDisallowed
