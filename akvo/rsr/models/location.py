# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import LatitudeField, LongitudeField, ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class BaseLocation(models.Model):
    _help_text = _(u"Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> "
                   u'to get the decimal coordinates of your project.')
    latitude = LatitudeField(_(u'latitude'), db_index=True, default=0, help_text=_help_text)
    longitude = LongitudeField(_(u'longitude'), db_index=True, default=0, help_text=_help_text)
    city = ValidXMLCharField(_(u'city'), blank=True, max_length=255, help_text=_('(255 characters).'))
    state = ValidXMLCharField(_(u'state'), blank=True, max_length=255, help_text=_('(255 characters).'))
    address_1 = ValidXMLCharField(_(u'address 1'), max_length=255, blank=True, help_text=_('(255 characters).'))
    address_2 = ValidXMLCharField(_(u'address 2'), max_length=255, blank=True, help_text=_('(255 characters).'))
    postcode = ValidXMLCharField(_(u'postcode'), max_length=10, blank=True, help_text=_('(10 characters).'))

    def delete(self, *args, **kwargs):
        super(BaseLocation, self).delete(*args, **kwargs)

        # If location_target has more locations, set the first as primary location
        location_target = self.location_target
        other_locations = location_target.locations.all()

        if other_locations.count() > 0:
            location_target.primary_location = other_locations.first()
        else:
            location_target.primary_location = None

        location_target.save()

    def save(self, *args, **kwargs):
        super(BaseLocation, self).save(*args, **kwargs)

        # Set location as primary location if it is the first location
        location_target = self.location_target
        if location_target.primary_location is None or location_target.primary_location.pk > self.pk:
            location_target.primary_location = self
            location_target.save()

    class Meta:
        app_label = 'rsr'
        abstract = True
        ordering = ['id', ]


class OrganisationLocation(BaseLocation):
    # the organisation that's related to this location
    location_target = models.ForeignKey('Organisation', null=True, related_name='locations')
    country = models.ForeignKey('Country', verbose_name=_(u'country'))


class ProjectLocation(BaseLocation):
    # the project that's related to this location
    location_target = models.ForeignKey('Project', null=True, related_name='locations')
    country = models.ForeignKey('Country', verbose_name=_(u'country'))

    # Extra IATI fields
    reference = ValidXMLCharField(_(u'reference'), blank=True, max_length=50)
    location_code = ValidXMLCharField(_(u'code'), blank=True, max_length=25)
    vocabulary = ValidXMLCharField(
        _(u'vocabulary'), blank=True, max_length=2, choices=[code[:2] for code in codelists.GEOGRAPHIC_VOCABULARY]
    )
    name = ValidXMLCharField(_(u'name'), blank=True, max_length=100)
    description = ValidXMLCharField(_(u'description'), blank=True, max_length=255, help_text=_(u'(max 255 characters)'))
    activity_description = ValidXMLCharField(
        _(u'activity description'), blank=True, max_length=255, help_text=_(u'(max 255 characters)')
    )
    administrative_code = ValidXMLCharField(_(u'administrative code'), blank=True, max_length=25)
    administrative_vocabulary = ValidXMLCharField(
        _(u'administrative vocabulary'), blank=True, max_length=2,
        choices=[code[:2] for code in codelists.GEOGRAPHIC_VOCABULARY]
    )
    administrative_level = models.PositiveSmallIntegerField(
        _(u'administrative level'), blank=True, null=True, max_length=1
    )
    exactness = ValidXMLCharField(_(u'exactness'), blank=True, max_length=1, choices=codelists.GEOGRAPHIC_EXACTNESS)
    location_reach = ValidXMLCharField(
        _(u'reach'), blank=True, max_length=1, choices=codelists.GEOGRAPHIC_LOCATION_REACH
    )
    location_class = ValidXMLCharField(
        _(u'class'), blank=True, max_length=1, choices=codelists.GEOGRAPHIC_LOCATION_CLASS
    )
    feature_designation = ValidXMLCharField(
        _(u'feature designation'), blank=True, max_length=5, choices=[code[:2] for code in codelists.LOCATION_TYPE]
    )


class ProjectUpdateLocation(BaseLocation):
    # the project update that's related to this location
    location_target = models.ForeignKey('ProjectUpdate', null=True, related_name='locations')
    country = models.ForeignKey('Country', verbose_name=_(u'country'), null=True, blank=True,)
