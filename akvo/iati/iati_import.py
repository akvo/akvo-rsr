# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..rsr.models.iati_import_log import IatiImportLog


class IatiImportProcess(object):
    def check_file_or_url(self):
        """
        Check if the IATI import has a local_file or url specified.

        If not, log in IatiImportLog and raise an error.
        """
        if not (self.iati_import.url or self.file):
            IatiImportLog.objects.create(
                iati_import=self.iati_import,
                text=u'No file or URL specified',
                error=True
            )


    def __init__(self, iati_import):
        """
        Initialise the IATI Import process.

        :param iati_import: A IatiImport Django ORM object
        """
        self.iati_import = iati_import
        self.file = iati_import.local_file
        self.organisation = iati_import.reporting_organisation
        self.user = iati_import.user

        self.check_file_or_url()




        # If local file doesn't exists, download the file locally first
        if self.iati_import.url and not self.file:
            try:
                # Download file
                iati_import.status = 2
                iati_import.save()

            except:
                iati_import.status = 5
                iati_import.save()

        # Start the import only if a local file exists and the import has a reporting organisation
        # and user specified
        if iati_import.local_file and iati_import.reporting_organisation and iati_import.user:
            try:
                iati_import.status = 3
                iati_import.save()

                iati_import.status = 4
                iati_import.save()
                else:
                    iati_import.status = 5
                    iati_import.save()
            except:
                iati_import.status = 5
                iati_import.save()


