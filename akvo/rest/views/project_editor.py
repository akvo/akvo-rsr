# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from collections import namedtuple
import json

from django.apps import apps
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
from django.utils.encoding import smart_unicode
from django.utils.translation import ugettext_lazy as _
from rest_framework import status as http_status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.exceptions import ValidationError as RestValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from sorl.thumbnail import get_thumbnail

from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import (
    Indicator, IndicatorPeriod, Keyword, Organisation, Project, ProjectEditorValidationSet, Result
)
from .project_editor_utils import (
    convert_related_objects, create_object, create_or_update_objects_from_data, log_changes,
    split_key, update_object
)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor(request, pk=None):
    """The main API call for saving any data entered in the project editor."""

    # Retrieve project and user information, and check user permissions to edit the project
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    # Retrieve form data and set default values
    data = request.POST.copy()
    errors, changes, rel_objects = create_or_update_objects_from_data(project, data)
    # Update the IATI checks for every save in the editor.
    updated_project = Project.objects.get(pk=pk)
    updated_project.update_iati_checks()

    # Ensure errors are properly encoded
    for error in errors:
        if 'location' in error['name'] and 'Invalid literal' in error['error']:
            error['error'] = 'Only decimal values are accepted.'
        else:
            error['error'] = unicode(error['error'], errors='ignore')

    return Response(
        {
            'changes': log_changes(changes, user, project),
            'errors': errors,
            'rel_objects': convert_related_objects(rel_objects),
            'need_saving': [data],
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@transaction.atomic
def project_editor_reorder_items(request, project_pk=None):
    """API call to reorder results or indicators"""

    errors, item_list, item_selected, swap_id = [], [], None, -1

    item_type = request.POST.get('item_type', False)
    item_id = request.POST.get('item_id', False)
    item_direction = request.POST.get('item_direction', False)

    if item_type == 'result':
        item_selected = Result.objects.get(id=item_id)
        item_list = Result.objects.filter(project_id=project_pk)
    elif item_type == 'indicator':
        item_selected = Indicator.objects.get(id=item_id)
        item_list = Indicator.objects.filter(result_id=item_selected.result_id)
    else:
        errors += ['Invalid item type']

    if not errors:
        # assign order if it doesn't already exist or is messed up
        n_items = item_list.count()
        if n_items > 0 and set(item_list.values_list('order', flat=True)) != set(range(n_items)):
            for i, item in enumerate(item_list):
                item.order = i
                item.save()

        if item_type == 'result':
            item_original_order = Result.objects.get(id=item_id).order
        else:
            item_original_order = Indicator.objects.get(id=item_id).order

        if item_direction == 'up' and not item_original_order < 1:
            item_swap = item_list.get(order=item_original_order - 1)
            item_swap.order = item_original_order
            item_swap.save()

            swap_id = item_swap.id

            if item_selected:
                item_selected.order = item_original_order - 1
                item_selected.save()

        elif item_direction == 'down' and not item_original_order >= len(item_list) - 1:
            item_swap = item_list.get(order=item_original_order + 1)
            item_swap.order = item_original_order
            item_swap.save()

            swap_id = item_swap.id

            if item_selected:
                item_selected.order = item_original_order + 1
                item_selected.save()

        else:
            errors += ['Unable to reorder the selected item, it may already be at top/bottom of '
                       'list.']

    return Response(
        {
            'errors': errors,
            'swap_id': swap_id,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def project_editor_default_periods(request, project_pk=None):
    """API call to set default indicator periods"""

    PeriodDates = namedtuple('PeriodDates', 'period_start period_end')
    errors = []

    def do_return(error=None):
        if error:
            errors.append(error)
        return Response({
            'default_periods': default_indicator.default_periods if default_indicator else False,
            'errors': errors
        })

    indicator_id = request.POST.get('indicator_id')
    try:
        default_indicator = Indicator.objects.get(id=indicator_id)
    except Indicator.DoesNotExist:
        return do_return(_(u'Indicator with ID {} does not exist.').format(indicator_id))

    copy = json.loads(request.POST.get('copy', 'false'))
    set_default = json.loads(request.POST.get('set_default', 'false'))

    if set_default and copy:
        try:
            project = Project.objects.get(pk=project_pk)
        except Project.DoesNotExist:
            return do_return(_(u'Project with ID {} does not exist.'))

        default_periods_dates = [
            PeriodDates(period.period_start, period.period_end)
            for period in IndicatorPeriod.objects.filter(indicator_id=default_indicator)
        ]
        for date_pair in default_periods_dates:
            if not (date_pair.period_start and date_pair.period_end):
                return do_return(
                    _(u'All default periods must have both a start and an end date')
                )

        indicators = Indicator.objects.filter(result__project=project).exclude(
            pk=default_indicator.pk).prefetch_related('periods')

        for indicator in indicators:
            if indicator.periods.exists():
                errors.append(smart_unicode(_(u'Periods already exist for indicator {0}: {1}. '
                                              u'default periods will not be created.'
                                              ).format(indicator.pk, indicator.title)))
            else:
                for date_pair in default_periods_dates:
                    IndicatorPeriod.objects.create(
                        indicator=indicator,
                        period_start=date_pair.period_start,
                        period_end=date_pair.period_end,
                    )

    default_indicator.default_periods = set_default
    default_indicator.save()
    return do_return()


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_upload_file(request, pk=None):
    """Special API call for directly uploading a file."""

    project = Project.objects.get(pk=pk)
    user = request.user

    errors, changes, rel_objects = [], [], {}
    field_id = request.POST.copy()['field_id']
    upload_file = request.data['file']

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    # Retrieve field information first
    key_parts = split_key(field_id)

    # Retrieve the model and related object ID (e.g. rsr_projectdocument.1234_new-0)
    Model = apps.get_model(key_parts.model.app, key_parts.model.model_name)
    related_obj_id = ''.join(
        [key_parts.model.table_name, '.', '_'.join(key_parts.ids)]
    )

    if len(key_parts.ids) == 1:
        # Either the photo or an already existing project document
        changes, errors, rel_objects = update_object(
            Model, key_parts.ids[0], [key_parts.field], [field_id], [upload_file], changes, errors,
            rel_objects, related_obj_id
        )
    else:
        # A non-existing project document
        kwargs = dict()
        kwargs[key_parts.field] = upload_file
        kwargs['project'] = project

        # Add field data, create new object and add new id to rel_objects dict
        changes, errors, rel_objects = create_object(
            Model, kwargs, [key_parts.field], [field_id], [upload_file], changes, errors,
            rel_objects, related_obj_id
        )

    for change in changes:
        # If the file is successfully saved, replace the value with the URL of the new file
        obj = change[0]
        field = change[1][0][0]
        if isinstance(obj, Project):
            change[1][0][2] = get_thumbnail(
                getattr(obj, field), '250x250', format="PNG", upscale=True
            ).url
        else:
            change[1][0][2] = getattr(getattr(obj, field), 'url')

    return Response(
        {
            'errors': errors,
            'changes': log_changes(changes, user, project),
            'rel_objects': convert_related_objects(rel_objects),
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_import_results(request, project_pk=None):
    project = Project.objects.get(pk=project_pk)
    user = request.user

    if not (user.is_superuser or
            user.can_import_results() and user.has_perm('rsr.change_project', project)):
        return HttpResponseForbidden()

    status_code, message = project.import_results()

    if status_code == 1:
        data = {'project_id': project_pk, 'import_success': True}
        status = http_status.HTTP_201_CREATED
    else:
        data = {'project_id': project_pk, 'import_success': False, 'message': message}
        status = http_status.HTTP_400_BAD_REQUEST

    return Response(data=data, status=status)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_copy_results(request, project_pk=None, source_pk=None):
    project = Project.objects.get(pk=project_pk)
    source_project = Project.objects.get(pk=source_pk)
    user = request.user

    if not (user.is_superuser or
            user.can_import_results() and user.has_perm('rsr.change_project', project)):
        return HttpResponseForbidden()

    if not user.has_perm('rsr.change_project', source_project):
        return HttpResponseForbidden()

    data = {'project_id': project_pk, 'copy_success': True}
    try:
        project.copy_results(source_project)
        status = http_status.HTTP_201_CREATED
    except RuntimeError as e:
        data['copy_success'] = False
        data['message'] = e.message
        status = http_status.HTTP_400_BAD_REQUEST

    return Response(data=data, status=status)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@authentication_classes((TastyTokenAuthentication, ))
def project_editor_import_indicator(request, project_pk, parent_indicator_id):
    try:
        project = Project.objects.get(pk=project_pk)
    except Project.DoesNotExist:
        return HttpResponseNotFound()
    except Project.MultipleObjectsReturned:
        return HttpResponseBadRequest()

    user = request.user
    if not (user.can_import_results() and user.has_perm('rsr.change_project', project)):
        return HttpResponseForbidden()

    try:
        indicator = project.import_indicator(parent_indicator_id)
    except (Project.DoesNotExist, Project.MultipleObjectsReturned, Indicator.DoesNotExist,
            Indicator.MultipleObjectsReturned, ValidationError) as e:
        raise RestValidationError(e.message)

    data = {'indicator_id': indicator.pk, 'import_success': True}
    return Response(data=data, status=http_status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_add_validation(request, project_pk=None, validation_pk=None):
    project = Project.objects.get(pk=project_pk)
    validation_set = ProjectEditorValidationSet.objects.get(pk=validation_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    if validation_set not in project.validations.all():
        project.validations.add(validation_set)

        change_message = u'%s %s.' % (_(u'Project editor, added: validation set'),
                                      validation_set.__unicode__())

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({})


@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def project_editor_remove_validation(request, project_pk=None, validation_pk=None):
    project = Project.objects.get(pk=project_pk)
    validation_set = ProjectEditorValidationSet.objects.get(pk=validation_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    if validation_set in project.validations.all():
        project.validations.remove(validation_set)

        change_message = u'%s %s.' % (_(u'Project editor, deleted: validation set'),
                                      validation_set.__unicode__())

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({})


@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def project_editor_remove_keyword(request, project_pk=None, keyword_pk=None):
    project = Project.objects.get(pk=project_pk)
    keyword = Keyword.objects.get(pk=keyword_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    if keyword in project.keywords.all():
        project.keywords.remove(keyword)

        change_message = u'%s %s.' % (_(u'Project editor, deleted: keyword'),
                                      keyword.__unicode__())

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_organisation_logo(request, pk=None):
    org = Organisation.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_organisation', org):
        return HttpResponseForbidden()

    data = request.data
    errors, changes, rel_objects = [], [], {}

    if 'logo' in data:
        changes, errors, rel_objects = update_object(
            Organisation, pk, ['logo'], [''], [data['logo']], changes, errors,
            rel_objects, 'rsr_organisation.' + str(pk)
        )

    return Response({'errors': errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def log_project_addition(request, project_pk=None):
    project = Project.objects.get(pk=project_pk)
    user = request.user
    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    Project.log_project_addition(project_pk, user)
    content = {'log_entry': 'added successfully'}
    return Response(content, status=http_status.HTTP_201_CREATED)
