# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def document_link(organisation, request):
    """
    Generate the document-link elements.

    :param organisation: Organisation object
    :param request: Django request object
    :return: A list of Etree elements
    """
    document_link_elements = []

    if organisation.logo:
        logo_element = etree.Element("document-link")
        logo_element.attrib['url'] = '{}://{}{}'.format(
            request.scheme, request.get_host(), organisation.logo.url
        )
        logo_element.attrib['format'] = "image/jpeg"

        title_element = etree.SubElement(logo_element, "title")
        narrative_element = etree.SubElement(title_element, "narrative")
        narrative_element.text = "Organisation logo"

        category_element = etree.SubElement(logo_element, "category")
        category_element.attrib['code'] = "A12"

        document_link_elements.append(logo_element)

    for document in organisation.documents.all():
        if document.url or document.document or document.format or document.title or \
                document.categories.all() or document.language or document.document_date:
            document_element = etree.Element("document-link")

            if document.url:
                document_element.attrib['url'] = document.url
            elif document.document:
                document_element.attrib['url'] = '{}://{}{}'.format(
                    request.scheme, request.get_host(), document.document.url
                )

            if document.format:
                document_element.attrib['format'] = document.format

            if document.title:
                title_element = etree.SubElement(document_element, "title")
                narrative_element = etree.SubElement(title_element, "narrative")
                narrative_element.text = document.title

                if document.title_language:
                    narrative_element.attrib['{http://www.w3.org/XML/1998/namespace}lang'] = \
                        document.title_language

            for category in document.categories.all():
                category_element = etree.SubElement(document_element, "category")
                category_element.attrib['code'] = category.category

            if document.language:
                language_element = etree.SubElement(document_element, "language")
                language_element.attrib['code'] = document.language

            if document.document_date:
                date_element = etree.SubElement(document_element, "document-date")
                date_element.attrib['iso-date'] = str(document.document_date)

            for country in document.countries.all():
                if country.country or country.text:
                    country_element = etree.SubElement(document_element, "recipient-country")

                    if country.country:
                        country_element.attrib['code'] = country.country

                    if country.text:
                        narrative_element = etree.SubElement(country_element, "narrative")
                        narrative_element.text = country.text

            document_link_elements.append(document_element)

    return document_link_elements
