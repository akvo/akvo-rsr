# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.query import QuerySet
from django.forms.models import model_to_dict
from django.utils.translation import ugettext_lazy as _

from .models_utils import QuerySetManager

from ..fields import ValidXMLCharField


class Employment(models.Model):
    organisation = models.ForeignKey('Organisation', verbose_name=_(u'organisation'), related_name='employees')
    user = models.ForeignKey('User', verbose_name=_(u'user'), related_name='employers')
    group = models.ForeignKey(Group, verbose_name=_(u'group'), null=True, related_name='employments',
                              related_query_name='employment', on_delete=models.SET_NULL,
                              help_text=_('The permissions group for this user\'s employment.'))
    is_approved = models.BooleanField(
        _('approved'), default=False, help_text=_('Designates whether this employment is approved by an administrator.')
    )
    country = models.ForeignKey('Country', verbose_name=_(u'country'), null=True, blank=True)
    job_title = ValidXMLCharField(_(u'job title'), max_length=50, blank=True)

    objects = QuerySetManager()

    class QuerySet(QuerySet):
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

    def __unicode__(self):
        return "{0} {1}: {2}".format(self.user.first_name, self.user.last_name, self.organisation.name)

    def save(self, *args, **kwargs):
        """Before we save make sure the required auth groups are existing."""
        group_names = ['Users', 'User managers', 'Project editors', 'Admins', ]
        for group_name in settings.REQUIRED_AUTH_GROUPS:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                print "Created group => {}".format(group)
        super(Employment, self).save(*args, **kwargs)

    def to_dict(self, org_list):
        country = '' if not self.country else model_to_dict(self.country)
        # Set groups in right order

        all_groups = [
            Group.objects.get(name='Users'),
            Group.objects.get(name='User managers'),
            Group.objects.get(name='Project editors'),
            Group.objects.get(name='Admins')
        ]

        user_group = model_to_dict(self.group, fields=['id', 'name']) if self.group else None
        other_groups = [model_to_dict(group, fields=['id', 'name']) for group in all_groups]

        return dict(
            id=self.pk,
            organisation_full=model_to_dict(self.organisation, fields=['id', 'name', 'long_name',]),
            user_full=model_to_dict(self.user, fields=['id', 'first_name', 'last_name', 'email',]),
            is_approved=self.is_approved,
            job_title=self.job_title,
            country_full=country,
            group=user_group,
            other_groups=other_groups,
            actions=True if self.organisation in org_list else False,
        )
