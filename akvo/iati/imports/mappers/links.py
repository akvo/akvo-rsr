# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import requests

from os.path import basename, splitext
try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from ....rsr.models.link import Link
from ....rsr.models.project_document import ProjectDocument, ProjectDocumentCategory
from .. import ImportMapper, akvo_ns, xml_ns

VALID_IMAGE_EXTENSIONS = ['.gif', '.jpg', '.jpeg', '.png', '.tiff']


def file_info_from_url(url):
    parsed_url = urlparse(url)
    filename = basename(parsed_url.path)
    extension = splitext(parsed_url.path)[1].lower()
    return filename, extension


class CurrentImage(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(CurrentImage, self).__init__(iati_import_job, parent_elem,
                                           project, globals, related_obj)

    def do_import(self):
        """
        Retrieve and store the current image, as well as the image caption and credit.
        The image will be extracted from the 'url' attribute of the first 'document-link' element
        containing a file with one of the extensions of VALID_IMAGE_EXTENSIONS. If an image is
        successfully retrieved, the image caption will be based on the underlying 'title'
        element and the image credit will be based on the akvo photo-credit attribute of the
        'document-link' element.

        :return: List; contains fields that have changed
        """

        changes = []
        image_meta_changes = []

        for document_link_element in self.parent_elem.findall('document-link'):
            url = self.get_attrib(document_link_element, 'url', 'current_image')
            if url:
                filename, extension = file_info_from_url(url)
                if extension not in VALID_IMAGE_EXTENSIONS:
                    continue
                # get content length of uncompressed cargo
                header_query = requests.head(url, headers={'Accept-Encoding': 'identity'})
                content_length = int(header_query.headers.get('content-length', '0'))
                # If we have no image or the size of the image URL differs from the stored one,
                # we go get. This _may_ in unlucky cases lead to a new image not being fetched.
                # TODO: add a timestamp to the image for better comparison criteria
                if not self.project.current_image or (
                        self.project.current_image.size != content_length):
                    request = requests.get(url, stream=True)
                    if request.status_code == 200:
                        tmp_file = NamedTemporaryFile()
                        for chunk in request.iter_content(1024):
                            if not chunk:
                                break
                            tmp_file.write(chunk)
                        tmp_file.flush()
                        self.project.current_image.save(filename, File(tmp_file))
                        changes.append('current_image')
                    else:
                        self.add_log('document-link', 'current_image',
                                     'Error trying to fetch image: {}'.format(url))

                current_image_caption = self.get_child_element_text(
                    document_link_element, 'title', 'current_image_caption')
                if current_image_caption:
                    self.project.current_image_caption = current_image_caption
                    image_meta_changes.append('current_image_caption')
                current_image_credit = self.get_attrib(
                    document_link_element, akvo_ns('photo-credit'),
                    'current_image_credit')
                if current_image_credit:
                    self.project.current_image_credit = current_image_credit
                    image_meta_changes.append('current_image_credit')
                if image_meta_changes:
                    self.project.save(update_fields=image_meta_changes)

        return changes + image_meta_changes


class Links(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Links, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = Link

    def do_import(self):
        """
        Retrieve and store the links.
        The conditions will be extracted from the 'activity-website' elements, and the
        'document-link' elements with format 'application/http'. Links to RSR itself will be skipped.

        :return: List; contains fields that have changed
        """
        imported_links = []
        changes = []

        for website in self.parent_elem.findall('activity-website'):
            url = self.get_text(website)

            # Skip RSR links
            if url and 'rsr.akvo.org' in url:
                continue

            link, created = Link.objects.get_or_create(
                project=self.project,
                url=url
            )
            if created:
                changes.append('added link (id: %s): %s' % (str(link.pk), link))
            imported_links.append(link)

        for doc_link in self.parent_elem.findall("document-link[@format='application/http']"):
            url = self.get_attrib(doc_link, 'url', 'url')

            # Skip RSR links
            if url and 'rsr.akvo.org' in url:
                continue

            caption = self.get_child_element_text(doc_link, 'title', 'caption')

            link, created = Link.objects.get_or_create(
                project=self.project, url=url, caption=caption)
            if created:
                changes.append('added link (id: {}): {}'.format(link.pk, link))
            imported_links.append(link)

        changes += self.delete_objects(self.project.links, imported_links, 'link')
        return changes


class Documents(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Documents, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = ProjectDocument

    def do_import(self):
        """
        Retrieve and store the documents.
        The conditions will be extracted from the 'document-link' elements. However, the first image
        file and all document-links with format 'application/http' will be skipped since these are
        already imported as the current image or links of the project.

        :return: List; contains fields that have changed
        """
        imported_docs = []
        changes = []

        first_image = True

        for doc_link in self.parent_elem.findall('document-link'):

            url = self.get_attrib(doc_link, 'url', 'url')
            if url:
                filename, extension = file_info_from_url(url)
                if extension in VALID_IMAGE_EXTENSIONS and first_image:
                    first_image = False
                    continue

            format = self.get_attrib(doc_link, 'format', 'format')
            if format == 'application/http':
                continue

            title, title_element = self.get_child_element_text(
                doc_link, 'title', 'title', return_element=True)

            title_language = ''
            if title:
                if self.globals['version'][0] == '1':
                    title_language = self.get_child_elem_attrib(
                        doc_link, 'title', xml_ns('lang'), 'title_language')
                elif self.globals['version'][0] == '2':
                    title_language = self.get_child_elem_attrib(
                        title_element, 'narrative', xml_ns('lang'), 'title_language')

            language = self.get_child_elem_attrib(doc_link, 'language', 'code', 'language')

            document_date_element = doc_link.find("document-date")
            if document_date_element is not None:
                document_date = self.get_date(document_date_element, 'iso-date', 'document_date')
            else:
                document_date = None

            doc, created = ProjectDocument.objects.get_or_create(
                project=self.project,
                url=url,
                format=format,
                title=title,
                title_language=title_language,
                language=language,
                document_date=document_date
            )
            if created:
                changes.append('added project document (id: {}): {}'.format(doc.pk, doc))
            imported_docs.append(doc)

            # Process document categories
            document_categories = DocumentCategories(self.iati_import_job, doc_link, self.project,
                                                     self.globals, related_obj=doc)
            for category_change in document_categories.do_import():
                changes.append(category_change)

        changes += self.delete_objects(self.project.documents, imported_docs, 'project document')
        return changes


class DocumentCategories(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj):
        super(DocumentCategories, self).__init__(iati_import_job, parent_elem, project, globals,
                                                 related_obj)
        self.model = ProjectDocumentCategory

    def do_import(self):
        """
        Retrieve and store the project document categories.
        The document categories will be extracted from the 'category' elements within a
        'document-link' element.
        :return: List; contains fields that have changed
        """
        imported_categories = []
        changes = []

        for category_elem in self.parent_elem.findall('category'):
            category = self.get_attrib(category_elem, 'code', 'category')

            category_obj, created = ProjectDocumentCategory.objects.get_or_create(
                document=self.related_obj,
                category=category
            )
            if created:
                changes.append('added document category (id: {}): {}'.format(
                    category_obj.pk, category_obj))
            imported_categories.append(category_obj)

        changes += self.delete_objects(self.related_obj.categories, imported_categories,
                                       'document category')
        return changes
