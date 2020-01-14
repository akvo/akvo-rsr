# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.crs_add import CrsAdd, CrsAddOtherFlag
from ....rsr.models.fss import Fss, FssForecast
from ....rsr.models.legacy_data import LegacyData

from .. import ImportMapper

from django.core.exceptions import ObjectDoesNotExist


class LegacyDatas(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(LegacyDatas, self).__init__(
            iati_import_job, parent_elem, project, globals, related_obj)
        self.model = LegacyData

    def do_import(self):
        """
        Retrieve and store the legacy data.
        The conditions will be extracted from the 'legacy-data' elements.
        :return: List; contains fields that have changed
        """
        imported_lds = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('legacy-data'):
            return changes

        for legacy in self.parent_elem.findall('legacy-data'):

            name = self.get_attrib(legacy, 'name', 'name')
            value = self.get_attrib(legacy, 'value', 'value')
            iati_equivalent = self.get_attrib(legacy, 'iati-equivalent', 'iati_equivalent')

            legacy_obj, created = LegacyData.objects.get_or_create(
                project=self.project,
                name=name,
                value=value,
                iati_equivalent=iati_equivalent
            )
            if created:
                changes.append('added legacy data (id: {}): {}'.format(
                    legacy_obj.pk, legacy_obj))
            imported_lds.append(legacy_obj)

        changes += self.delete_objects(self.project.legacy_data, imported_lds, 'legacy data')
        return changes


class CrsAdds(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(CrsAdds, self).__init__(iati_import_job, parent_elem,
                                      project, globals, related_obj)
        self.model = CrsAdd

    def do_import(self):
        """
        Retrieve and store the CRS++ data.
        The CRS++ data will be extracted from the 'crs-add' element.

        :return: List; contains fields that have changed
        """
        changes = []

        crs_element = self.parent_elem.find('crs-add')
        if crs_element is not None:
            loan_terms_element = crs_element.find('loan-terms')
            if loan_terms_element is not None:

                loan_terms_rate1 = self.get_attrib(
                    loan_terms_element, 'rate-1', 'loan_terms_rate1', None)
                loan_terms_rate2 = self.get_attrib(
                    loan_terms_element, 'rate-2', 'loan_terms_rate2', None)
                repayment_type = self.get_child_elem_attrib(
                    loan_terms_element, 'repayment-type', 'code', 'repayment_type')
                repayment_plan = self.get_child_elem_attrib(
                    loan_terms_element, 'repayment-plan', 'code', 'repayment_plan')
                commitment_date = self.get_child_as_date(
                    loan_terms_element, 'commitment-date', 'iso-date', 'commitment_date')
                repayment_first_date = self.get_child_as_date(
                    loan_terms_element, 'repayment-first-date', 'iso-date',
                    'repayment_first_date')
                repayment_final_date = self.get_child_as_date(
                    loan_terms_element, 'repayment-final-date', 'iso-date',
                    'repayment_final_date')

            else:
                loan_terms_rate1 = None
                loan_terms_rate2 = None
                repayment_type = ''
                repayment_plan = ''
                commitment_date = None
                repayment_first_date = None
                repayment_final_date = None

            loan_status_element = crs_element.find('loan-status')
            if loan_status_element is not None:

                loan_status_year = self.get_attrib_as_int(
                    loan_status_element, 'year', 'loan_status_year', None)
                loan_status_currency = self.get_attrib(
                    loan_status_element, 'currency', 'loan_status_currency')
                loan_status_value_date = self.get_date(
                    loan_status_element, 'value-date', 'loan_status_value_date')
                interest_received = self.get_child_element_text_as_decimal(
                    loan_status_element, 'interest-received', 'interest_received', None)
                principal_outstanding = self.get_child_element_text_as_decimal(
                    loan_status_element, 'principal-outstanding', 'principal_outstanding', None)
                principal_arrears = self.get_child_element_text_as_decimal(
                    loan_status_element, 'principal-arrears', 'principal_arrears', None)
                interest_arrears = self.get_child_element_text_as_decimal(
                    loan_status_element, 'interest-arrears', 'interest_arrears', None)

            else:
                loan_status_year = None
                loan_status_currency = ''
                loan_status_value_date = None
                interest_received = None
                principal_outstanding = None
                principal_arrears = None
                interest_arrears = None

            channel_code = self.get_child_element_text(crs_element, 'channel-code', 'channel_code')

            defaults = dict(
                loan_terms_rate1=loan_terms_rate1,
                loan_terms_rate2=loan_terms_rate2,
                repayment_type=repayment_type,
                repayment_plan=repayment_plan,
                commitment_date=commitment_date,
                repayment_first_date=repayment_first_date,
                repayment_final_date=repayment_final_date,
                loan_status_year=loan_status_year,
                loan_status_currency=loan_status_currency,
                loan_status_value_date=loan_status_value_date,
                interest_received=interest_received,
                principal_outstanding=principal_outstanding,
                principal_arrears=principal_arrears,
                interest_arrears=interest_arrears,
                channel_code=channel_code
            )
            crs_obj, created = CrsAdd.objects.update_or_create(
                project=self.project, defaults=defaults)
            if created:
                changes.append('added CRS++ (id: {})'.format(crs_obj.pk))

            imported_flags = []
            self.model = CrsAddOtherFlag

            for other_flag in crs_element.findall('other-flags'):

                code = self.get_attrib(other_flag, 'code', 'code')

                significance = self.get_attrib(other_flag, 'significance', 'significance')
                significance = self.to_boolean(significance)

                other_flag_obj, created = CrsAddOtherFlag.objects.get_or_create(
                    crs=crs_obj,
                    code=code,
                    significance=significance
                )
                if created:
                    changes.append('added CRS++ other flag (id: {})'.format(other_flag_obj.pk))
                imported_flags.append(other_flag_obj)

            for other_flag in crs_obj.other_flags.all():
                if other_flag not in imported_flags:
                    changes.append('deleted CRS++ other flag (id: {})'.format(other_flag.pk))
                    other_flag.delete()
        else:
            try:
                crs_obj = CrsAdd.objects.get(project=self.project)
                changes.append('deleted CRS++ (id: {})'.format(crs_obj.pk))
                crs_obj.delete()
            except ObjectDoesNotExist:
                pass

        return changes


class FSSs(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(FSSs, self).__init__(iati_import_job, parent_elem, project,
                                   globals, related_obj)
        self.model = Fss

    def do_import(self):
        """
        Retrieve and store the FSS data.
        The FSS data will be extracted from the 'fss' element.

        :return: List; contains fields that have changed
        """
        changes = []

        fss_element = self.parent_elem.find('fss')
        if fss_element is not None:

            extraction_date = self.get_date(fss_element, 'extraction-date', 'extraction_date')

            priority = self.get_attrib(fss_element, 'priority', 'priority', None)
            priority = self.to_boolean(priority)

            phaseout_year = self.get_attrib_as_int(
                fss_element, 'phaseout-year', 'phaseout_year', None)

            defaults = dict(
                extraction_date=extraction_date,
                priority=priority,
                phaseout_year=phaseout_year,
            )
            fss_obj, created = Fss.objects.update_or_create(project=self.project, defaults=defaults)
            if created:
                changes.append('added FSS (id: {})'.format(fss_obj.pk))

            imported_forecasts = []
            self.model = FssForecast

            for forecast in fss_element.findall('forecast'):

                if forecast.text is not None:
                    value = self.cast_to_decimal(forecast.text, 'forecast', 'value')
                else:
                    value = None

                year = self.get_attrib_as_int(forecast, 'year', 'year', None)
                value_date = self.get_date(forecast, 'value-date', 'value_date')
                currency = self.get_attrib(forecast, 'currency', 'currency')

                forecast_obj, created = FssForecast.objects.get_or_create(
                    fss=fss_obj,
                    value=value,
                    year=year,
                    value_date=value_date,
                    currency=currency
                )
                if created:
                    changes.append('added FSS forecast (id: {})'.format(forecast_obj.pk))
                imported_forecasts.append(forecast_obj)

            for forecast in fss_obj.forecasts.all():
                if forecast not in imported_forecasts:
                    changes.append('deleted FSS forecast (id: {})'.format(forecast.pk))
                    forecast.delete()
        else:
            try:
                fss_obj = Fss.objects.get(project=self.project)
                changes.append('deleted FSS (id: {})'.format(fss_obj.pk))
                fss_obj.delete()
            except ObjectDoesNotExist:
                pass

        return changes
