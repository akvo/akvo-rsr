# -*- coding: utf-8 -*-

#to be run in the akvo rsr root folder. setting up all projects as published, if they have no status
# and setting all orgs to free account if they have none

from django.core.management import setup_environ
import settings
setup_environ(settings)

from rsr.models import *


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
        
if __name__ == '__main__':
    update_publishing_status()
    update_organisation_account()

