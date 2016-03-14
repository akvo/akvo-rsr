# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def fss(project):
    """
    Generate the fss element.

    :param project: Project object
    :return: A list of Etree elements
    """
    fss_object = getattr(project, 'fss', None)

    if fss_object:
        element = etree.Element("fss")

        if fss_object.extraction_date:
            element.attrib['extraction-date'] = str(fss_object.extraction_date)

        if fss_object.priority is not None:
            element.attrib['priority'] = '1' if fss_object.priority else '0'

        if fss_object.phaseout_year:
            element.attrib['phaseout-year'] = str(fss_object.phaseout_year)

        for forecast in fss_object.forecasts.all():
            if forecast.value or forecast.year or forecast.value_date or forecast.currency:
                forecast_element = etree.SubElement(element, "forecast")

                if forecast.value == 0 or forecast.value:
                    forecast_element.text = str(forecast.value)

                if forecast.year:
                    forecast_element.attrib['year'] = str(forecast.year)

                if forecast.value_date:
                    forecast_element.attrib['value-date'] = str(forecast.value_date)

                if forecast.currency:
                    forecast_element.attrib['currency'] = str(forecast.currency)

                element.append(forecast_element)

        return [element]

    else:
        return []
