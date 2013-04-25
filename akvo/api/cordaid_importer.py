# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import requests

from lxml import etree

localhost = dict(
    domain='localhost:8000',
    api_ver='v1',
    api_key='ae9b09ba6f6c34079aad95701f188148fa149d87',
    username='gabriel',
)

test2 = dict(
    domain='test2.akvo.org',
    api_ver='v1',
    api_key='e5dbdaf6122fd3ee4193e1121850cbec4290160c',
    username='gabriel',
)

def post_an_activity(activity_element, host):
    response = requests.post(
        "http://{domain}/api/{api_ver}/iati_activity/"
        "?format=xml&api_key={api_key}&username={username}".format(**host),
        headers={'content-type': 'application/xml', 'encoding':'utf-8'},
        data=etree.tostring(activity_element),
    )
    if response.text:
        print "**** Error creating iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    else:
        print "Created project for iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)

# root[i].findall('iati-identifier')[0].text

def post_some_activities():
    with open('./xml/cordaid_iati_activities.xml', 'r') as f:
        root = etree.fromstring(f.read())
        for i in range(len(root)):
            post_an_activity(root[i], localhost)

if __name__ == '__main__':
    post_some_activities()
