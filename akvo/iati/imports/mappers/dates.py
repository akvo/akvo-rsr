# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .. import ImportMapper


class Dates(ImportMapper):

    def do_import(self):
        if self.globals['version'][0] == '1':
            date_element = self.parent_elem.find(
                    "activity-date[@type='{}']".format(self.ver_1_date_type))
        else:
            date_element = self.parent_elem.find(
                    "activity-date[@type='{}']".format(self.ver_2_date_type))
        date = self.get_date(date_element, 'iso-date', self.date_field) if date_element else None
        return self.update_project_field(self.date_field, date)


class PlannedStartDate(Dates):
    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(PlannedStartDate, self).__init__(
                iati_import_job, parent_elem, project, globals)
        self.ver_1_date_type = 'start-planned'
        self.ver_2_date_type = '1'
        self.date_field = 'date_start_planned'


class ActualStartDate(Dates):
    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(ActualStartDate, self).__init__(
                iati_import_job, parent_elem, project, globals)
        self.ver_1_date_type = 'start-actual'
        self.ver_2_date_type = '2'
        self.date_field = 'date_start_actual'


class PlannedEndDate(Dates):
    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(PlannedEndDate, self).__init__(
                iati_import_job, parent_elem,  project, globals)
        self.ver_1_date_type = 'end-planned'
        self.ver_2_date_type = '3'
        self.date_field = 'date_end_planned'


class ActualEndDate(Dates):
    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(ActualEndDate, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.ver_1_date_type = 'end-actual'
        self.ver_2_date_type = '4'
        self.date_field = 'date_end_actual'
