# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# Based on https://gist.github.com/edelvalle/01886b6f79ba0c4dce66


from __future__ import print_function
from django.apps import apps
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction, IntegrityError
from django.db.models.fields.related import OneToOneRel, ManyToManyRel

from akvo.rsr.models import Organisation


class Command(BaseCommand):
    help = "Script for merging organisations"

    def add_arguments(self, parser):
        parser.add_argument('primary_org_id', type=int)
        parser.add_argument('alias_org_id', type=int)
        parser.add_argument('--no-prompt', action='store_true', default=False)

    def handle(self, *args, **options):
        primary_object = Organisation.objects.get(id=options['primary_org_id'])
        alias_object = Organisation.objects.get(id=options['alias_org_id'])
        proceed = diff_objects(primary_object, alias_object, options['no_prompt'])
        if not proceed:
            raise CommandError('Aborting merge')
        merge(primary_object, alias_object)


@transaction.atomic()
def merge(primary_object, alias_object):
    """Merge several model instances into one, the `primary_object`.
    Use this function to merge model objects and migrate all of the related
    fields from the alias objects the primary object.
    Usage:
        from django.contrib.auth.models import User
        primary_user = User.objects.get(email='good@example.com')
        duplicate_user = User.objects.get(email='good+duplicate@example.com')
        merge(primary_user, duplicate_user)
    Based on: https://djangosnippets.org/snippets/382/
    """
    generic_fields = get_generic_fields()

    # get related fields
    many_to_many_fields, related_fields = discrimine(
        lambda field: isinstance(field, ManyToManyRel),
        primary_object._meta._get_fields(forward=False, include_hidden=True)
    )

    # Migrate all foreign key references from alias object to primary
    # object.
    for related_object in related_fields:
        # The variable name on the alias_object model.
        alias_varname = related_object.get_accessor_name()
        # The variable name on the related model.
        obj_varname = related_object.field.name

        if isinstance(related_object, OneToOneRel):
            obj = getattr(alias_object, alias_varname, None)
            if obj is not None:
                setattr(obj, obj_varname, primary_object)
                obj.save()

        else:
            # FIXME: Not sure why or how this even appears!
            if alias_varname == 'Report_organisations+':
                print('Could not find alias_varname: {}'.format(alias_varname))
                print(alias_object, alias_varname, related_object, obj_varname)
                continue
            related_objects = getattr(alias_object, alias_varname)
            for obj in related_objects.all():
                setattr(obj, obj_varname, primary_object)

                # If unique together constraints are failed to be met, we
                # delete the object, where we tried to replace alias_object
                # with primary_object.
                with transaction.atomic():
                    try:
                        obj.save()
                        saved = True
                    except IntegrityError as e:
                        print(e)
                        saved = False

                if not saved:
                    obj.delete()

    # Migrate all many to many references from alias object to primary
    # object.
    for related_many_object in many_to_many_fields:
        alias_varname = related_many_object.get_accessor_name()
        obj_varname = related_many_object.field.name
        related_many_objects = getattr(alias_object, alias_varname)
        for obj in related_many_objects.all():
            getattr(obj, obj_varname).remove(alias_object)
            getattr(obj, obj_varname).add(primary_object)

    # Migrate all generic foreign key references from alias object to
    # primary object.
    for field in generic_fields:
        filter_kwargs = {}
        filter_kwargs[field.fk_field] = alias_object._get_pk_val()
        filter_kwargs[field.ct_field] = field.get_content_type(alias_object)
        related_objects = field.model.objects.filter(**filter_kwargs)
        for generic_related_object in related_objects:
            setattr(generic_related_object, field.name, primary_object)
            generic_related_object.save()

    if alias_object.id:
        alias_object.delete()

    return primary_object


def get_generic_fields():
    """Return a list of all GenericForeignKeys in all models."""
    generic_fields = []
    for model in apps.get_models():
        for field_name, field in model.__dict__.items():
            if isinstance(field, GenericForeignKey):
                generic_fields.append(field)
    return generic_fields


def discrimine(pred, sequence):
    """Split a collection in two collections using a predicate.

    >>> discrimine(lambda x: x < 5, [3, 4, 5, 6, 7, 8])
    ... ([3, 4], [5, 6, 7, 8])
    """
    positive, negative = [], []
    for item in sequence:
        if pred(item):
            positive.append(item)
        else:
            negative.append(item)
    return positive, negative


def diff_objects(primary, alias, no_prompt):
    """Find which fields differ between the two objects."""

    diff_fields = set()
    ignore_fields = {'id', 'created_at', 'last_modified_at'}

    for field in primary._meta.fields:
        field_name = field.name
        primary_value = getattr(primary, field_name)
        alias_value = getattr(alias, field_name)
        if primary_value != alias_value and alias_value and field_name not in ignore_fields:
            diff_fields.add((field_name, primary_value, alias_value))

    print("The following differences exist between the two models:")
    for field, primary_value, alias_value in diff_fields:
        print("- {}: {} | {}".format(field, primary_value, alias_value).encode('utf-8'))

    if no_prompt:
        return True

    print("On merging models, the first value will be retained, and the second value will be lost.")
    proceed = input('Would you like to proceed with the merge? yes/[no]:')
    return proceed.lower() == 'yes'
