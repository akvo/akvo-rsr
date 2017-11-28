# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import LatitudeField, LongitudeField, ValidXMLCharField
from akvo.codelists.models import (Country, GeographicExactness, GeographicLocationClass,
                                   GeographicLocationReach, GeographicVocabulary, LocationType)
from akvo.codelists.store.codelists_v202 import (
    COUNTRY, GEOGRAPHIC_EXACTNESS, GEOGRAPHIC_LOCATION_CLASS, GEOGRAPHIC_LOCATION_REACH,
    GEOGRAPHIC_VOCABULARY, LOCATION_TYPE
)
from akvo.utils import codelist_choices, codelist_value, get_country


class BaseLocation(models.Model):
    latitude = LatitudeField(
        _(u'latitude'), null=True, blank=True, db_index=True, default=0,
        help_text=_(u'Use a period to denote decimals.')
    )
    longitude = LongitudeField(
        _(u'longitude'), null=True, blank=True, db_index=True, default=0,
        help_text=_(u'Use a period to denote decimals.')
    )
    city = ValidXMLCharField(_(u'city'), blank=True, max_length=255)
    state = ValidXMLCharField(_(u'state'), blank=True, max_length=255)
    address_1 = ValidXMLCharField(_(u'address 1'), max_length=255, blank=True)
    address_2 = ValidXMLCharField(_(u'address 2'), max_length=255, blank=True)
    postcode = ValidXMLCharField(_(u'postal code'), max_length=10, blank=True)
    country = models.ForeignKey('Country', null=True, blank=True, verbose_name=_(u'country'))

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
        get_country = False
        if not self.pk:
            get_country = True

        else:
            original = self._meta.model.objects.get(id=self.pk)
            if original.latitude != self.latitude or original.longitude != self.longitude:
                get_country = True

        # Set a country based on the latitude and longitude if possible
        if get_country:
            self.country = self.get_country_from_lat_lon()
            if 'update_fields' in kwargs and 'country' not in kwargs['update_fields']:
                kwargs['update_fields'].append('country')

        super(BaseLocation, self).save(*args, **kwargs)

        # Set location as primary location if it is the first location
        location_target = self.location_target
        if location_target.primary_location is None or location_target.primary_location.pk > self.pk:
            location_target.primary_location = self
            location_target.save()

    def get_country_from_lat_lon(self):
        """Get the country based on the location's latitude and longitude."""

        if self.latitude is None or self.longitude is None:
            return None

        try:
            country, iso_code = get_country(float(self.latitude), float(self.longitude))
        except ValueError:
            iso_code = None

        if iso_code is not None:
            # FIXME: We have one too many country models!
            Country = models.get_model('rsr', 'Country')
            return Country.objects.filter(iso_code=iso_code).first()

    class Meta:
        app_label = 'rsr'
        abstract = True
        ordering = ['id', ]


