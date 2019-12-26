# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import LatitudeField, LongitudeField, ValidXMLCharField
from akvo.codelists.models import (Country, GeographicExactness, GeographicLocationClass,
                                   GeographicLocationReach, GeographicVocabulary, LocationType)
from akvo.codelists.store.default_codelists import (
    COUNTRY, GEOGRAPHIC_EXACTNESS, GEOGRAPHIC_LOCATION_CLASS, GEOGRAPHIC_LOCATION_REACH,
    GEOGRAPHIC_VOCABULARY, LOCATION_TYPE
)
from akvo.utils import codelist_choices, codelist_value


class BaseLocation(models.Model):
    latitude = LatitudeField(
        _('latitude'), null=True, blank=True, db_index=True, default=None,
        help_text=_('Use a period to denote decimals.')
    )
    longitude = LongitudeField(
        _('longitude'), null=True, blank=True, db_index=True, default=None,
        help_text=_('Use a period to denote decimals.')
    )
    city = ValidXMLCharField(_('city'), blank=True, max_length=255)
    state = ValidXMLCharField(_('state'), blank=True, max_length=255)
    address_1 = ValidXMLCharField(_('address 1'), max_length=255, blank=True)
    address_2 = ValidXMLCharField(_('address 2'), max_length=255, blank=True)
    postcode = ValidXMLCharField(_('postal code'), max_length=10, blank=True)
    country = models.ForeignKey('Country', null=True, blank=True, verbose_name=_('country'))

    def __unicode__(self):
        return '{0}, {1}, {2}{3}'.format(
            '{0}: {1}'.format(
                _('Latitude'),
                str(self.latitude) if self.latitude else _('No latitude specified')),
            '{0}: {1}'.format(
                _('Longitude'),
                str(self.longitude) if self.longitude else _('No longitude specified')),
            '{0}: {1}'.format(
                _('Country'),
                str(self.country.name) if self.country else _('No country specified')),
            ' ({0})'.format(self.name) if getattr(self, 'name', None) else ''
        )

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
    location_target = models.ForeignKey('Organisation', related_name='locations')
    iati_country = ValidXMLCharField(
        _('country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_('The country in which the organisation is located.')
    )

    def iati_country_value(self):
        return codelist_value(Country, self, 'iati_country')

    def iati_country_value_unicode(self):
        return str(self.iati_country_value())


class ProjectLocation(BaseLocation):

    project_relation = 'locations__in'

    location_target = models.ForeignKey('Project', related_name='locations')

    # Additional IATI fields
    reference = ValidXMLCharField(
        _('reference'), blank=True, max_length=50,
        help_text=_('An internal reference that describes the location in the reporting '
                    'organisation\'s own system. For reference see: '
                    '<a href="http://iatistandard.org/202/activity-standard/iati-activities/'
                    'iati-activity/location/#attributes" target="_blank">'
                    'http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/'
                    'location/#attributes</a>.')
    )
    location_code = ValidXMLCharField(
        _('code'), blank=True, max_length=25,
        help_text=_('Enter a code to identify the region. Codes are based on DAC region codes. '
                    'Where an activity is considered global, the code 998 can be used. For '
                    'reference: <a href="http://www.oecd.org/dac/stats/dacandcrscodelists.htm" '
                    'target="_blank">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>.')
    )
    vocabulary = ValidXMLCharField(_('vocabulary'), blank=True, max_length=2,
                                   choices=codelist_choices(GEOGRAPHIC_VOCABULARY))
    name = ValidXMLCharField(
        _('name'), blank=True, max_length=100,
        help_text=_('The human-readable name for the location.')
    )
    description = ValidXMLCharField(
        _('location description'), blank=True, max_length=2000,
        help_text=_('This provides free text space for providing an additional description, if '
                    'needed, of the actual target of the activity. A description that qualifies '
                    'the location, not the activity.')
    )
    activity_description = ValidXMLCharField(
        _('activity description'), blank=True, max_length=2000,
        help_text=_('A description that qualifies the activity taking place at the location. '
                    'This should not duplicate information provided in the main activity '
                    'description, and should typically be used to distinguish between activities '
                    'at multiple locations within a single iati-activity record.')
    )
    exactness = ValidXMLCharField(
        _('location precision'), blank=True, max_length=1,
        choices=codelist_choices(GEOGRAPHIC_EXACTNESS),
        help_text=_('Defines whether the location represents the most distinct point reasonably '
                    'possible for this type of activity or is an approximation due to lack of '
                    'more detailed information.')
    )
    location_reach = ValidXMLCharField(
        _('reach'), blank=True, max_length=1, choices=codelist_choices(GEOGRAPHIC_LOCATION_REACH),
        help_text=_('Does this location describe where the activity takes place or where the '
                    'intended beneficiaries reside?')
    )
    location_class = ValidXMLCharField(
        _('class'), blank=True, max_length=1, choices=codelist_choices(GEOGRAPHIC_LOCATION_CLASS),
        help_text=_('Does the location refer to a physical structure such as a building, a '
                    'populated place (e.g. city or village), an administrative division, or '
                    'another topological feature (e.g. river, nature reserve)? For reference: '
                    '<a href="http://iatistandard.org/202/codelists/GeographicLocationClass/" '
                    'target="_blank">http://iatistandard.org/202/codelists/'
                    'GeographicLocationClass/</a>.')
    )
    feature_designation = ValidXMLCharField(
        _('feature designation'), blank=True, max_length=5,
        choices=codelist_choices(LOCATION_TYPE),
        help_text=_('A more refined coded classification of the type of feature referred to by '
                    'this location. For reference: <a href="http://iatistandard.org/202/codelists/'
                    'LocationType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'LocationType/</a>.')
    )

    def iati_country(self):
        return codelist_value(Country, self, 'country')

    def iati_country_unicode(self):
        return str(self.iati_country())

    def iati_vocabulary(self):
        return codelist_value(GeographicVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())

    def iati_exactness(self):
        return codelist_value(GeographicExactness, self, 'exactness')

    def iati_exactness_unicode(self):
        return str(self.iati_exactness())

    def iati_reach(self):
        return codelist_value(GeographicLocationReach, self, 'location_reach')

    def iati_reach_unicode(self):
        return str(self.iati_reach())

    def iati_class(self):
        return codelist_value(GeographicLocationClass, self, 'location_class')

    def iati_class_unicode(self):
        return str(self.iati_class())

    def iati_designation(self):
        return codelist_value(LocationType, self, 'feature_designation')

    def iati_designation_unicode(self):
        return str(self.iati_designation())


# Over-riding fields doesn't work in Django < 1.10, and hence this hack.
ProjectLocation._meta.get_field('country').help_text = _(
    'The country or countries that benefit(s) from the activity.'
)


class AdministrativeLocation(models.Model):

    project_relation = 'locations__administratives__in'

    location = models.ForeignKey(
        'ProjectLocation', verbose_name=_('location'), related_name='administratives'
    )
    code = ValidXMLCharField(
        _('administrative code'), blank=True, max_length=25,
        help_text=_('Coded identification of national and sub-national divisions according to '
                    'recognised administrative boundary repositories. Multiple levels may be '
                    'reported.')
    )
    vocabulary = ValidXMLCharField(
        _('administrative vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(GEOGRAPHIC_VOCABULARY),
        help_text=_('For reference: <a href="http://iatistandard.org/202/codelists/'
                    'GeographicVocabulary/" target="_blank">http://iatistandard.org/202/codelists/'
                    'GeographicVocabulary/</a>.')
    )

    level = models.PositiveSmallIntegerField(_('administrative level'), blank=True, null=True)

    def __unicode__(self):
        return str(self.code) if self.code else '%s' % _('No code specified')

    def iati_vocabulary(self):
        return codelist_value(GeographicVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('location administrative')
        verbose_name_plural = _('location administratives')
        ordering = ('pk',)


class ProjectUpdateLocation(BaseLocation):
    location_target = models.ForeignKey('ProjectUpdate', related_name='locations')
