# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def document_link(project):
    """
    Generate the document-link elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    document_link_elements = []

    if project.current_image:
        current_image_element = etree.Element("document-link")
        current_image_element.attrib['url'] = "http://rsr.akvo.org" + project.current_image.url
        current_image_element.attrib['format'] = "image/jpeg"

        title_element = etree.SubElement(current_image_element, "title")
        narrative_element = etree.SubElement(title_element, "narrative")

        if project.current_image_caption or project.current_image_credit:
            if project.current_image_caption and project.current_image_credit:
                narrative_element.text = "%s, credit: %s" % (
                    project.current_image_caption,
                    project.current_image_credit
                )
            elif project.current_image_caption:
                narrative_element.text = project.current_image_caption
            elif project.current_image_credit:
                narrative_element.text = "Credit: %s" % (project.current_image_credit,)
        else:
            narrative_element.text = "Project photo"

        category_element = etree.SubElement(current_image_element, "category")
        category_element.attrib['code'] = "A12"

        document_link_elements.append(current_image_element)

    for link in project.links.all():
        if link.url:
            link_element = etree.Element("document-link")
            link_element.attrib['url'] = link.url
            link_element.attrib['format'] = "application/http"

            title_element = etree.SubElement(link_element, "title")
            narrative_element = etree.SubElement(title_element, "narrative")
            narrative_element.text = link.caption if link.caption else "Project link"

            category_element = etree.SubElement(link_element, "category")
            category_element.attrib['code'] = "A12"

            document_link_elements.append(link_element)

    for document in project.documents.all():

        if has_data(document, ['url', 'document', 'format', 'title', 'language', 'document_date'])\
           or document.categories.exists():

            document_element = etree.Element("document-link")

            if document.url:
                document_element.attrib['url'] = document.url
            elif document.document:
                document_element.attrib['url'] = "http://rsr.akvo.org" + document.document.url

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

            document_link_elements.append(document_element)

    for update in project.project_updates.all():
        update_element = etree.Element("document-link")
        update_element.attrib['url'] = "http://rsr.akvo.org/project/%s/update/%s/" % \
                                       (str(project.pk), str(update.pk))
        update_element.attrib['format'] = "application/http"

        title_element = etree.SubElement(update_element, "title")
        narrative_element = etree.SubElement(title_element, "narrative")
        narrative_element.text = update.title if update.title else "Project update"

        category_element = etree.SubElement(update_element, "category")
        category_element.attrib['code'] = "A12"

        if update.language:
            language_element = etree.SubElement(update_element, "language")
            language_element.attrib['code'] = update.language

        document_link_elements.append(update_element)

    return document_link_elements
