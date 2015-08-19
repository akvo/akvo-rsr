# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

def merge_keys(apps, schema_editor):
    """ This operation changes a number of keyword labels, listed in the keyword_mergers_labels dict
    from the key (old label) of keyword_mergers_labels to the value (new label).
    """
    # dict with old label: new label
    keyword_mergers_labels = {
        u'Dutch WASH Alliance': u'WASH Alliance',
        u'C4C': u'Connect4Change',
        u'SRHR': u'SRHR Alliance',
        u'f4winternational': u'Football for Water',
        u'IGG-water': u'IGG-water program',
    }
    Keyword = apps.get_model('rsr', 'Keyword')
    Project = apps.get_model('rsr', 'Project')

    # dict holding old labels as keys and the keword objects that replace the old labelled keywords
    keyword_merger_objects = {}
    for old_label in keyword_mergers_labels.keys():
        new_key = Keyword.objects.get(label=keyword_mergers_labels[old_label])
        keyword_merger_objects[old_label] = new_key

    for project in Project.objects.all():
        # create a list of keyword objects for the project
        keywords = [keyword for keyword in project.keywords.all()]
        #loop over project's keywords
        for keyword in keywords:
            # when we find an old labelled key
            if keyword.label in keyword_merger_objects.keys():
                # is the new label not there?
                if not keyword_merger_objects[keyword.label] in keywords:
                    # then add it
                    project.keywords.add(keyword_merger_objects[keyword.label])
                # remove old keyword
                project.keywords.remove(keyword)
                print "Project {}: keyword {} changed to {}".format(
                    project.id, keyword.label, keyword_merger_objects[keyword.label].label
                )
            project.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0023_auto_20150819_1029'),
    ]

    operations = [
        migrations.RunPython(
            merge_keys
        ),
    ]
