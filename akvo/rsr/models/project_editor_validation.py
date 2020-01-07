# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import ForeignKey, Model
from django.db.models.fields import CharField, PositiveSmallIntegerField, TextField
from django.utils.translation import ugettext_lazy as _


class ProjectEditorValidationSet(Model):
    """
    A set of project editor validations, with a name and description. The name and description will
    be displayed together with the progress bar in the project editor.
    """
    name = CharField(_(u'name'), max_length=255)
    description = TextField(_(u'description'), max_length=5000)

    def delete(self, *args, **kwargs):
        if not self.pk == 1:
            # Do not allow the RSR validation set to be deleted
            super(ProjectEditorValidationSet, self).delete(*args, **kwargs)

    def __unicode__(self):
        return self.name if self.name else "{0}".format(_(u'Untitled validation set'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project editor validation set')
        verbose_name_plural = _(u'project editor validation sets')
        ordering = ('id', )


class ProjectEditorValidation(Model):
    """
    A validation is used to set a certain field or combination of fields in the project editor as
    mandatory, hidden or read only.

    The rule field is the key in this model. There are 2 options for this field:
    - Only a model (e.g. "partnership") indicating that at least one partnership is mandatory or
    that partnerships should be hidden in the project editor.
    - A model and a field (e.g. "budgetitem.other_extra") indicating that the field is mandatory
    or that the field should be hidden in the project editor.

    Also, any combination of the above options is possible. Separated by ||, which
    indicates an OR relationship. So "project.title||project.subtitle" with a mandatory action
    indicates that either the title or the subtitle of a project is mandatory.
    """
    MANDATORY_ACTION = 1
    HIDDEN_ACTION = 2

    ACTIONS_LIST = [MANDATORY_ACTION, HIDDEN_ACTION, ]

    ACTIONS_LABELS = [
        _(u'Mandatory'),
        _(u'Hidden'),
    ]

    ACTIONS = list(zip(ACTIONS_LIST, ACTIONS_LABELS))

    validation_set = ForeignKey(
        ProjectEditorValidationSet, verbose_name=_(u'validation set'), related_name='validations'
    )
    validation = CharField(_(u'validation'), max_length=255)
    action = PositiveSmallIntegerField(_(u'action'), choices=ACTIONS, db_index=True)

    def __unicode__(self):
        return "{0} ({1})".format(self.validation, unicode(dict(self.ACTIONS)[self.action]))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project editor validation')
        verbose_name_plural = _(u'project editor validations')
