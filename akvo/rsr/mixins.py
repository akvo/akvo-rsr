# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib import admin
from django.db import models
from django.utils.translation import ugettext_lazy as _


class TimestampsMixin(models.Model):
    """
    Mixin used to add created and modified timestamp fields
    """
    created_at = models.DateTimeField(null=True, auto_now_add=True, db_index=True, editable=False)
    last_modified_at = models.DateTimeField(null=True, auto_now=True, db_index=True, editable=False)

    class Meta:
        abstract = True


class TimestampsAdminDisplayMixin(admin.ModelAdmin):
    """ Mixin class that displays the create_at and last_modified_at timestamp fields in the admin
    """

    def get_fieldsets(self, request, obj=None):
        """ Add and/or remove 'created_at' and 'last_modified_at' fields from first fieldset
        Since the modeladmin object is cached, and thus the fieldsets tuple,
        we need to be careful to both add and remove the fields as needed
        """
        def add_or_remove(obj, fields, name):
            # if the field has a value, add it to the fields tuple, unless it's already there
            if getattr(obj, name, None):
                if name not in fields:
                    fields += (name,)
            # otherwise make sure it's removed
            else:
                fields = tuple(field for field in fields if not field == name)
            return fields

        fieldsets = super(TimestampsAdminDisplayMixin, self).get_fieldsets(request, obj)
        fieldsets[0][1]['fields'] = add_or_remove(obj, fieldsets[0][1]['fields'], 'created_at')
        fieldsets[0][1]['fields'] = add_or_remove(obj, fieldsets[0][1]['fields'], 'last_modified_at')
        return fieldsets


class IndicatorUpdateMixin(models.Model):
    """
    Mixin used to add indicator update unit & percentage values
    """

    value = models.DecimalField(
        _('quantitative update value'),
        max_digits=20,
        decimal_places=2,
        blank=True,
        null=True
    )
    numerator = models.DecimalField(
        _('numerator for indicator'),
        max_digits=20,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('The numerator for a percentage value')
    )
    denominator = models.DecimalField(
        _('denominator for indicator'),
        max_digits=20,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('The denominator for a percentage value')
    )

    class Meta:
        abstract = True
