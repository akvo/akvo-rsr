# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.custom_field import ProjectCustomField
from akvo.rsr.models.iati_import_log import IatiImportLog, LOG_ENTRY_TYPE
from akvo.rsr.models.organisation import Organisation, ORG_TYPE_NGO
from akvo.rsr.models.project import Project

from decimal import Decimal, InvalidOperation
from datetime import datetime

from django.conf import settings
from django.db.models.fields import FieldDoesNotExist

TRUE_VALUES = ['true', '1', 't', 'yes']
FALSE_VALUES = ['false', '0', 'f', 'no']


def akvo_ns(tag_or_attr):
    """
    Add Akvo namespace to a tag or attribute identifier. E.g. tag_or_attr = 'budget-item' will
    return '{http://akvo.org/iati-activities}budget-item'
    :param tag_or_attr: string
    :return: the string prefixed with the akvo namespace
    """
    return "{{{}}}{}".format(settings.AKVO_NS, tag_or_attr)


def xml_ns(tag_or_attr):
    """
    Add Akvo namespace to a tag or attribute identifier. E.g. tag_or_attr = 'budget-item' will
    return '{http://akvo.org/iati-activities}budget-item'
    :param tag_or_attr: string
    :return: the string prefixed with the akvo namespace
    """
    XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
    return "{{{}}}{}".format(XML_NAMESPACE, tag_or_attr)


