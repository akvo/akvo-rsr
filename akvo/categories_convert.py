# -*- coding: utf-8 -*-

################################################################################
#Conversion script to create new Category objects for projects instead of the
#boolean category fields in the project model.
#
#Starts of with creating the FocusArea objects listed in the focus_areas list.
#
#The project Category objects will be linked to the Water and sanitation FocusArea
################################################################################

import sys

from django.core.management import setup_environ
import settings
setup_environ(settings)

from akvo.rsr.models import Project, Category, FocusArea


focus_areas = [
    {'name': 'All', 'slug': 'all'},
    {'name': 'Water and sanitation', 'slug': 'water-and-sanitation'},
    {'name': 'Education', 'slug': 'education'},
    {'name': 'Healthcare', 'slug': 'healthcare'},
    {'name': 'Economic development', 'slug': 'economic-development'},
    {'name': 'ICT for development', 'slug': 'ict-for-development'},
]

for focus_area in focus_areas:
    new_fa, created = FocusArea.objects.get_or_create(name=focus_area['name'], defaults={'slug': focus_area['slug']})
    if created:
        print "Created %s" % (new_fa.name, )
    else:
        print "Found focus area %s, with ID %d." % (new_fa.name, new_fa.pk)
    
focus_area = FocusArea.objects.get(name='Water and sanitation')

# list used to build the names of the old boolean fields and the new Category objects    
old_cats = ['Water', 'Sanitation', 'Maintenance', 'Training', 'Education', 'Product development', 'Other']

for cat in old_cats:
    new_cat, created = Category.objects.get_or_create(name=cat)
    if created:
        print "No new style category %s. Creating..." % (new_cat.name, )
        new_cat.focus_area.add(focus_area)
    else:
        print "Found new style category %s, with ID %d." % (new_cat.name, new_cat.pk)


projects = Project.objects.all()

for project in projects:
    print "Project %d:" % (project.pk, )
    for category in Category.objects.filter(focus_area__name="Water and sanitation"):
        if getattr(project, 'category_%s' % category.name.lower(), False):
            project.categories.add(category)
            print "    Belongs to cat %s" % category.name
