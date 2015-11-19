# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.crs_add import CrsAdd, CrsAddOtherFlag
from ....rsr.models.fss import Fss, FssForecast
from ....rsr.models.legacy_data import LegacyData

from ..utils import add_log, ImportHelper

from datetime import datetime

from decimal import Decimal, InvalidOperation

from django.core.exceptions import ObjectDoesNotExist


class LegacyDatas(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(LegacyDatas, self).__init__(iati_import, parent_elem, project, globals, related_obj)
        self.model = LegacyData

    def do_import(self):
        """
        Retrieve and store the legacy data.
        The conditions will be extracted from the 'legacy-data' elements.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_lds = []
        changes = []

        for legacy in self.parent_elem.findall('legacy-data'):
            # name = ''
            # value = ''
            # iati_equivalent = ''

            name = self.get_attrib(legacy, 'name', 'name')
            # if 'name' in legacy.attrib.keys():
            #     name = legacy.attrib['name']
            #     if len(name) > 100:
            #         add_log(iati_import, 'legacy_data_name',
            #                 'name too long (100 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         name = name[:100]

            value = self.get_attrib(legacy, 'value', 'value')
            # if 'value' in legacy.attrib.keys():
            #     value = legacy.attrib['value']
            #     if len(value) > 100:
            #         add_log(iati_import, 'legacy_data_value',
            #                 'value too long (100 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         value = value[:100]

            iati_equivalent = self.get_attrib(legacy, 'iati-equivalent', 'iati_equivalent')
            # if 'iati-equivalent' in legacy.attrib.keys():
            #     iati_equivalent = legacy.attrib['iati-equivalent']
            #     if len(iati_equivalent) > 100:
            #         add_log(iati_import, 'legacy_data_iati_equivalent',
            #                 'iati equivalent too long (100 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         iati_equivalent = iati_equivalent[:100]

            legacy_obj, created = LegacyData.objects.get_or_create(
                project=self.project,
                name=name,
                value=value,
                iati_equivalent=iati_equivalent
            )

            if created:
                changes.append(u'added legacy data (id: {}): {}'.format(
                        legacy_obj.pk, legacy_obj))

            imported_lds.append(legacy_obj)

        changes += self.delete_objects(self.project.legacy_data, imported_lds, 'legacy data')
        # for legacy in self.project.legacy_data.all():
        #     if not legacy in imported_lds:
        #         changes.append(u'deleted legacy data (id: %s): %s' %
        #                        (str(legacy.pk),
        #                         legacy.__unicode__()))
        #         legacy.delete()
        return changes


class CrsAdds(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(CrsAdds, self).__init__(iati_import, parent_elem, project, globals, related_obj)
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
            # crs_ins, created = CrsAdd.objects.get_or_create(project=project)
            #
            # if created:
            #     changes.append(u'added CRS++ (id: %s)' % str(crs_ins.pk))
            #
            # loan_terms_rate1 = None
            # loan_terms_rate2 = None
            # repayment_type = ''
            # repayment_plan = ''
            # commitment_date = None
            # repayment_first_date = None
            # repayment_final_date = None
            # loan_status_year = None
            # loan_status_currency = ''
            # loan_status_value_date = None
            # interest_received = None
            # principal_outstanding = None
            # principal_arrears = None
            # interest_arrears = None

            loan_terms_element = crs_element.find('loan-terms')
            if loan_terms_element is not None:

                loan_terms_rate1 = self.get_attrib(
                        loan_terms_element, 'rate-1', 'loan_terms_rate1', None)
                # try:
                #     if 'rate-1' in loan_terms_element.attrib.keys():
                #         loan_terms_rate1 = Decimal(loan_terms_element.attrib['rate-1'])
                # except InvalidOperation as e:
                #     add_log(iati_import, 'crs_add_rate1', str(e), project)
                # crs_ins.loan_terms_rate1 = loan_terms_rate1

                loan_terms_rate2 = self.get_attrib(
                        loan_terms_element, 'rate-2', 'loan_terms_rate2', None)
                # try:
                #     if 'rate-2' in loan_terms_element.attrib.keys():
                #         loan_terms_rate2 = Decimal(loan_terms_element.attrib['rate-2'])
                # except InvalidOperation as e:
                #     add_log(iati_import, 'crs_add_rate2', str(e), project)
                # crs_ins.loan_terms_rate2 = loan_terms_rate2

                repayment_type = self.get_child_elem_attrib(
                        loan_terms_element, 'repayment-type', 'code', 'repayment_type')
                # repay_type_element = loan_terms_element.find('repayment-type')
                # if not repay_type_element is None and 'code' in repay_type_element.attrib.keys():
                #     if not len(repay_type_element.attrib['code']) > 1:
                #         repayment_type = repay_type_element.attrib['code']
                #     else:
                #         add_log(iati_import, 'crs_add_repayment_type',
                #                 'type is too long (1 character allowed)', project)
                # crs_ins.repayment_type = repayment_type

                repayment_plan = self.get_child_elem_attrib(
                    loan_terms_element, 'repayment-plan', 'code', 'repayment_plan')
                # repay_plan_element = loan_terms_element.find('repayment-plan')
                # if not repay_plan_element is None and 'code' in repay_plan_element.attrib.keys():
                #     if not len(repay_plan_element.attrib['code']) > 2:
                #         repayment_plan = repay_plan_element.attrib['code']
                #     else:
                #         add_log(iati_import, 'crs_add_repayment_plan',
                #                 'plan is too long (2 characters allowed)', project)
                # crs_ins.repayment_plan = repayment_plan

                commitment_date = self.get_child_as_date(
                        loan_terms_element, 'commitment-date', 'iso-date', 'commitment_date')
                # try:
                #     com_date_element = loan_terms_element.find('commitment-date')
                #     if not com_date_element is None and 'iso-date' in com_date_element.attrib.keys():
                #         commitment_date = datetime.strptime(
                #             com_date_element.attrib['iso-date'], '%Y-%m-%d'
                #         ).date()
                # except ValueError as e:
                #     add_log(iati_import, 'crs_add_commitment_date', str(e), project)
                # crs_ins.commitment_date = commitment_date

                repayment_first_date = self.get_child_as_date(
                    loan_terms_element, 'repayment-first-date', 'iso-date', 'repayment_first_date')
                # try:
                #     repay_first_elem = loan_terms_element.find('repayment-first-date')
                #     if not repay_first_elem is None and 'iso-date' in repay_first_elem.attrib.keys():
                #         repayment_first_date = datetime.strptime(
                #             repay_first_elem.attrib['iso-date'], '%Y-%m-%d'
                #         ).date()
                # except ValueError as e:
                #     add_log(iati_import, 'crs_add_repayment_first_date', str(e), project)
                # crs_ins.repayment_first_date = repayment_first_date

                repayment_final_date = self.get_child_as_date(
                    loan_terms_element, 'repayment-final-date', 'iso-date', 'repayment_final_date')
                # try:
                #     repay_final_elem = loan_terms_element.find('repayment-final-date')
                #     if not repay_final_elem is None and 'iso-date' in repay_final_elem.attrib.keys():
                #         repayment_final_date = datetime.strptime(
                #             repay_final_elem.attrib['iso-date'], '%Y-%m-%d'
                #         ).date()
                # except ValueError as e:
                #     add_log(iati_import, 'crs_add_repayment_final_date', str(e), project)
                # crs_ins.repayment_final_date = repayment_final_date

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
                loan_status_year = self.get_attrib(
                        loan_status_element, 'year', 'loan_status_year', None)
                # try:
                #     if 'year' in loan_status_element.attrib.keys():
                #         loan_status_year = int(loan_status_element.attrib['year'])
                # except ValueError as e:
                #     add_log(iati_import, 'crs_add_loan_status_year', str(e), project)
                # crs_ins.loan_status_year = loan_status_year

                loan_status_currency = self.get_attrib(
                        loan_status_element, 'currency', 'loan_status_currency')
                # if 'currency' in loan_status_element.attrib.keys():
                #     if not len(loan_status_element.attrib['currency']) > 3:
                #         loan_status_currency = loan_status_element.attrib['currency']
                #     else:
                #         add_log(iati_import, 'crs_add_loan_status_currency',
                #                 'currency is too long (3 characters allowed)', project)
                # crs_ins.loan_status_currency = loan_status_currency

                loan_status_value_date = self.get_date(
                    loan_status_element, 'value-date', 'loan_status_value_date')
                # try:
                #     if 'value-date' in loan_status_element.attrib.keys():
                #         loan_status_value_date = datetime.strptime(
                #             loan_status_element.attrib['iso-date'], '%Y-%m-%d'
                #         ).date()
                # except ValueError as e:
                #     add_log(iati_import, 'crs_add_value_date', str(e), project)
                # crs_ins.loan_status_value_date = loan_status_value_date


                interest_received = self.get_child_element_text_as_decimal(
                        loan_status_element, 'interest-received', 'interest_received', None)
                # try:
                #     interest_element = loan_status_element.find('interest-received')
                #     if not interest_element is None:
                #         interest_received = Decimal(interest_element.text)
                # except InvalidOperation as e:
                #     add_log(iati_import, 'crs_add_interest_received', str(e), project)
                # crs_ins.interest_received = interest_received
                principal_outstanding = self.get_child_element_text_as_decimal(
                        loan_status_element, 'principal-outstanding', 'principal_outstanding', None)
                # try:
                #     principal_element = loan_status_element.find('principal-outstanding')
                #     if not principal_element is None:
                #         principal_outstanding = Decimal(principal_element.text)
                # except InvalidOperation as e:
                #     add_log(iati_import, 'crs_add_principal_outstanding', str(e), project)
                # crs_ins.principal_outstanding = principal_outstanding

                principal_arrears = self.get_child_element_text_as_decimal(
                        loan_status_element, 'principal-arrears', 'principal_arrears', None)
                # try:
                #     prin_arrears_element = loan_status_element.find('principal-arrears')
                #     if not prin_arrears_element is None:
                #         principal_arrears = Decimal(prin_arrears_element.text)
                # except InvalidOperation as e:
                #     add_log(iati_import, 'crs_add_principal_arrears', str(e), project)
                # crs_ins.principal_arrears = principal_arrears

                interest_arrears = self.get_child_element_text_as_decimal(
                    loan_status_element, 'interest-arrears', 'interest_arrears', None)
                # try:
                #     inter_arrears_element = loan_status_element.find('interest-arrears')
                #     if not inter_arrears_element is None:
                #         interest_arrears = Decimal(inter_arrears_element.text)
                # except InvalidOperation as e:
                #     add_log(iati_import, 'crs_add_interest_arrears', str(e), project)
                # crs_ins.interest_arrears = interest_arrears
            else:
                loan_status_year = None
                loan_status_currency = ''
                loan_status_value_date = None
                interest_received = None
                principal_outstanding = None
                principal_arrears = None
                interest_arrears = None

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
            )

            crs_obj, created = CrsAdd.objects.update_or_create(
                    project=self.project, defaults=defaults)
            if created:
                changes.append(u'added CRS++ (id: {})'.format(crs_obj.pk))

            # crs_ins.save()

            imported_flags = []
            self.model = CrsAddOtherFlag

            for other_flag in crs_element.findall('other-flags'):
                code = ''
                significance = None

                code = self.get_attrib(other_flag, 'code', 'code')
                # if 'code' in other_flag.attrib.keys():
                #     if not len(other_flag.attrib['code']) > 1:
                #         code = other_flag.attrib['code']
                #     else:
                #         add_log(iati_import, 'crs_add_other_flag_code',
                #                 'code is too long (1 character allowed)', project)
                significance = self.get_attrib(other_flag, 'significance', 'significance')
                significance = self.to_boolean(significance)
                # if 'significance' in other_flag.attrib.keys():
                #     significance = other_flag.attrib['significance']
                #     if significance in TRUE_VALUES:
                #         significance = True
                #     elif significance in FALSE_VALUES:
                #         significance = False

                other_flag_obj, created = CrsAddOtherFlag.objects.get_or_create(
                    crs=crs_obj,
                    code=code,
                    significance=significance
                )

                if created:
                    changes.append(u'added CRS++ other flag (id: {})'.format(other_flag_obj.pk))

                imported_flags.append(other_flag_obj)

            for other_flag in crs_obj.other_flags.all():
                if not other_flag in imported_flags:
                    changes.append(u'deleted CRS++ other flag (id: {})'.format(other_flag.pk))
                    other_flag.delete()

        else:
            try:
                crs_obj = CrsAdd.objects.get(project=self.project)
                changes.append(u'deleted CRS++ (id: {})'.format(crs_obj.pk))
                crs_obj.delete()
            except ObjectDoesNotExist:
                pass

        return changes


class FSSs(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(FSSs, self).__init__(iati_import, parent_elem, project, globals, related_obj)
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
            # fss_ins, created = Fss.objects.get_or_create(project=project)
            #
            # if created:
            #     changes.append(u'added FSS (id: %s)' % str(fss_ins.pk))
            #
            # extraction_date = None
            # priority = None
            # phaseout_year = None

            extraction_date = self.get_date(fss_element, 'extraction-date', 'extraction_date')
            # try:
            #     if 'extraction-date' in fss_element.attrib.keys():
            #         extraction_date = datetime.strptime(
            #             fss_element.attrib['extraction-date'], '%Y-%m-%d'
            #         ).date()
            # except ValueError as e:
            #     add_log(iati_import, 'fss_extraction_date', str(e), project)
            # fss_ins.extraction_date = extraction_date

            priority = self.get_attrib(fss_element, 'priority', 'priority', None)
            priority = self.to_boolean(priority)
            # if 'priority' in fss_element.attrib.keys():
            #     priority = fss_element.attrib['priority']
            #     if priority in TRUE_VALUES:
            #         priority = True
            #     elif priority in FALSE_VALUES:
            #         priority = False
            # fss_ins.priority = priority
            phaseout_year = self.get_attrib(fss_element, 'phaseout-year', 'phaseout_year', None)
            # try:
            #     if 'phaseout-year' in fss_element.attrib.keys():
            #         phaseout_year = int(fss_element.attrib['phaseout-year'])
            # except ValueError as e:
            #     add_log(iati_import, 'fss_phaseout_year', str(e), project)
            # fss_ins.phaseout_year = phaseout_year

            defaults = dict(
                extraction_date=extraction_date,
                priority=priority,
                phaseout_year=phaseout_year,
            )
            fss_obj, created = Fss.objects.update_or_create(project=self.project, defaults=defaults)

            if created:
                changes.append(u'added FSS (id: {})'.format(fss_obj.pk))

            # fss_ins.save()

            imported_forecasts = []
            self.model = FssForecast

            for forecast in fss_element.findall('forecast'):
                # year = None
                # value_date = None
                # currency = ''
                # value = None

                if forecast.text is not None:
                    value = self.cast_to_decimal(forecast.text, 'forecast', 'value')
                else:
                    value = None
                # try:
                #     if forecast.text is not None:
                #         value = Decimal(forecast.text)
                # except InvalidOperation as e:
                #     add_log(iati_import, 'fss_forecast_value', str(e), project)

                year = self.get_attrib(forecast, 'year', 'year', None)
                # try:
                #     if 'year' in forecast.attrib.keys():
                #         year = int(forecast.attrib['year'])
                # except ValueError as e:
                #     add_log(iati_import, 'fss_forecast_year', str(e), project)

                value_date = self.get_date(forecast, 'value-date', 'value_date')
                # try:
                #     if 'value-date' in forecast.attrib.keys():
                #         value_date = datetime.strptime(forecast.attrib['value-date'], '%Y-%m-%d').date()
                # except ValueError as e:
                #     add_log(iati_import, 'fss_forecast_value_date', str(e), project)

                currency = self.get_attrib(forecast, 'currency', 'currency')
                # if 'currency' in forecast.attrib.keys():
                #     if not len(forecast.attrib['currency']) > 3:
                #         currency = forecast.attrib['currency']
                #     else:
                #         add_log(iati_import, 'fss_forecast_currency',
                #                 'currency is too long (3 characters allowed)', project)

                forecast_obj, created = FssForecast.objects.get_or_create(
                    fss=fss_obj,
                    value=value,
                    year=year,
                    value_date=value_date,
                    currency=currency
                )

                if created:
                    changes.append(u'added FSS forecast (id: {})'.format(forecast_obj.pk))

                imported_forecasts.append(forecast_obj)

            for forecast in fss_obj.forecasts.all():
                if not forecast in imported_forecasts:
                    changes.append(u'deleted FSS forecast (id: {})'.format(forecast.pk))
                    forecast.delete()

        else:
            try:
                fss_obj = Fss.objects.get(project=self.project)
                changes.append(u'deleted FSS (id: {})'.format(fss_obj.pk))
                fss_obj.delete()
            except ObjectDoesNotExist:
                pass

        return changes
