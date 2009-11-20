# -*- coding: utf-8 -*-

#to be run in the akvo rsr root folder. setting up all projects as published, if they have no status
# and setting all orgs to free account if they have none

from django.core.management import setup_environ
import settings
setup_environ(settings)

from os.path import basename, splitext

from rsr.models import *
from django.db.models.fields.files import ImageField
from django.db.models import get_model

def create_default_mollie_gateway():
    gateway = get_model('rsr', 'molliegateway').objects
    create_it = gateway.create(name=u'Default',
        partner_id=281135,
        description=u'Default Akvo Mollie/iDEAL payment gateway',
        account_email=u'paul.burt@me.com',
        notification_email=u'paul.burt@me.com')

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
                
if __name__ == '__main__':
    #update_publishing_status()
    #update_organisation_account()
    #resave_all_images()
    #budget_refactor()
    create_default_mollie_gateway()
