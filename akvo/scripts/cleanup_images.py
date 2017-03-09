#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'
from akvo import settings

from akvo.rsr.models import Organisation, Project, ProjectUpdate
from akvo.utils import model_and_instance_based_filename


def temp_image(obj, file_name):
    return 'db/temp/%s' % file_name


def cleanup_images(queryset):
    """Clean out the images file tree of old images.
    The method for cleaning out old images is as follows:
        for every object of the relevant model
            for each image field
                save the image to a temp directory
            remove all images in the "real" directory for the object
            for each image field
                save the image back to the "real" dir
    """
    for obj in queryset:
        opts = obj._meta
        for f in opts.fields:
            if type(f).__name__ == 'ImageField':
                model_field = getattr(obj, f.name)
                if hasattr(model_field, 'file'):
                    print "Temp saving:", model_field.name
                    name = os.path.split(model_field.name)[1]
                    # save the func used for upload_to. model_field.field.generate_filename points
                    # to the model's  image_path() function, but the function isn't a true model method
                    # leading to problems when trying to get it from the model.
                    # There's probably some introspection way to get to the func
                    orig_image_path = model_field.field.generate_filename
                    model_field.field.generate_filename = temp_image
                    model_field.save(name, model_field.file)
        path = obj.image_path('')
        full_path = os.path.join(settings.MEDIA_ROOT, path)
        try:  # path might not exist, for updates without images for instance
            for file_name in os.listdir(full_path):
                try:
                    os.remove(os.path.join(full_path, file_name))
                except OSError:
                    pass
        except OSError:
            pass
        # time to reverse
        for f in opts.fields:
            if type(f).__name__ == 'ImageField':
                model_field = getattr(obj, f.name)
                if hasattr(model_field, 'file'):
                    current_name = os.path.split(model_field.name)[1]
                    name_parts = current_name.split('_')
                    # check if file name fits pattern
                    if (name_parts[0] == opts.object_name and name_parts[1] == unicode(obj.pk) and name_parts[2] == f.name.split('_')[0]):
                        # remove any trailing '_' that may occur if cleanup was run more than once
                        # without emptying the temp dir
                        current_name = os.path.splitext(current_name)[0].strip('_') + os.path.splitext(current_name)[1]
                        name = current_name
                    else:
                        # files with non-conformant names get fixed.
                        name = model_and_instance_based_filename(opts.object_name, obj.pk, f.name, model_field.name)
                    model_field.field.generate_filename = orig_image_path
                    model_field.save(name, model_field.file)
                    print "Putting back:", model_field.name


def cleanup():
    projects = Project.objects.all()
    cleanup_images(projects)

    orgs = Organisation.objects.all()
    cleanup_images(orgs)

    updates = ProjectUpdate.objects.all()
    cleanup_images(updates)

if __name__ == '__main__':
    cleanup()
