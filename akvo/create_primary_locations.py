#!/usr/bin/env python
# -*- coding: utf-8 -*-

# to be run in the akvo rsr root folder

from __future__ import with_statement
from django.core.management import setup_environ
import settings
setup_environ(settings)

from django.db.models import get_model

def create_primary_project_locations():
    content_type = ContentType.objects.get_for_model(get_model('rsr', 'project'))
    projects = get_model('rsr', 'project').objects.all()
    location = get_model('rsr', 'location').objects
    for p in projects:
        if p.has_valid_legacy_coordinates():
            latitude, longitude = p.latitude, p.longitude
        else:
            latitude, longitude = 0, 0
        location.create(latitude=latitude, longitude=longitude,
            city=p.city, state=p.state, country=p.country,
            content_type=content_type, object_id=p.id,
            address_1=p.location_1, address_2=p.location_2,
            postcode=p.postcode, primary=True)
        print 'Successfully created location object for project id: %d' % p.id

def create_primary_organisation_locations():
    import csv
    content_type = ContentType.objects.get_for_model(get_model('rsr', 'organisation'))
    location = get_model('rsr', 'location').objects
    with open('org_coordinates.csv', 'r') as file:
        csv_data = csv.reader(file)
        for row in csv_data:
            org_id, latitude, longitude = row[0], row[1], row[2]
            if not latitude == 0 and not longitude == 0:
                try:
                    o = get_model('rsr', 'organisation').objects.get(id=int(org_id))
                    location.create(latitude=latitude, longitude=longitude,
                        city=o.city, state=o.state, country=o.country,
                        content_type=content_type, object_id=o.id,
                        address_1=o.address_1, address_2=o.address_2,
                        postcode=o.postcode, primary=True)
                    print 'Successfully created location object for organisation id: %d' % o.id
                except:
                    print 'Error creating location object for organisation id: %d' % int(org_id)


if __name__ == '__main__':
    create_primary_project_locations()
    create_primary_organisation_locations()