class OrganisationLocation(BaseLocation):
    location_target = models.ForeignKey('Organisation', related_name='locations')
    iati_country = ValidXMLCharField(
        _(u'country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_(u'The country in which the organisation is located.')
    )

    def iati_country_value(self):
        return codelist_value(Country, self, 'iati_country')

    def iati_country_value_unicode(self):
        return unicode(self.iati_country_value())


class ProjectLocation(BaseLocation):
    location_target = models.ForeignKey('Project', related_name='locations')

    # Additional IATI fields
    reference = ValidXMLCharField(
        _(u'reference'), blank=True, max_length=50,
        help_text=_(u'An internal reference that describes the location in the reporting '
                    u'organisation\'s own system. For reference see: '
                    u'<a href="http://iatistandard.org/202/activity-standard/iati-activities/'
                    u'iati-activity/location/#attributes" target="_blank">'
                    u'http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/'
                    u'location/#attributes</a>.')
    )
    location_code = ValidXMLCharField(
        _(u'code'), blank=True, max_length=25,
        help_text=_(u'Enter a code to identify the region. Codes are based on DAC region codes. '
                    u'Where an activity is considered global, the code 998 can be used. For '
                    u'reference: <a href="http://www.oecd.org/dac/stats/dacandcrscodelists.htm" '
                    u'target="_blank">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>.')
    )
    vocabulary = ValidXMLCharField(_(u'vocabulary'), blank=True, max_length=2,
                                   choices=codelist_choices(GEOGRAPHIC_VOCABULARY))
    name = ValidXMLCharField(
        _(u'name'), blank=True, max_length=100,
        help_text=_(u'The human-readable name for the location.')
    )
    description = ValidXMLCharField(
        _(u'location description'), blank=True, max_length=2000,
        help_text=_(u'This provides free text space for providing an additional description, if '
                    u'needed, of the actual target of the activity. A description that qualifies '
                    u'the location, not the activity.')
    )
    activity_description = ValidXMLCharField(
        _(u'activity description'), blank=True, max_length=2000,
        help_text=_(u'A description that qualifies the activity taking place at the location. '
                    u'This should not duplicate information provided in the main activity '
                    u'description, and should typically be used to distinguish between activities '
                    u'at multiple locations within a single iati-activity record.')
    )
    exactness = ValidXMLCharField(
        _(u'location precision'), blank=True, max_length=1,
        choices=codelist_choices(GEOGRAPHIC_EXACTNESS),
        help_text=_(u'Defines whether the location represents the most distinct point reasonably '
                    u'possible for this type of activity or is an approximation due to lack of '
                    u'more detailed information.')
    )
    location_reach = ValidXMLCharField(
        _(u'reach'), blank=True, max_length=1, choices=codelist_choices(GEOGRAPHIC_LOCATION_REACH),
        help_text=_(u'Does this location describe where the activity takes place or where the '
                    u'intended beneficiaries reside?')
    )
    location_class = ValidXMLCharField(
        _(u'class'), blank=True, max_length=1, choices=codelist_choices(GEOGRAPHIC_LOCATION_CLASS),
        help_text=_(u'Does the location refer to a physical structure such as a building, a '
                    u'populated place (e.g. city or village), an administrative division, or '
                    u'another topological feature (e.g. river, nature reserve)? For reference: '
                    u'<a href="http://iatistandard.org/202/codelists/GeographicLocationClass/" '
                    u'target="_blank">http://iatistandard.org/202/codelists/'
                    u'GeographicLocationClass/</a>.')
    )
    feature_designation = ValidXMLCharField(
        _(u'feature designation'), blank=True, max_length=5,
        choices=codelist_choices(LOCATION_TYPE),
        help_text=_(u'A more refined coded classification of the type of feature referred to by '
                    u'this location. For reference: <a href="http://iatistandard.org/202/codelists/'
                    u'LocationType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'LocationType/</a>.')
    )

    def __unicode__(self):
        return u'{0}, {1}{2}'.format(
            u'{0}: {1}'.format(
                _(u'Latitude'),
                unicode(self.latitude) if self.latitude else _(u'No latitude specified')),
            u'{0}: {1}'.format(
                _(u'Longitude'),
                unicode(self.longitude) if self.longitude else _(u'No longitude specified')),
            u' ({0})'.format(self.name) if self.name else u''
        )

    def iati_country(self):
        return codelist_value(Country, self, 'country')

    def iati_country_unicode(self):
        return unicode(self.iati_country())

    def iati_vocabulary(self):
        return codelist_value(GeographicVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return unicode(self.iati_vocabulary())

    def iati_exactness(self):
        return codelist_value(GeographicExactness, self, 'exactness')

    def iati_exactness_unicode(self):
        return unicode(self.iati_exactness())

    def iati_reach(self):
        return codelist_value(GeographicLocationReach, self, 'location_reach')

    def iati_reach_unicode(self):
        return unicode(self.iati_reach())

    def iati_class(self):
        return codelist_value(GeographicLocationClass, self, 'location_class')

    def iati_class_unicode(self):
        return unicode(self.iati_class())

    def iati_designation(self):
        return codelist_value(LocationType, self, 'feature_designation')

    def iati_designation_unicode(self):
        return unicode(self.iati_designation())


# Over-riding fields doesn't work in Django < 1.10, and hence this hack.
ProjectLocation._meta.get_field('country').help_text = _(
    u'The country or countries that benefit(s) from the activity.'
)


class AdministrativeLocation(models.Model):
    location = models.ForeignKey(
        'ProjectLocation', verbose_name=_(u'location'), related_name='administratives'
    )
    code = ValidXMLCharField(
        _(u'administrative code'), blank=True, max_length=25,
        help_text=_(u'Coded identification of national and sub-national divisions according to '
                    u'recognised administrative boundary repositories. Multiple levels may be '
                    u'reported.')
    )
    vocabulary = ValidXMLCharField(
        _(u'administrative vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(GEOGRAPHIC_VOCABULARY),
        help_text=_(u'For reference: <a href="http://iatistandard.org/202/codelists/'
                    u'GeographicVocabulary/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'GeographicVocabulary/</a>.')
    )

    level = models.PositiveSmallIntegerField(_(u'administrative level'), blank=True, null=True)

    def __unicode__(self):
        return unicode(self.code) if self.code else u'%s' % _(u'No code specified')

    def iati_vocabulary(self):
        return codelist_value(GeographicVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return unicode(self.iati_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'location administrative')
        verbose_name_plural = _(u'location administratives')


class ProjectUpdateLocation(BaseLocation):
    location_target = models.ForeignKey('ProjectUpdate', related_name='locations')
