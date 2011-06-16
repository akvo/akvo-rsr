#!/usr/bin/env python
# -*- coding: utf-8 -*-

#to be run in the akvo rsr root folder. setting up all projects as published, if they have no status
# and setting all orgs to free account if they have none

from django.core.management import setup_environ
import settings
setup_environ(settings)

from django.db.models import get_model



def populate_project_update_time_last_updated():
    # set time_last_updated field to NULL
    updates = get_model('rsr', 'projectupdate').objects.all()
    for update in updates:
        update.time_last_updated = update.time
        update.save()
        print 'Project Update %d last updated timestamp set.' % update.id
    # set time_last_updated field to NOT NULL
    print 'Success!'


if __name__ == '__main__':
    populate_project_update_time_last_updated()
