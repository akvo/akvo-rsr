# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Sector
from akvo.codelists.store import default_codelists as codelists

SDG_GOALS_VOCABULARY = codelists.SECTOR_VOCABULARY[7][0]
SDG_TARGETS_VOCABULARY = codelists.SECTOR_VOCABULARY[8][0]


class SectorTestCase(BaseTestCase):

    def setUp(self):
        self.project = self.create_project('Test project')

    def test_sdg_goals(self):
        code, name = codelists.U_N_S_D_G__GOALS[1]
        sector = Sector.objects.create(project=self.project, vocabulary=SDG_GOALS_VOCABULARY, sector_code=code)
        self.assertEqual(name, sector.iati_sector().name)

    def test_sdg_targets(self):
        code, name = codelists.U_N_S_D_G__TARGETS[1]
        sector = Sector.objects.create(project=self.project, vocabulary=SDG_TARGETS_VOCABULARY, sector_code=code)
        self.assertEqual(name, sector.iati_sector().name)
