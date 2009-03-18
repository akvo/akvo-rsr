# -*- coding: utf-8 -*-

#to be run in the akvo rsr root folder. setting up all projects as published, if they have no status
# and setting all orgs to free account if they have none

from django.core.management import setup_environ
import settings
setup_environ(settings)

from os.path import basename

from rsr.models import *
from django.db.models.fields.files import ImageField

def update_publishing_status():
    projects = Project.objects.all()
    for p in projects:
        try:
            ps = PublishingStatus.objects.get(project=p)    
            #print "Found project %s, already %s" % (ps.project, ps.status)
        except:
            new_ps = PublishingStatus(project=p, status='published')
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
                    name = basename(model_field.name)
                    model_field.save(name, model_field.file)
                #f.save(uploaded_file.name, uploaded_file)

def resave_all_images():
    orgs = Organisation.objects.all()
    resave_images(orgs)
    projs = Project.objects.all()
    resave_images(projs)
    updates = ProjectUpdate.objects.all()
    resave_images(updates)
                
if __name__ == '__main__':
    update_publishing_status()
    update_organisation_account()
    resave_all_images()
