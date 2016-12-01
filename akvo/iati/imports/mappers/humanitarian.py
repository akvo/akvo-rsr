# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.humanitarian_scope import HumanitarianScope

from .. import ImportMapper


class HumanitarianScopes(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(HumanitarianScopes, self).__init__(iati_import_job, parent_elem, project, globals)
        self.model = HumanitarianScope

    def do_import(self):
        """
        Retrieve and store the humanitarian scopes.
        The humanitarian scopes will be extracted from the 'humanitarian-scope' elements.

        :return: List; contains fields that have changed
        """
        imported_scopes = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('humanitarian-scope'):
            return changes

        for scope in self.parent_elem.findall('humanitarian-scope'):

            text = self.get_element_text(scope, 'text')
            code = self.get_attrib(scope, 'code', 'code')
            type = self.get_attrib(scope, 'type', 'type')
            vocabulary = self.get_attrib(scope, 'vocabulary', 'vocabulary')
            vocabulary_uri = self.get_attrib(scope, 'vocabulary-uri', 'vocabulary_uri')

            humanitarian_scope_obj, created = HumanitarianScope.objects.get_or_create(
                project=self.project,
                text=text,
                code=code,
                type=type,
                vocabulary=vocabulary,
                vocabulary_uri=vocabulary_uri
            )
            if created:
                changes.append(u'added humanitarian scope (id: {}): '
                               u'{}'.format(humanitarian_scope_obj.pk, humanitarian_scope_obj))
            imported_scopes.append(humanitarian_scope_obj)

        changes += self.delete_objects(self.project.humanitarian_scopes, imported_scopes,
                                       'humanitarian scope')
        return changes
