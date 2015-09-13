# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.conf import settings
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from django.db.models import get_model

import urllib2

VALID_IMAGE_EXTENSIONS = [
    'gif',
    'jpg',
    'jpeg',
    'png',
    'tiff'
]


def current_image(activity, project, activities_globals):
    """
    Retrieve and store the current image, as well as the image caption and credit.
    The image will be extracted from the 'url' attribute of the first 'document-link' element
    containing a file with one of the extensions of VALID_IMAGE_EXTENSIONS. If an image is
    successfully retrieved, the image caption will be based on the underlying 'title'
    element and the image credit will be based on the akvo photo-credit attribute of the
    'document-link' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    changes = []

    for document_link_element in activity.findall('document-link'):
        if 'url' in document_link_element.attrib.keys():
            image_url = document_link_element.attrib['url']
            image_filename = image_url.rsplit('/', 1)[1] if '/' in image_url else ''
            image_ext = image_filename.rsplit('.', 1)[1].lower() if '.' in image_filename else ''
            image_name_no_ext = image_filename.rsplit('.', 1)[0] if '.' in image_filename else ''

            if not image_ext in VALID_IMAGE_EXTENSIONS:
                continue

            if not project.current_image or \
                    (project.current_image
                     and not image_name_no_ext in
                        project.current_image.name.rsplit('/', 1)[1].rsplit('.', 1)[0]):
                tmp_file = NamedTemporaryFile(delete=True)
                tmp_file.write(urllib2.urlopen(image_url, timeout=100).read())
                tmp_file.flush()
                project.current_image.save(image_filename, File(tmp_file))
                project.save(update_fields=['current_image'])
                changes.append('current_image')

                # Image caption
                image_caption = ''

                title_element = document_link_element.find('title')
                if title_element is not None:
                    image_caption = get_text(title_element, activities_globals['version'])[:50]

                if project.current_image_caption != image_caption:
                    project.current_image_caption = image_caption
                    project.save(update_fields=['current_image_caption'])
                    changes.append('current_image_caption')

                # Image credit
                image_credit = ''

                if '{%s}photo-credit' % settings.AKVO_NS in document_link_element.attrib.keys():
                    image_credit = document_link_element.attrib[
                        '{%s}photo-credit' % settings.AKVO_NS
                    ][:50]

                if project.current_image_credit != image_credit:
                    project.current_image_credit = image_credit
                    project.save(update_fields=['current_image_credit'])
                    changes.append('current_image_credit')

            break

    return changes


def links(activity, project, activities_globals):
    """
    Retrieve and store the links.
    The conditions will be extracted from the 'activity-website' elements, and the 'document-link'
    elements with format 'application/http'. Links to RSR itself will be skipped.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_links = []
    changes = []

    for website in activity.findall('activity-website'):
        url = get_text(website, activities_globals['version'])

        # Skip RSR links
        if url and 'rsr.akvo.org' in url:
            continue

        link, created = get_model('rsr', 'link').objects.get_or_create(
            project=project,
            url=url
        )

        if created:
            changes.append(u'added link (id: %s): %s' % (str(link.pk), link))

        imported_links.append(link)

    for doc_link in activity.findall("document-link[@format='application/http']"):
        url = ''
        caption = ''

        if 'url' in doc_link.attrib.keys():
            url = doc_link.attrib['url']

            # Skip RSR links
            if url and 'rsr.akvo.org' in url:
                continue

        title_element = doc_link.find('title')
        if not title_element is None:
            caption = get_text(title_element, activities_globals['version'])[:50]

        link, created = get_model('rsr', 'link').objects.get_or_create(
            project=project,
            url=url,
            caption=caption
        )

        if created:
            changes.append(u'added link (id: %s): %s' % (str(link.pk), link))

        imported_links.append(link)

    for link in project.links.all():
        if not link in imported_links:
            changes.append(u'deleted link (id: %s): %s' %
                           (str(link.pk),
                            link.__unicode__()))
            link.delete()

    return changes


def documents(activity, project, activities_globals):
    """
    Retrieve and store the documents.
    The conditions will be extracted from the 'document-link' elements. However, the first image
    file and all document-links with format 'application/http' will be skipped since these are
    already imported as the current image or links of the project.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_docs = []
    changes = []

    xml_ns = 'http://www.w3.org/XML/1998/namespace'
    first_image = True

    for doc_link in activity.findall('document-link'):
        url = ''
        doc_format = ''
        title = ''
        title_language = ''
        category = ''
        language = ''

        if 'url' in doc_link.attrib.keys():
            url = doc_link.attrib['url']

            # Check if it's the first image
            if url and url.rsplit('.', 1)[1].lower() in VALID_IMAGE_EXTENSIONS and first_image:
                first_image = False
                continue

        if 'format' in doc_link.attrib.keys() and len(doc_link.attrib['format']) < 76:
            doc_format = doc_link.attrib['format']

            # Check if the format is 'application/http'
            if doc_format == 'application/http':
                continue

        title_element = doc_link.find('title')
        if not title_element is None:
            title = get_text(title_element, activities_globals['version'])[:100]
            if activities_globals['version'][0] == '1' and \
                    '{%s}lang' % xml_ns in title_element.attrib.keys() and \
                    len(title_element.attrib['{%s}lang' % xml_ns]) < 3:
                title_language = title_element.attrib['{%s}lang' % xml_ns]
            elif activities_globals['version'][0] == '2':
                narrative_element = title_element.find('narrative')
                if not narrative_element is None and \
                        '{%s}lang' % xml_ns in narrative_element.attrib.keys():
                    title_language = narrative_element.attrib['{%s}lang' % xml_ns]

        category_element = doc_link.find('category')
        if not category_element is None and 'code' in category_element.attrib.keys() and \
                len(category_element.attrib['code']) < 4:
            category = category_element.attrib['code']

        language_element = doc_link.find('language')
        if not language_element is None and 'code' in language_element.attrib.keys() and \
                len(language_element.attrib['code']) < 3:
            language = language_element.attrib['code']

        doc, created = get_model('rsr', 'projectdocument').objects.get_or_create(
            project=project,
            url=url,
            format=doc_format,
            title=title,
            title_language=title_language,
            category=category,
            language=language
        )

        if created:
            changes.append(u'added project document (id: %s): %s' % (str(doc.pk), doc))

        imported_docs.append(doc)

    for doc_link in project.documents.all():
        if not doc_link in imported_docs:
            changes.append(u'deleted project document (id: %s): %s' %
                           (str(doc_link.pk),
                            doc_link.__unicode__()))
            doc_link.delete()

    return changes
