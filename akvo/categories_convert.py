# -*- coding: utf-8 -*-

################################################################################
#Conversion script to create new Category objects for projects instead of the
#boolean category fields in the project model.
#
#Starts of with creating the FocusArea objects listed in the focus_areas list.
#
#The project Category objects will be linked to the Water and sanitation FocusArea
################################################################################

import sys, types

from django.core.management import setup_environ
import settings
setup_environ(settings)

from akvo.rsr.models import Project, Category, FocusArea, Benchmarkname, Benchmark
from akvo.rsr.signals import create_benchmark_objects

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
print

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
print

#mapping between categories and the benchmarks for that cat, old and possibly new names
category_benchmarks = {
    'Water': ['water_systems', ('improved_water', 'number of people affected',), ('improved_water_years', 'duration of impact (years)', ),],
    'Sanitation': ['sanitation_systems', 'hygiene_facilities', ('improved_sanitation', 'number of people affected',), ('improved_sanitation_years', 'duration of impact (years)', ),],
    'Training': ['trainees',],
    'Education': ['trainees',],
}

for cat_name, bm_names in category_benchmarks.items():
    category = Category.objects.get(name=cat_name)
    for name in bm_names:
        if isinstance(name, types.TupleType):
            bm_name = name[1]
        else:
            bm_name = name.replace('_', ' ')
        new_bmn, created = Benchmarkname.objects.get_or_create(name=bm_name)
        if created:
            print 'No benchmark name "%s". Creating...' % (new_bmn.name, )
        else:
            print 'Found benchmark name "%s", with ID %d.' % (new_bmn.name, new_bmn.pk)            
        try:
            category.benchmarknames.get(name=bm_name)
            print 'Benchmark "%s" already is part of Category "%s".' % (new_bmn.name, category.name)
        except:
            category.benchmarknames.add(new_bmn)
            print 'Added benchmark "%s" to Category "%s".' % (new_bmn.name, category.name)

projects = Project.objects.all()
for project in projects:
    print "Project %d:" % (project.pk, )
    for category in Category.objects.filter(focus_area__name="Water and sanitation"):
        if getattr(project, 'category_%s' % category.name.lower(), False):
            project.categories.add(category)
            print "    Belongs to cat %s" % category.name                

    create_benchmark_objects(project)

    for cat_name, bm_names in category_benchmarks.items():
        category = Category.objects.get(name=cat_name)
        if project.categories.filter(pk=category.pk):
            for name in bm_names:
                if isinstance(name, types.TupleType):
                    bm_name = name[1]
                    project_prop = name[0]
                else:
                    bm_name = name.replace('_', ' ')
                    project_prop = name
                benchmark = Benchmark.objects.get(project=project, category=category, name__name=bm_name)
                benchmark.value = getattr(project, project_prop, 0)
                benchmark.save()
                print '    "%s" category benchmark "%s" set to %d.' % (category.name, benchmark.name, benchmark.value)
            
#projects = Project.objects.all()
#water_cat = Category.objects.get(name='Water')
#san_cat = Category.objects.get(name='Sanitation')
#train_cat = Category.objects.get(name='Training')
#edu_cat = Category.objects.get(name='Education')
#
#
#    create_benchmark_objects(project)
#
#    cats = [category for category in project.categories.all()]
#
#    if project.water_systems and not water_cat in cats:
#        output = "Not in category Water with benchmark water_systems = %d\n" % project.water_systems
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.improved_water and not water_cat in cats:
#        output += "Not in category Water with benchmark improved_water = %d\n" % project.improved_water
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.improved_water_years and not water_cat in cats:
#        output += "Not in category Water with benchmark improved_water_years = %d\n" % project.improved_water_years
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.sanitation_systems and not san_cat in cats:
#        output += "Not in category Sanitation with benchmark sanitation_systems = %d\n" % project.sanitation_systems
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.hygiene_facilities and not san_cat in cats:
#        output += "Not in category Sanitation with benchmark hygiene_facilities = %d\n" % project.hygiene_facilities
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.improved_sanitation and not san_cat in cats:
#        output += "Not in category Sanitation with benchmark improved_sanitation = %d\n" % project.improved_sanitation
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.improved_sanitation_years and not san_cat in cats:
#        output += "Not in category Sanitation with benchmark improved_sanitation_years = %d\n" % project.improved_sanitation_years
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()
#    if project.trainees and not (train_cat in cats or edu_cat in cats):
#        output += "Not in category Training or Education with benchmark trainees = %d\n" % project.trainees
#    else:
#        benchmark = Benchmark.objects.get(project=project, category=water_cat, name='water systems')
#        benchmark.value = project.water_systems
#        benchmark.save()

