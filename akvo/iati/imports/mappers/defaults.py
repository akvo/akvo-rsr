# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.project_condition import ProjectCondition

from .. import ImportMapper, xml_ns


class Language(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the language.
        The language will be extracted from the 'lang' attribute of the activity root element.

        :return: List; contains fields that have changed
        """
        language = self.get_attrib(self.parent_elem, xml_ns('lang'), 'language')

        return self.update_project_field('language', language)


class Currency(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the currency.
        The currency will be extracted from the 'default-currency' attribute of the activity root
        element.

        :return: List; contains fields that have changed
        """

        currency = self.get_attrib(self.parent_elem, 'default-currency', 'currency', 'EUR')

        return self.update_project_field('currency', currency)


class Hierarchy(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the hierarchy.
        The hierarchy will be extracted from the 'hierarchy' attribute of the activity root element.

        :return: List; contains fields that have changed
        """

        hierarchy = self.get_attrib(self.parent_elem, 'hierarchy', 'hierarchy', None)
        if hierarchy:
            try:
                hierarchy = int(hierarchy)
            except ValueError as e:
                self.add_log('iati-activity@hierarchy', 'hierarchy', str(e))

        return self.update_project_field('hierarchy', hierarchy)


class Scope(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the activity scope.
        The scope will be extracted from the 'code' attribute of the 'activity-scope' element.

        :return: List; contains fields that have changed
        """

        project_scope = self.get_child_elem_attrib(
            self.parent_elem, 'activity-scope', 'code', 'project_scope')

        return self.update_project_field('project_scope', project_scope)


class CollaborationType(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the collaboration type.
        The collaboration type will be extracted from the 'code' attribute of the
        'collaboration-type' element.

        :return: List; contains fields that have changed
        """

        collaboration_type = self.get_child_elem_attrib(
            self.parent_elem, 'collaboration-type', 'code', 'collaboration_type')

        return self.update_project_field('collaboration_type', collaboration_type)


class DefaultFlowType(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the default flow type.
        The flow type will be extracted from the 'code' attribute of the 'default-flow-type' element.

        :return: List; contains fields that have changed
        """

        default_flow_type = self.get_child_elem_attrib(
            self.parent_elem, 'default-flow-type', 'code', 'default_flow_type')

        return self.update_project_field('default_flow_type', default_flow_type)


class DefaultFinanceType(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the default finance type.
        The finance type will be extracted from the 'code' attribute of the 'default-finance-type'
        element.

        :return: List; contains fields that have changed
        """

        default_finance_type = self.get_child_elem_attrib(
            self.parent_elem, 'default-finance-type', 'code', 'default_finance_type')

        return self.update_project_field('default_finance_type', default_finance_type)


class DefaultAidType(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the default aid type.
        The aid type will be extracted from the 'code' attribute of the 'default-aid-type' element.

        :return: List; contains fields that have changed
        """

        default_aid_type = self.get_child_elem_attrib(
            self.parent_elem, 'default-aid-type', 'code', 'default_aid_type')

        return self.update_project_field('default_aid_type', default_aid_type)


class DefaultTiedStatus(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the default tied status.
        The tied status will be extracted from the 'code' attribute of the 'default-tied-status'
        element.

        :return: List; contains fields that have changed
        """

        default_tied_status = self.get_child_elem_attrib(
            self.parent_elem, 'default-tied-status', 'code', 'default_tied_status')

        return self.update_project_field('default_tied_status', default_tied_status)


class Status(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the status.
        The title will be extracted from the 'code' attribute of the 'activity-status' element.

        :return: List; contains fields that have changed
        """

        iati_status = self.get_child_elem_attrib(
            self.parent_elem, 'activity-status', 'code', 'status')

        if not iati_status:
            self.add_log('activity-status@code', 'iati_status', 'invalid status code')
            iati_status = ''

        return self.update_project_field('iati_status', iati_status)


class Conditions(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Conditions, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = ProjectCondition

    def do_import(self):
        """
        Retrieve and store the conditions.
        The conditions will be extracted from the 'condition' elements in the 'conditions' element.

        :return: List; contains fields that have changed
        """
        imported_conditions = []
        changes = []

        conditions_element = self.parent_elem.find("conditions[@attached='1']")
        if conditions_element is not None:
            for condition in conditions_element.findall('condition'):

                condition_type = self.get_attrib(condition, 'type', 'type')
                text = self.get_element_text(condition, 'text')

                project_condition, created = ProjectCondition.objects.get_or_create(
                    project=self.project,
                    type=condition_type,
                    text=text
                )
                if created:
                    changes.append('added condition (id: {}): {}'.format(
                        project_condition.pk, project_condition))
                imported_conditions.append(project_condition)

        changes += self.delete_objects(self.project.conditions, imported_conditions, 'condition')
        return changes


class Humanitarian(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the humanitarian field.
        The humanitarian field will be extracted from the 'humanitarian' attribute of the activity
        root element.

        :return: List; contains fields that have changed
        """

        humanitarian = self.get_attrib(self.parent_elem, 'humanitarian', 'humanitarian', None)
        if humanitarian:
            humanitarian = self.to_boolean(humanitarian)
        return self.update_project_field('humanitarian', humanitarian)
