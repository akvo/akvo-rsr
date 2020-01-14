# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from html.parser import HTMLParser
from os import walk
from os.path import join

from django.conf import settings
from django.test import TestCase


class ScriptJSONFinder(HTMLParser):
    """Parses HTML to find application/json script tags."""

    def reset(self):
        HTMLParser.reset(self)
        self.script_json_data = []
        self._found_script_json = False

    def handle_starttag(self, tag, attrs):
        self._found_script_json = (
            True if tag == 'script' and dict(attrs).get('type') == 'application/json' else False
        )

    def handle_data(self, data):
        if not self._found_script_json:
            return
        self.script_json_data.append(data)


class TemplatesTestCase(TestCase):
    """Testing that templates are written correctly."""

    def setUp(self):
        self.script_json_finder = ScriptJSONFinder()

    def test_all_application_json_trans_escapes_js(self):
        """All translated strings in json script tags use escapejs filter."""
        for template in self.iter_templates():
            for script_json in self.find_script_json(template):
                for line in script_json.splitlines():
                    self.assertNotIn('blocktrans',
                                     line,
                                     "Please don't use blocktrans tags in application/json scripts")
                    if ' trans ' not in line:
                        continue
                    # Ensuring that the whole tag is written in a single line
                    self.assertIn('{%', line)
                    self.assertIn('%}', line)
                    # Ensure all translated strings are filtered with escapejs
                    self.assertIn('escapejs', line,
                                  'Missing escapjs filter\n'
                                  'Template path: {}\nLine: {}'.format(template, line))

    def iter_templates(self):
        for template_dir in settings.TEMPLATES[0]['DIRS']:
            for path, dirs, files in walk(template_dir):
                for template_name in files:
                    template_path = join(path, template_name)
                    yield template_path

    def find_script_json(self, template_path):
        self.script_json_finder.reset()
        with open(template_path) as f:
            content = f.read()
        self.script_json_finder.feed(content)
        return self.script_json_finder.script_json_data