class ImportMapper(object):
    """
    The ImportMapper holds data that is used over the whole import of an activity, and provides a
    number of helper methods for extracting and massaging the data from the XML.

    The ImportMapper is not used directly but is sub-classed for each tag or group of tags that we
    want to extract data from into one RSR model. The sub-class must implement the do_import()
    method where the actual mapping between the IATI XML data and the RSR models takes place.

    In the base class a bunch of helper methods are defined, for common use cases of extracting data
    from the XML.
    """
    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        """

        :param iati_import_job: The IatiImportJob object for the current import
        :param parent_elem: this is usually the iati-activity, but in some cases it is another
            element that has a number of sub-elements of the same kind, e.g. transaction/sector
        :param project: the project we are assembling the data for
        :param globals: the attributes on the iati-activities tag
        :param related_obj: Related fields on the RSR models are usually to the Project object, but
            in some cases it is another object to which we need to make a relation. In those cases
            we use related_obj
        """
        self.iati_import_job = iati_import_job
        # most often parent_elem is the activity element
        self.parent_elem = parent_elem
        self.project = project
        self.globals = globals
        # used for relations that are not to Project
        self.related_obj = related_obj
        self.model = Project
        self._log_objects = []

    def get_or_create_organisation(self, ref='', name=''):
        """
        Looks for an organisation in the RSR database.
        First the ref will be looked up in the Organisation.iati_org_id field. If this does not
        exist, the name will be looked up in the Organisation.name and Organisation.long_name
        fields. If none of these return a match, a new organisation will be created.

        :param ref: String; the reference of the organisation that is specified in the IATI file.
        :param name: String; the name of the organisation that is specified in the IATI file.
        :return: Organisation instance or None
        """
        if not (ref or name):
            return None

        if ref:
            try:
                return Organisation.objects.get(iati_org_id=ref)
            except Organisation.DoesNotExist:
                pass

        if name:
            try:
                return Organisation.objects.get(name=name[:25])
            except Organisation.DoesNotExist:
                try:
                    return Organisation.objects.get(long_name=name[:75])
                except Organisation.DoesNotExist:
                    pass

        return Organisation.objects.create(
            name=name[:25],
            long_name=name[:75],
            iati_org_id=ref if ref else None,
            organisation_type=ORG_TYPE_NGO,
            content_owner=self.project.reporting_org
        )

    def do_import(self):
        raise NotImplementedError('do_import() must be overridden in the sub-class')

    def skip_importing(self, tag_name):
        """
        Check if this type of data is to be ignored for the import.

        Any existing data remains unchanged. Note that even if only one tag of a kind has
        akvo:import="false" all data of that type is ignored.
        :param tag_name: Name of the "top level" tag we're checking
        :return: True if any of the checked tags has the akvo:import attr set to a value in
            FALSE_VALUES
        """
        for tag in self.parent_elem.findall(tag_name):
            import_attr = self.get_attrib(tag, akvo_ns('import'), 'no_field', None)
            if import_attr and import_attr.lower() in FALSE_VALUES:
                return True
        return False

    def add_log(self, tag, field, error, message_type=LOG_ENTRY_TYPE.CRITICAL_ERROR):
        """
        Add a log entry in the IatiImportLog model. Because of the transactions we're in at this
        stage, the IatiImportLog is not saved to the DB here, because, if the transaction rolls
        back, the IatiImportLog object would cease to exist! Instead we add the IatiImportLog to a
        list that is iterated over after the transaction in IatiImportJob.run() is completed.

        Also I tried adding the IatiActivityImport object here, but that doesn't work either.
        The iati_activity_import object isn't instantiated in the DB yet, and thus has no PK,
        resulting in NULL pointers for the IatiImportLog.iati_activity_import field.
        The iati_activity_import is set later in IatiImportJob.save_import_logs() when
        iati_activity_import "exists".

        :param tag: String; the tag in the iati-activity, possibly with an added @attribute
        :param field: String; the field on the RSR model
        :param error: String; error description
        :param severity: Integer
        """

        self._log_objects += [IatiImportLog(
            iati_import_job=self.iati_import_job,
            tag=tag,
            model=self.model,
            field=field,
            text=error,
            project=self.project,
            message_type=message_type,
            created_at=datetime.now(),
        )]

    def get_text(self, element):
        """
        Returns the text of an element. Based on the IATI version, this is the direct text of the
        element (v1) or the the text in the underlying 'narrative' element (v2).
        Some elements have no narrative sub-element in v2 so if no narrative child is found we
        return the text under v2 also

        :param element: ElementTree node
        :return: String; text of the element or ''
        """
        if self.globals['version'][0] == '1':
            return element.text.strip() if element.text else ''
        else:
            if element.find('narrative') is not None:
                text = element.findtext('narrative', default='')
                return text.strip() if text else ''
            return element.text.strip() if element.text else ''

    def check_text_length(self, element, text, field, log=True):
        """
        Checks the length of a text against the max_length of a field on self.model.
        If the text is too long a log message is created and the text returned is truncated to
        max_length characters.

        :param element: ElementTree node. Only used to get the tag for logging
        :param text: the text under scrutiny
        :param field: the name of the model field who's max_length attribute is checked against
        :param log: add log entry when text is longer than max_length
        :return: the text, possibly truncated to max_length
        """
        try:
            max_length = self.model._meta.get_field(field).max_length
        except (AttributeError, FieldDoesNotExist):
            return text
        if max_length and len(text) > max_length:
            if log:
                self.add_log(element.tag,
                             field,
                             '{}[@{}] field is too long ({} characters allowed)'.format(element.tag,
                                                                                        field,
                                                                                        max_length),
                             LOG_ENTRY_TYPE.VALUE_PARTLY_SAVED)
            return text[:max_length]
        return text

    def add_custom_field(self, name, text, section):
        """
        In case the text of a field is too long, we store the full text in a custom field. Or update
        the field if the field already exists.

        :param name: String; field name
        :param text: String; field text
        :param section: Integer; field section
        """
        if self.project and name and section:
            custom_field, _created = ProjectCustomField.objects.get_or_create(
                project=self.project,
                name=name,
                section=section,
                max_characters=0,
                help_text='',
                mandatory=False,
                order=0
            )
            if custom_field.value != text:
                custom_field.value = text
                custom_field.save(update_fields=['value'])

    def delete_custom_field(self, name, section):
        """
        In case the text of a field is not too long, the custom field should be deleted if it exists.

        :param name: String; field name
        :param section: Integer; field section
        """
        if self.project and name and section:
            try:
                custom_field = ProjectCustomField.objects.get(
                    project=self.project,
                    name=name,
                    section=section
                )
                custom_field.delete()
            except ProjectCustomField.DoesNotExist:
                pass

    def check_text_length_and_set_custom_field(self, element, text, field, cf_section):
        """
        Here we add a custom field for texts that don't fit in their specified fields. If a field is
        updated with short enough text any existing custom field is deleted.
        :param element: ElementTree node; Only used to get the tag for logging
        :param text: String; field text
        :param field: String; the name of the model field who's max_length attribute is checked
            against; also used for the custom field name
        :param cf_section: int; the section where the custom field is visible in the project editor
        :return:
        """
        checked = self.check_text_length(element, text, field)
        if len(text) != len(checked):
            self.add_custom_field(field, text, cf_section)
        else:
            self.delete_custom_field(field, cf_section)
        return checked

    def get_attrib(self, element, attr, field, default=''):
        """
        Find an element attribute value. If no value is found return default.
        If the value is longer than max_length of the associated model field, log an error and
        return default

        :param element: ElementTree node
        :param attr: the node attribute we want the value of
        :param field: the name of the model field who's max_length attribute is checked against
        :param default: a default value returned if no value is found or the value is too long
        :return: a string or the value of the default param
        """
        value = element.get(attr)
        if value is None:
            return default
        try:
            max_length = self.model._meta.get_field(field).max_length
        except (AttributeError, FieldDoesNotExist):
            return value
        if not max_length:
            return value
        if len(element.attrib[attr]) <= max_length:
            return value
        else:
            self.add_log("{}[@{}]".format(element.tag, attr),
                         field,
                         '{}[@{}] field is too long ({} characters allowed)'.format(element.tag,
                                                                                    attr,
                                                                                    max_length))
        return default

    def get_attrib_as_int(self, element, attr, field, default=None):
        value = self.get_attrib(element, attr, field, default)
        if value == '0' or value:
            return self.cast_to_int(value, attr, field)
        else:
            return default

    def get_child_elem_attrib(self, parent, tag, attr, field, default=''):
        """
        Find a child element. Then use get_attrib() to return the value of an attribute on the child

        :param parent: ElementTree node
        :param tag: the tag name of the child node we're looking for
        :param attr: the node attribute we want the value of
        :param field: the name of a model field. Used to lookup max_length
        :param default: a default value returned if no child is found
        :return: String or the value of the default param
        """
        element = parent.find(tag)
        if element is not None:
            return self.get_attrib(element, attr, field, default)
        return default

    def get_element_text(self, element, field, default=''):
        """
        Wrapper method combining self.get_text() and self.check_text_length().
        Find the text of an element. Check its length and return it possibly truncated
        :param parent: ElementTree node
        :param field: the name of a model field. Used to lookup max_length
        :param default: default value to return if text is ''
        :return: String; possibly truncated to length max_length
        """
        text = self.get_text(element)
        if text:
            return self.check_text_length(element, text, field)
        return default

    def get_child_element_text(self, parent, tag, field, default='', return_element=False):
        """
        Wrapper method combining finding a child node with self.get_element_text()

        :param parent: ElementTree node
        :param tag: the tag name of the child node we're looking for
        :param field: the name of a model field. Used to lookup max_length
        :param default: default value to return if we find mo element
        :param return_element: indicates if we are to return the element as well as the text
        :return: String; possibly truncated to length max_length; OR: String, ElementTree node
            if no string is found return default
        """
        element = parent.find(tag)
        if element is not None:
            text = self.get_element_text(element, field, default)
            if return_element:
                return text, element
            else:
                return text
        if return_element:
            return default, None
        else:
            return default

    def get_date(self, element, attr, field):
        """
        Try to find a date, first in the attr attribute, if that fails on the node itself,
        using self.get_text()

        :param parent: ElementTree node
        :param attr: the node attribute we want the value of
        :param field: the name of a model field. Used for error logging
        :return: datetime.Datetime object or none
        """
        date_text = element.get(attr)
        if not date_text:
            date_text = self.get_text(element)
        if date_text:
            try:
                return datetime.strptime(date_text, '%Y-%m-%d').date()
            except ValueError as e:
                self.add_log(element, field, str(e))
                return None
        return None

    def get_child_as_date(self, parent, tag, attr, field):
        """
        Wrapper method. Finds and returns a date on a child node.

        :param parent: ElementTree node
        :param tag: the tag name of the child node we're looking for
        :param attr: the node attribute we want the value of
        :param field: the name of a model field. Used for error logging
        :return: datetime.Datetime object or none
        """
        element = parent.find(tag)
        if element is not None:
            return self.get_date(element, attr, field)
        return None

    def cast_to_decimal(self, value, tag, field):
        """
        Cast a value to Decimal. Log errors.
        :param value: int or float; the value to be cast
        :param tag: String; used for logging
        :param field: String; used for logging
        :return: Decimal(value) or None if the casting fails
        """
        try:
            return Decimal(value)
        except InvalidOperation as e:
            self.add_log(tag, field, str(e))
            return None

    def cast_to_int(self, value, tag, field):
        """
        Cast a value to int. Log errors.
        :param value: string (or float although that's not what the method is intended for);
            the value to be cast
        :param tag: String; used for logging
        :param field: String; used for logging
        :return: int(value) or None if the casting fails
        """
        try:
            return int(value)
        except (ValueError, TypeError) as e:
            self.add_log(tag, field, str(e))
            return None

    def get_child_element_text_as_decimal(self, parent, tag, field, default=''):
        """
        Wrapper method for casting the value of a child element. Uses get_child_element_text() and
        cast_to_decimal().
        :param parent: ElementTree node
        :param tag: String; the tag name of the child node we're looking for
        :param field: String; the name of a model field. Used for error logging
        :param default: a default value returned if no value is found or the value is too long
        :return: Decimal of the value OR None if the casting fails
        """
        value = self.get_child_element_text(parent, tag, field, default)
        if value == '0' or value:
            value = self.cast_to_decimal(value, tag, field)
        return value

    def update_project_field(self, field, current_value):
        """
        Update a field on the self.project object
        :param field: the name of the Project field
        :param current_value: the current value of the field on self.project
        :return: the field name if it was updated, otherwise []
        """
        project = self.project
        if getattr(project, field) != current_value:
            setattr(project, field, current_value)
            project.save(update_fields=[field])
            return [field]
        return []

    def delete_objects(self, reverse_manager, existing, field_label):
        """
        Compare the objects on the reverse_manager with the existing list of objects.
        Remove any objects not found in existing
        :param reverse_manager: Django model manager
        :param existing: list; the list of existing objects
        :param field_label: String; the name of the field related name
        :return: list; the deleted objects
        """
        changes = []
        for obj in reverse_manager.all():
            if obj not in existing:
                obj.delete()
                changes.append(u'deleted {} (id: {}): {}'.format(
                        field_label, obj.pk, obj.__unicode__()))
        return changes

    def to_boolean(self, value):
        """
        Cast a value to Boolean, using a number of values treated as true/false in the IATI XML
        :param value: String; the value to be cast
        :return: True, False or None
        """
        if value.lower() in TRUE_VALUES:
            return True
        elif value.lower() in FALSE_VALUES:
            return False
        else:
            return None
