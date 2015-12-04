# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import ForeignKey, Model
from django.db.models.fields import CharField, PositiveSmallIntegerField, TextField
from django.utils.translation import ugettext_lazy as _


class RuleSet(Model):
    """
    A set of project editor rules, with a name and description. The name and description will be
    displayed together with the progress bar in the project editor.
    """
    name = CharField(_(u'name'), max_length=255, blank=True)
    description = TextField(_(u'description'), max_length=1000, blank=True)
    created_by = ForeignKey('User', verbose_name=_(u'created by'), related_name='created_rules')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'ruleset')
        verbose_name_plural = _(u'rulesets')


class Rule(Model):
    """
    A rule is used to set a certain field or combination of fields in the project editor as
    mandatory, hidden or read only.

    The rule field is the key in this model. There are 2 options for this field:
    - Only a model (e.g. "partnership") indicating that at least one partnership is mandatory or
    that partnerships should be hidden in the project editor.
    - A model and a field (e.g. "budgetitem.other_extra") indicating that the field is mandatory
    or that the field should be hidden in the project editor.

    Also, any combination of the above options is possible. Separated by a space, which
    indicates an OR relationship. So "project.title project.subtitle" with a mandatory action
    indicates that either the title or the subtitle of a project should be filled in.
    """
    MANDATORY_ACTION = 1
    HIDDEN_ACTION = 2
    READ_ONLY_ACTION = 3

    ACTIONS_LIST = [MANDATORY_ACTION, HIDDEN_ACTION, READ_ONLY_ACTION]

    ACTIONS_LABELS = [
        _(u'Mandatory'),
        _(u'Hidden'),
        _(u'Read only'),
    ]

    ACTIONS = zip(ACTIONS_LIST, ACTIONS_LABELS)

    ruleset = ForeignKey(RuleSet, verbose_name=_(u'ruleset'), related_name='rules')
    rule = CharField(_(u'rule'), max_length=255)
    action = PositiveSmallIntegerField(_(u'option'), choices=ACTIONS, db_index=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'rule')
        verbose_name_plural = _(u'rules')
