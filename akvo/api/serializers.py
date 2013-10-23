# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from lxml import etree
import os

from tastypie.serializers import Serializer

class IATISerializer(Serializer):

    def from_etree(self, data):
        """ transform the iati-activity XML into "tastypie compliant" XML using the 'iati-xslt.xsl' stylesheet
        """
        if data.tag == 'iati-activity':
            with open(os.path.join(os.path.dirname(__file__),'xml', 'iati-xslt.xsl'), 'r') as f:
                iati_xslt = f.read()
            etree_xml = etree.XML(iati_xslt)
            etree_xslt = etree.XSLT(etree_xml)
            tasty_xml = etree_xslt(data)
            return self.from_etree(tasty_xml.getroot())
        else:
            return super(IATISerializer, self).from_etree(data)