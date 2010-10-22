#!/usr/bin/env python
# -*- coding: utf-8 -*-

#to be run in the akvo rsr root folder. setting up all projects as published, if they have no status
# and setting all orgs to free account if they have none

from __future__ import with_statement
from django.core.management import setup_environ
import settings
setup_environ(settings)

from os.path import basename, splitext

from rsr.models import *
from django.db.models.fields.files import ImageField
from django.db.models import get_model
from django.contrib.contenttypes.models import ContentType

def mark_existing_invoices_as_anonymous():
    invoices = get_model('rsr', 'invoice').admin_objects.all()
    for invoice in invoices:
        invoice.is_anonymous = True
        invoice.save()

def mark_test_invoices():
    invoices = get_model('rsr', 'invoice').admin_objects.filter(engine='paypal')
    for invoice in invoices:
        if invoice.ipn:
            related_ipn = get_model('ipn', 'paypalipn').objects.get(invoice=invoice.id)
            if related_ipn.test_ipn:
                invoice.test = True
                invoice.save()

def create_default_mollie_gateway():
    gateway = get_model('rsr', 'molliegateway').objects
    gateway.create(name=u'Default',
        partner_id=325955,
        description=u"Default Akvo Mollie/iDEAL payment gateway",
        notification_email=u'thomas@akvo.org')

def model_and_instance_based_filename(object_name, pk, field_name, img_name):
    return "%s_%s_%s_%s%s" % (
        object_name,
        pk or '',
        field_name,
        datetime.now().strftime("%Y-%m-%d_%H.%M.%S"),
        splitext(img_name)[1],
    )
    
def update_publishing_status():
    projects = Project.objects.all()
    for p in projects:
        try:
            ps = PublishingStatus.objects.get(project=p)    
            #print "Found project %s, already %s" % (ps.project, ps.status)
        except:
            new_ps = PublishingStatus(project=p, status='unpublished')
            new_ps.save()
        
def update_organisation_account():
    orgs = Organisation.objects.all()
    for o in orgs:
        try:
            acc = OrganisationAccount.objects.get(organisation=o)
        except:
            new_acc = OrganisationAccount(organisation=o, account_level='free')
            new_acc.save()

def resave_images(queryset):
    for record in queryset:
        #from dbgp.client import brk
        #brk(host="localhost", port=9000)
        opts = record._meta
        for f in opts.fields:
            if type(f).__name__ == 'ImageField' or type(f).__name__ == 'ImageWithThumbnailsField':
                model_field = getattr(record, f.name)
                if hasattr(model_field, 'file'):
                    #name = basename(model_field.name)
                    name = model_and_instance_based_filename(opts.object_name, record.pk, f.name, model_field.name)
                    model_field.save(name, model_field.file)
                #f.save(uploaded_file.name, uploaded_file)

def resave_all_images():
    orgs = Organisation.objects.all()
    resave_images(orgs)
    projs = Project.objects.all()
    resave_images(projs)
    updates = ProjectUpdate.objects.all()
    resave_images(updates)

def budget_refactor():
    projects = Project.objects.all()
    for p in projects:
        try:
            if p.budget.employment:
                BudgetItem.objects.create(project=p, item='employment', amount=p.budget.employment, currency='EUR')
            if p.budget.building:
                BudgetItem.objects.create(project=p, item='building', amount=p.budget.building, currency='EUR')
            if p.budget.training:
                BudgetItem.objects.create(project=p, item='training', amount=p.budget.training, currency='EUR')
            if p.budget.maintenance:
                BudgetItem.objects.create(project=p, item='maintenance', amount=p.budget.maintenance, currency='EUR')
            if p.budget.other:
                BudgetItem.objects.create(project=p, item='other', amount=p.budget.other, currency='EUR')
        except:
            print "Error importing project budget, for id:", p.id 

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

def create_primary_pvw_project_locations():
    content_type = ContentType.objects.get_for_model(get_model('rsr', 'project'))
    projects = get_model('rsr', 'project').objects.all()
    location = get_model('rsr', 'location').objects
    for p in projects:
        if p.has_valid_legacy_coordinates():
            location.create(latitude=p.latitude, longitude=p.longitude,
                city=p.city, state=p.state, country=p.country,
                content_type=content_type, object_id=p.id,
                primary=True)
            print 'Successfully created location object for project id: %d' % p.id

def create_primary_organisation_locations(): # Akvo RSR only!
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
    create_primary_organisation_locations()
