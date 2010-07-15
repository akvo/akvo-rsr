# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import time, urllib2

from lxml import etree


def create_xml_element_root_from(url):
    return etree.XML(read_text_from(url))

def create_html_element_root_from(url):
    return etree.HTML(read_text_from(url))

def read_text_from(url):
    return urllib2.urlopen(urllib2.Request(url, None, {"Cache-Control": "no-cache, no-store, max-age=0", "Pragma": "no-cache"})).read()

def elements_tostring(element_root):
    return etree.tostring(element_root, pretty_print=True)

def text_for_elements_at_xpath(element_search_root, elements_xpath):
    untrimmed_text_elements = element_search_root.xpath("%s/text()" % (elements_xpath))
    return map(lambda text: text.strip(), untrimmed_text_elements)

def values_at_xpath(element_search_root, values_xpath):
    return element_search_root.xpath(values_xpath)
