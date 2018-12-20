# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.

    Settings system from Transifex http://trac.transifex.org/
    https://bitbucket.org/indifex/transifex-commonpool/src/c35748027c16/
    commonpool/settings.py
    Explained on http://code.djangoproject.com/wiki/SplitSettings

    Settings files are named XX-description.conf. XX relates to in which
    order the conf file is executed. The 50- & 60- series are excluded from
    git version control.

    * Production conf example:
    10-base.conf - Base settings.
    20-default.conf - The production settings.
    30-rsr.con - RSR specific settings
    50-local.conf - Local settings credentials & paths (not in git)
    90-finish.conf - Handle the DWS or Akvo RSR template settings.

    * Dev conf files example:
    10-base.conf - Base settings.
    20-default.conf - The production settings.
    30-rsr.con - RSR specific settings
    50-local.conf - Local development, not under version control.
    90-finish.conf - Handle the DWS or Akvo RSR template settings.

"""
import os.path
import glob


conffiles = glob.glob(os.path.join(os.path.dirname(__file__), '*.conf'))
conffiles.sort()
for f in conffiles:
    path = os.path.abspath(f)
    if os.path.exists(path):
        execfile(path)

overwrite_conffiles = glob.glob("/config_overrides/*.conf")
overwrite_conffiles.sort()
for f in overwrite_conffiles:
    execfile(os.path.abspath(f))
