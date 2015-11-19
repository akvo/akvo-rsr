# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.project import Project
from ....rsr.models.project_condition import ProjectCondition

from ..utils import add_log, get_text, ImportHelper

CODE_TO_STATUS = {
    '1': 'H',
    '2': 'A',
    '3': 'C',
    '4': 'C',
    '5': 'L',
    '6': 'R'
}


class Language(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the language.
        The language will be extracted from the 'lang' attribute of the activity root element.

        :return: List; contains fields that have changed
        """

        xml_ns = 'http://www.w3.org/XML/1998/namespace'

        language = self.get_attrib(self.parent_elem, '{{{}}}lang'.format(xml_ns), 'language')
        # if '{%s}lang' % xml_ns in activity.attrib.keys():
        #     if not len(activity.attrib['{%s}lang' % xml_ns]) > 2:
        #         default_language_value = activity.attrib['{%s}lang' % xml_ns].lower()
        #     else:
        #         add_log(iati_import, 'language', 'code too long (2 characters allowed)', project)

        return self.update_project_field('language', language)
        # if self.project.language != language:
        #     self.project.language = language
        #     self.project.save(update_fields=['language'])
        #     return ['language']
        # return []


class Currency(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the currency.
        The currency will be extracted from the 'default-currency' attribute of the activity root
        element.

        :return: List; contains fields that have changed
        """

        currency = self.get_attrib(self.parent_elem, 'default-currency', 'currency', 'EUR')
        # if 'default-currency' in activity.attrib.keys():
        #     if not len(activity.attrib['default-currency']) > 3:
        #         default_currency_value = activity.attrib['default-currency']
        #     else:
        #         add_log(iati_import, 'currency', 'code too long (3 characters allowed)', project)

        return self.update_project_field('currency', currency)
        # if self.project.currency != currency:
        #     self.project.currency = currency
        #     self.project.save(update_fields=['currency'])
        #     return ['currency']
        # return []

class Hierarchy(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the hierarchy.
        The hierarchy will be extracted from the 'hierarchy' attribute of the activity root element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # hierarchy_value = None

        hierarchy = self.get_attrib(self.parent_elem, 'hierarchy', 'hierarchy', None)
        if hierarchy:
            try:
                hierarchy = int(hierarchy)
            except ValueError as e:
                self.add_log('iati-activity@hierarchy', 'hierarchy', str(e))

        # try:
        #     if 'hierarchy' in activity.attrib.keys():
        #         if not len(activity.attrib['hierarchy']) > 1:
        #             hierarchy_value = int(activity.attrib['hierarchy'])
        #         else:
        #             add_log(iati_import, 'hierarchy', 'code too long (1 character allowed)', project)
        # except ValueError as e:
        #     add_log(iati_import, 'hierarchy', str(e), project)

        return self.update_project_field('hierarchy', hierarchy)
        # if project.hierarchy != hierarchy_value:
        #     project.hierarchy = hierarchy_value
        #     project.save(update_fields=['hierarchy'])
        #     return ['hierarchy']
        # return []

class Scope(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the activity scope.
        The scope will be extracted from the 'code' attribute of the 'activity-scope' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # scope_value = ''

        # scope_element = self.activity.find("activity-scope")
        # project_scope = self.get_attrib(scope_element, 'code', 'project_scope')
        project_scope = self.get_child_elem_attrib(
                self.parent_elem, 'activity-scope', 'code', 'project_scope')


        # if not scope_element is None and 'code' in scope_element.attrib.keys():
        #     if not len(scope_element.attrib['code']) > 2:
        #         scope_value = scope_element.attrib['code']
        #     else:
        #         add_log(iati_import, 'scope', 'code too long (2 characters allowed)', project)

        return self.update_project_field('project_scope', project_scope)
        # if project.project_scope != scope_value:
        #     project.project_scope = scope_value
        #     project.save(update_fields=['project_scope'])
        #     return ['project_scope']
        # return []

class CollaborationType(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the collaboration type.
        The collaboration type will be extracted from the 'code' attribute of the
        'collaboration-type' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # ct_value = ''

        # ct_element = self.activity.find("collaboration-type")
        # collaboration_type = self.get_attrib(ct_element, 'code', 'collaboration_type')
        collaboration_type = self.get_child_elem_attrib(
            self.parent_elem, 'collaboration-type', 'code', 'collaboration_type')

        # if not ct_element is None and 'code' in ct_element.attrib.keys():
        #     if not len(ct_element.attrib['code']) > 1:
        #         ct_value = ct_element.attrib['code']
        #     else:
        #         add_log(iati_import, 'collaboration_type', 'code too long (1 characters allowed)',
        #                 project)
        return self.update_project_field('collaboration_type', collaboration_type)
        # if project.collaboration_type != ct_value:
        #     project.collaboration_type = ct_value
        #     project.save(update_fields=['collaboration_type'])
        #     return ['collaboration_type']
        # return []

class DefaultFlowType(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the default flow type.
        The flow type will be extracted from the 'code' attribute of the 'default-flow-type' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # dft_value = ''

        # dft_element = self.activity.find("default-flow-type")
        # default_flow_type = self.get_attrib(dft_element, 'code', 'default_flow_type')
        default_flow_type = self.get_child_elem_attrib(
                self.parent_elem, 'default-flow-type', 'code', 'default_flow_type')
        # if not dft_element is None and 'code' in dft_element.attrib.keys():
        #     if not len(dft_element.attrib['code']) > 2:
        #         dft_value = dft_element.attrib['code']
        #     else:
        #         add_log(iati_import, 'default_flow_type', 'code too long (2 characters allowed)',
        #                 project)
        return self.update_project_field('default_flow_type', default_flow_type)
        # if project.default_flow_type != dft_value:
        #     project.default_flow_type = dft_value
        #     project.save(update_fields=['default_flow_type'])
        #     return ['default_flow_type']
        # return []


class DefaultFinanceType(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the default finance type.
        The finance type will be extracted from the 'code' attribute of the 'default-finance-type'
        element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # dft_value = ''

        default_finance_type = self.get_child_elem_attrib(
                self.parent_elem, 'default-finance-type', 'code', 'default_finance_type')
        # dft_element = self.activity.find("default-finance-type")
        # default_finance_type = self.get_attrib(dft_element, 'code', 'default_finance_type')
        # if not dft_element is None and 'code' in dft_element.attrib.keys():
        #     if not len(dft_element.attrib['code']) > 3:
        #         dft_value = dft_element.attrib['code']
        #     else:
        #         add_log(iati_import, 'default_finance_type', 'code too long (3 characters allowed)',
        #                 project)

        return self.update_project_field('default_finance_type', default_finance_type)
        # if project.default_finance_type != dft_value:
        #     project.default_finance_type = dft_value
        #     project.save(update_fields=['default_finance_type'])
        #     return ['default_finance_type']
        # return []


class DefaultAidType(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the default aid type.
        The aid type will be extracted from the 'code' attribute of the 'default-aid-type' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # dat_value = ''
        default_aid_type = self.get_child_elem_attrib(
                self.parent_elem, 'default-aid-type', 'code', 'default_aid_type')
        # dat_element = self.activity.find("default-aid-type")
        # default_aid_type = self.get_attrib(dat_element, 'code', 'default_aid_type')
        # if not dat_element is None and 'code' in dat_element.attrib.keys():
        #     if not len(dat_element.attrib['code']) > 3:
        #         dat_value = dat_element.attrib['code']
        #     else:
        #         add_log(iati_import, 'default_aid_type', 'code too long (3 characters allowed)',
        #                 project)
        return self.update_project_field('default_aid_type', default_aid_type)
        # if project.default_aid_type != dat_value:
        #     project.default_aid_type = dat_value
        #     project.save(update_fields=['default_aid_type'])
        #     return ['default_aid_type']
        # return []


class DefaultTiedStatus(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the default tied status.
        The tied status will be extracted from the 'code' attribute of the 'default-tied-status'
        element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # dts_value = ''

        # default_tied_status = self.get_child_elem_attrib(
        #         self.activity, 'default-tied-status', 'code', 'default_tied_status')
        # dts_element = self.activity.find("default-tied-status")
        # default_tied_status = self.get_attrib(dts_element, 'code', 'default_tied_status')
        default_tied_status = self.get_child_elem_attrib(
                self.parent_elem, 'default-tied-status', 'code', 'default_tied_status')


        # if not dts_element is None and 'code' in dts_element.attrib.keys():
        #     if not len(dts_element.attrib['code']) > 1:
        #         dts_value = dts_element.attrib['code']
        #     else:
        #         add_log(iati_import, 'default_tied_status', 'code too long (1 character allowed)',
        #                 project)
        return self.update_project_field('default_tied_status', default_tied_status)
        # if project.default_tied_status != dts_value:
        #     project.default_tied_status = dts_value
        #     project.save(update_fields=['default_tied_status'])
        #     return ['default_tied_status']
        # return []


class Status(ImportHelper):

    def do_import(self):
        """
        Retrieve and store the status.
        The title will be extracted from the 'code' attribute of the 'activity-status' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data for the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        # project_status = 'N'

        # activity_status = self.activity.find('activity-status')
        # status_code = self.get_attrib(activity_status, 'code', 'default_tied_status')
        status = self.get_child_elem_attrib(
                self.parent_elem, 'activity-status', 'code', 'status')

        if status in CODE_TO_STATUS.keys():
            status = CODE_TO_STATUS[status]
        else:
            self.add_log('activity-status@code', 'status', 'invalid status code')
            status = Project.STATUS_NONE
        # if activity_status is not None and 'code' in activity_status.attrib.keys():
        #     if not len(activity_status.attrib['code']) > 1:
        #         code = activity_status.attrib['code']
        #         if code in CODE_TO_STATUS.keys():
        #             project_status = CODE_TO_STATUS[code]
        #         else:
        #             add_log(iati_import, 'status', 'invalid status code', project)
        #     else:
        #         add_log(iati_import, 'status', 'status is too long (1 character allowed)', project)
        return self.update_project_field('status', status)
        # if project.status != project_status:
        #     project.status = project_status
        #     project.save(update_fields=['status'])
        #     return ['status']
        # return []

class Conditions(ImportHelper):

    def __init__(self, iati_import, parent_element, project, globals, related_obj=None):
        super(Conditions, self).__init__(iati_import, parent_element, project, globals)
        self.model = ProjectCondition

    def do_import(self):

        """
        Retrieve and store the conditions.
        The conditions will be extracted from the 'condition' elements in the 'conditions' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_conditions = []
        changes = []

        conditions_element = self.parent_elem.find("conditions[@attached='1']")
        if conditions_element is not None:
            for condition in conditions_element.findall('condition'):

                condition_type = self.get_attrib(condition, 'type', 'type')
                # if 'type' in condition.attrib.keys():
                #     if not len(condition.attrib['type']) > 1:
                #         condition_type = condition.attrib['type']
                #     else:
                #         add_log(iati_import, 'condition',
                #                 'condition type is too long (1 character allowed)', project)
                text = self.get_element_text(condition, 'text')
                # condition_text = get_text(condition, activities_globals['version'])
                # if len(condition_text) > 100:
                #     add_log(iati_import, 'condition', 'condition is too long (100 character allowed)',
                #             project, IatiImportLog.VALUE_PARTLY_SAVED)
                #     condition_text = condition_text[:100]

                project_condition, created = ProjectCondition.objects.get_or_create(
                    project=self.project,
                    type=condition_type,
                    text=text
                )

                if created:
                    changes.append(u'added condition (id: {}): {}'.format(
                            project_condition.pk, project_condition))

                imported_conditions.append(project_condition)

        changes += self.delete_objects(self.project.conditions, imported_conditions, 'condition')
        # for condition in self.project.conditions.all():
        #     if not condition in imported_conditions:
        #         changes.append(u'deleted condition (id: {}): {}'.format(
        #                 condition.pk, condition.__unicode__()))
        #         condition.delete()
        return changes
