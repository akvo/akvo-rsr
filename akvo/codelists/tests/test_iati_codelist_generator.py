# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json
import os
import unittest

import akvo.codelists.scripts.iati_codelist_generator as g
from akvo.codelists.store import default_codelists


class CodelistGeneratorTestCase(unittest.TestCase):
    def test_prevent_changing_generated_files_by_hand(self):
        for codelist_name, config in g.JSON_CODELISTS.items():
            pythonic_name = g.pythonify_codelist_name(codelist_name)
            codelist_data = getattr(default_codelists, pythonic_name)
            keys = codelist_data[0]
            codelist_rows = [dict(zip(keys, values)) for values in codelist_data[1:]]
            codelist = {"name": codelist_name, "rows": codelist_rows}
            data = g.write_codelist_json(codelist, dry_run=True)
            with open(os.path.join(g.JSON_CODELISTS_PATH_PREFIX, config["path"])) as f:
                file_data = json.load(f)

            message = (
                f"\n\nLooks like '{f.name}' was modified by hand. "
                "This is a generated file and should not be changed by hand.\n\n"
                f"To update this file run {g.__file__}"
            )
            self.assertEqual(data, file_data, message)
