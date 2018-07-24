# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists import models as codelist_models
from akvo.codelists.store.default_codelists import COUNTRY
from akvo.utils import codelist_choices, codelist_value

from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.query import QuerySet as DjangoQuerySet
from django.forms.models import model_to_dict
from django.utils.encoding import force_unicode
from django.utils.translation import ugettext_lazy as _

from .models_utils import QuerySetManager

from ..fields import ValidXMLCharField


class Employment(models.Model):
    organisation = models.ForeignKey('Organisation', verbose_name=_(u'organisation'),
                                     related_name='employees')
    user = models.ForeignKey('User', verbose_name=_(u'user'), related_name='employers')
    group = models.ForeignKey(Group, verbose_name=_(u'group'), null=True,
                              related_name='employments', related_query_name='employment',
                              on_delete=models.SET_NULL,
                              help_text=_('The permissions group for this user\'s employment.'))
    is_approved = models.BooleanField(_('approved'), default=False,
                                      help_text=_('Designates whether this employment is approved '
                                                  'by an administrator.'))
    country = ValidXMLCharField(
        _(u'country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False)
    )
    job_title = ValidXMLCharField(_(u'job title'), max_length=50, blank=True)

    objects = QuerySetManager()

    class QuerySet(DjangoQuerySet):
        def organisations(self):
            """
            Return an Organisation QuerySet containing the organisations of the Employment QuerySet
            """
            from ..models import Organisation
            return Organisation.objects.filter(employees__in=self).distinct()

        def users(self):
            """
            Return a User QuerySet containing the users of the Employment QuerySet
            """
            return get_user_model().objects.filter(employers__in=self).distinct()

        def approved(self):
            """
            Return an Employment QuerySet containing the approved Employments
            """
            return self.filter(is_approved=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'user employment')
        verbose_name_plural = _(u'user employments')
        unique_together = ('organisation', 'user', 'group')

    def __unicode__(self):
        return u"{0} {1}: {2}".format(self.user.first_name, self.user.last_name,
                                      self.organisation.name)

    def iati_country(self):
        return codelist_value(codelist_models.Country, self, 'country')

    def iati_country_unicode(self):
        return unicode(self.iati_country())

    def approve(self, approved_by):
        """
        Approve an Employment. Will also be logged in the Employment admin history.

        :param approved_by: User that approves the Employment
        """
        if not self.is_approved:
            self.is_approved = True
            self.save()

            # Log in Employment admin history
            LogEntry.objects.log_action(
                user_id=approved_by.pk,
                content_type_id=ContentType.objects.get_for_model(self).pk,
                object_id=self.pk,
                object_repr=force_unicode(self),
                action_flag=CHANGE,
                change_message=u'Changed is_approved, outside of admin.'
            )

    def to_dict(self, org_list):
        # Set groups in right order
        all_groups = []
        auth_group_names = ['Users', 'User Managers', 'Project Editors', 'Admins']
        for auth_group_name in auth_group_names:
            try:
                all_groups.append(Group.objects.get(name=auth_group_name))
            except ObjectDoesNotExist:
                continue

        user_group = model_to_dict(self.group, fields=['id', 'name']) if self.group else None
        other_groups = [model_to_dict(group, fields=['id', 'name']) for group in all_groups]

        return dict(
            id=self.pk,
            organisation_full=model_to_dict(self.organisation, fields=['id', 'name', 'long_name', ]),
            user_full=model_to_dict(self.user, fields=['id', 'first_name', 'last_name', 'email', ]),
            is_approved=self.is_approved,
            job_title=self.job_title,
            country_full=self.iati_country().name if self.country else '',
            group=user_group,
            other_groups=other_groups,
            actions=True if self.organisation in org_list else False,
        )
