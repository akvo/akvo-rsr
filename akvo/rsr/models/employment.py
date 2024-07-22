# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import logging
from typing import Type

from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

import akvo.cache as akvo_cache
from akvo.codelists import models as codelist_models
from akvo.codelists.store.default_codelists import COUNTRY
from akvo.utils import codelist_choices, codelist_value

from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.forms.models import model_to_dict
from django.utils.translation import gettext_lazy as _

from ..fields import ValidXMLCharField
from .model_querysets.employment import EmploymentQuerySet

logger = logging.getLogger(__name__)


class Employment(models.Model):
    organisation = models.ForeignKey('Organisation', on_delete=models.CASCADE, verbose_name=_('organisation'),
                                     related_name='employees')
    user = models.ForeignKey('User', on_delete=models.CASCADE, verbose_name=_('user'), related_name='employers')
    group = models.ForeignKey(Group, verbose_name=_('group'), null=True,
                              related_name='employments', related_query_name='employment',
                              on_delete=models.SET_NULL,
                              help_text=_('The permissions group for this user\'s employment.'))
    is_approved = models.BooleanField(_('approved'), default=False,
                                      help_text=_('Designates whether this employment is approved '
                                                  'by an administrator.'))
    receives_indicator_aggregation_emails = models.BooleanField(
        _('Receive indicator emails'),
        default=False,
        help_text=_('Some events of indicator aggregations in projects of this org will trigger emails'),
    )
    country = ValidXMLCharField(
        _('country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False)
    )
    job_title = ValidXMLCharField(_('job title'), max_length=50, blank=True)

    objects = EmploymentQuerySet.as_manager()

    class Meta:
        app_label = 'rsr'
        verbose_name = _('user employment')
        verbose_name_plural = _('user employments')
        unique_together = ('organisation', 'user', 'group')

    def __str__(self):
        return "{0} {1}: {2}".format(self.user.first_name, self.user.last_name,
                                     self.organisation.name)

    def iati_country(self):
        return codelist_value(codelist_models.Country, self, 'country')

    def iati_country_unicode(self):
        return str(self.iati_country())

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
                object_repr=str(self),
                action_flag=CHANGE,
                change_message='Changed is_approved, outside of admin.'
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


@receiver([post_delete, post_save], sender=Employment)
def invalidate_caches(sender: Type[Employment], instance: Employment = None, **kwargs):
    """Ensure related cache keys are removed to prevent access to old data"""

    if instance is None:
        return
    # Cache keys of akvo.rest.viewsets.PublicProjectViewSet.projects_filter_for_non_privileged_users
    from akvo.rest.viewsets import make_projects_filter_cache_prefix
    try:
        user = instance.user
        keys = [
            key for key in akvo_cache.list_cache_keys()
            if key.startswith(make_projects_filter_cache_prefix(user))
        ]
        if keys:
            logger.info("deleting %s keys of user %s(%s)", len(keys), user, user.id)
            cache.delete_many(keys)
    except Exception as exc:
        logger.warning("Cannot invalidate cache: %s", exc)
