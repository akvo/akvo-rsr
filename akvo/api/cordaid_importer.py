# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import requests

from lxml import etree

domain = 'localhost:8000'
api_ver = 'v1'


def post_an_activity(activity_xml):
    response = requests.post(
        "http://{domain}/api/{api_ver}/iati_activity/"
        "?format=xml&api_key=c719f880b815a1d4fcc267b6529e6643d33b54b2&username=gabriel".format(
            domain=domain, api_ver=api_ver
        ),
        headers={'content-type': 'application/xml', 'encoding':'utf-8'},
        data=activity_xml,
    )

def post_some_activities():
    with open('./xml/cordaid_iati_activities.xml', 'r') as f:
        root = etree.fromstring(f.read())
        for i in range(len(root)):
            post_an_activity(etree.tostring(root[i]))

if __name__ == '__main__':
    post_some_activities()
