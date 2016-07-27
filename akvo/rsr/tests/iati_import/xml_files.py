# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

IATI_V1_STRING = """
<iati-activities generated-datetime="2014-09-10T07:15:37Z" version="1.05">
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z">
        <iati-identifier>NL-KVK-0987654321-v1</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">Test Organisation Import</reporting-org>
        <title>Test project for IATI import v1</title>
    </iati-activity>
</iati-activities>
"""

IATI_V2_STRING = """
<iati-activities generated-datetime="2014-09-10T07:15:37Z" version="2.02">
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z">
        <iati-identifier>NL-KVK-0987654321-v2</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI import v2</narrative>
        </title>
    </iati-activity>
</iati-activities>
"""
