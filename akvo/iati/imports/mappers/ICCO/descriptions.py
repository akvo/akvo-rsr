# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..descriptions import Descriptions

description_start = dict(
    project_name='project name:',
    subtitle='subtitle:',
    project_plan_summary='project summary:',
    background='background:',
    current_status='baseline situation:',
    project_plan='project plan:',
    sustainability='sustainability:',
)


def _text_starts_with(text, start):
    return text.lower().startswith(start)


class Descriptions(Descriptions):
    """
    Custom import rules for importing description fields from ICCO IATI XML. Here we look for
    description fields prefixed with the description_start strings and match them to the respective
    fields.
    Note that this is not "mixable" with the default method of matching description fields by order
    so if a description field is not prefixed it will not be included.
    """

    def _get_description(self, start_string):
        for element in self.parent_elem.findall("description"):
            text = self.get_text(element)
            if _text_starts_with(text, start_string):
                return element, text[len(start_string):].strip()
        return None, ''

    def get_subtitle(self):
        element, text = self._get_description(description_start['subtitle'])
        if element is None:
            element, text = self._get_description(description_start['project_name'])
        if text:
            return element, text
        else:
            return super(Descriptions, self).get_subtitle()

    def get_project_plan_summary(self):
        return self._get_description(description_start['project_plan_summary'])

    def get_background(self):
        """
        In case the project plan summary exceeds the character limit, the full text will be stored
        in the background field as well so that the full text shows somewhere on the project page.
        """
        element, text = self._get_description(description_start['project_plan_summary'])
        if element is not None:
            short_text = self.check_text_length(element, text, 'project_plan_summary', False)
            if text != short_text:
                return element, text
        return self._get_description(description_start['background'])

    def get_current_status(self):
        return self._get_description(description_start['current_status'])

    def get_project_plan(self):
        return self._get_description(description_start['project_plan'])

    def get_sustainability(self):
        return self._get_description(description_start['sustainability'])
