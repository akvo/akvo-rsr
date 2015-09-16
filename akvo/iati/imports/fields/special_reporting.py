# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import add_log

from datetime import datetime

from decimal import Decimal, InvalidOperation

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import get_model

TRUE_VALUES = [
    'true',
    '1',
    't',
    'yes'
]

FALSE_VALUES = [
    'false',
    '0',
    'f',
    'no'
]


def legacy_data(iati_import, activity, project, activities_globals):
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

    for legacy in activity.findall('legacy-data'):
        name = ''
        value = ''
        iati_equivalent = ''

        if 'name' in legacy.attrib.keys():
            name = legacy.attrib['name']
            if len(name) > 100:
                add_log(iati_import, 'legacy_data_name',
                        'name too long (100 characters allowed)', project, 3)
                name = name[:100]

        if 'value' in legacy.attrib.keys():
            value = legacy.attrib['value']
            if len(value) > 100:
                add_log(iati_import, 'legacy_data_value',
                        'value too long (100 characters allowed)', project, 3)
                value = value[:100]

        if 'iati-equivalent' in legacy.attrib.keys():
            iati_equivalent = legacy.attrib['iati-equivalent']
            if len(iati_equivalent) > 100:
                add_log(iati_import, 'legacy_data_iati_equivalent',
                        'iati equivalent too long (100 characters allowed)', project, 3)
                iati_equivalent = iati_equivalent[:100]

        ld, created = get_model('rsr', 'legacydata').objects.get_or_create(
            project=project,
            name=name,
            value=value,
            iati_equivalent=iati_equivalent
        )

        if created:
            changes.append(u'added legacy data (id: %s): %s' % (str(ld.pk), ld))

        imported_lds.append(ld)

    for legacy in project.legacy_data.all():
        if not legacy in imported_lds:
            changes.append(u'deleted legacy data (id: %s): %s' %
                           (str(legacy.pk),
                            legacy.__unicode__()))
            legacy.delete()

    return changes


def crs_add(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the CRS++ data.
    The CRS++ data will be extracted from the 'crs-add' element.

    :param iati_import: IatiImport instance
    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    changes = []

    crs_element = activity.find('crs-add')
    if not crs_element is None:
        crs_ins, created = get_model('rsr', 'crsadd').objects.get_or_create(project=project)

        if created:
            changes.append(u'added CRS++ (id: %s)' % str(crs_ins.pk))

        loan_terms_rate1 = None
        loan_terms_rate2 = None
        repayment_type = ''
        repayment_plan = ''
        commitment_date = None
        repayment_first_date = None
        repayment_final_date = None
        loan_status_year = None
        loan_status_currency = ''
        loan_status_value_date = None
        interest_received = None
        principal_outstanding = None
        principal_arrears = None
        interest_arrears = None

        loan_terms_element = crs_element.find('loan-terms')
        if not loan_terms_element is None:
            try:
                if 'rate-1' in loan_terms_element.attrib.keys():
                    loan_terms_rate1 = Decimal(loan_terms_element.attrib['rate-1'])
            except InvalidOperation as e:
                add_log(iati_import, 'crs_add_rate1', str(e), project)
            crs_ins.loan_terms_rate1 = loan_terms_rate1

            try:
                if 'rate-2' in loan_terms_element.attrib.keys():
                    loan_terms_rate2 = Decimal(loan_terms_element.attrib['rate-2'])
            except InvalidOperation as e:
                add_log(iati_import, 'crs_add_rate2', str(e), project)
            crs_ins.loan_terms_rate2 = loan_terms_rate2

            repay_type_element = loan_terms_element.find('repayment-type')
            if not repay_type_element is None and 'code' in repay_type_element.attrib.keys():
                if not len(repay_type_element.attrib['code']) > 1:
                    repayment_type = repay_type_element.attrib['code']
                else:
                    add_log(iati_import, 'crs_add_repayment_type',
                            'type is too long (1 character allowed)', project)
            crs_ins.repayment_type = repayment_type

            repay_plan_element = loan_terms_element.find('repayment-plan')
            if not repay_plan_element is None and 'code' in repay_plan_element.attrib.keys():
                if not len(repay_plan_element.attrib['code']) > 2:
                    repayment_plan = repay_plan_element.attrib['code']
                else:
                    add_log(iati_import, 'crs_add_repayment_plan',
                            'plan is too long (2 characters allowed)', project)
            crs_ins.repayment_plan = repayment_plan

            try:
                com_date_element = loan_terms_element.find('commitment-date')
                if not com_date_element is None and 'iso-date' in com_date_element.attrib.keys():
                    commitment_date = datetime.strptime(
                        com_date_element.attrib['iso-date'], '%Y-%m-%d'
                    ).date()
            except ValueError as e:
                add_log(iati_import, 'crs_add_commitment_date', str(e), project)
            crs_ins.commitment_date = commitment_date

            try:
                repay_first_elem = loan_terms_element.find('repayment-first-date')
                if not repay_first_elem is None and 'iso-date' in repay_first_elem.attrib.keys():
                    repayment_first_date = datetime.strptime(
                        repay_first_elem.attrib['iso-date'], '%Y-%m-%d'
                    ).date()
            except ValueError as e:
                add_log(iati_import, 'crs_add_repayment_first_date', str(e), project)
            crs_ins.repayment_first_date = repayment_first_date

            try:
                repay_final_elem = loan_terms_element.find('repayment-final-date')
                if not repay_final_elem is None and 'iso-date' in repay_final_elem.attrib.keys():
                    repayment_final_date = datetime.strptime(
                        repay_final_elem.attrib['iso-date'], '%Y-%m-%d'
                    ).date()
            except ValueError as e:
                add_log(iati_import, 'crs_add_repayment_final_date', str(e), project)
            crs_ins.repayment_final_date = repayment_final_date

        loan_status_element = crs_element.find('loan-status')
        if not loan_status_element is None:
            try:
                if 'year' in loan_status_element.attrib.keys():
                    loan_status_year = int(loan_status_element.attrib['year'])
            except ValueError as e:
                add_log(iati_import, 'crs_add_loan_status_year', str(e), project)
            crs_ins.loan_status_year = loan_status_year

            if 'currency' in loan_status_element.attrib.keys():
                if not len(loan_status_element.attrib['currency']) > 3:
                    loan_status_currency = loan_status_element.attrib['currency']
                else:
                    add_log(iati_import, 'crs_add_loan_status_currency',
                            'currency is too long (3 characters allowed)', project)
            crs_ins.loan_status_currency = loan_status_currency

            try:
                if 'value-date' in loan_status_element.attrib.keys():
                    loan_status_value_date = datetime.strptime(
                        loan_status_element.attrib['iso-date'], '%Y-%m-%d'
                    ).date()
            except ValueError as e:
                add_log(iati_import, 'crs_add_value_date', str(e), project)
            crs_ins.loan_status_value_date = loan_status_value_date

            try:
                interest_element = loan_status_element.find('interest-received')
                if not interest_element is None:
                    interest_received = Decimal(interest_element.text)
            except InvalidOperation as e:
                add_log(iati_import, 'crs_add_interest_received', str(e), project)
            crs_ins.interest_received = interest_received

            try:
                principal_element = loan_status_element.find('principal-outstanding')
                if not principal_element is None:
                    principal_outstanding = Decimal(principal_element.text)
            except InvalidOperation as e:
                add_log(iati_import, 'crs_add_principal_outstanding', str(e), project)
            crs_ins.principal_outstanding = principal_outstanding

            try:
                prin_arrears_element = loan_status_element.find('principal-arrears')
                if not prin_arrears_element is None:
                    principal_arrears = Decimal(prin_arrears_element.text)
            except InvalidOperation as e:
                add_log(iati_import, 'crs_add_principal_arrears', str(e), project)
            crs_ins.principal_arrears = principal_arrears

            try:
                inter_arrears_element = loan_status_element.find('interest-arrears')
                if not inter_arrears_element is None:
                    interest_arrears = Decimal(inter_arrears_element.text)
            except InvalidOperation as e:
                add_log(iati_import, 'crs_add_interest_arrears', str(e), project)
            crs_ins.interest_arrears = interest_arrears

        crs_ins.save()

        imported_flags = []

        for other_flag in crs_element.findall('other-flags'):
            code = ''
            significance = None

            if 'code' in other_flag.attrib.keys():
                if not len(other_flag.attrib['code']) > 1:
                    code = other_flag.attrib['code']
                else:
                    add_log(iati_import, 'crs_add_other_flag_code',
                            'code is too long (1 character allowed)', project)

            if 'significance' in other_flag.attrib.keys():
                significance = other_flag.attrib['significance']
                if significance in TRUE_VALUES:
                    significance = True
                elif significance in FALSE_VALUES:
                    significance = False

            of, created = get_model('rsr', 'crsaddotherflag').objects.get_or_create(
                crs=crs_ins,
                code=code,
                significance=significance
            )

            if created:
                changes.append(u'added CRS++ other flag (id: %s)' % str(of.pk))

            imported_flags.append(of)

        for other_flag in crs_ins.other_flags.all():
            if not other_flag in imported_flags:
                changes.append(u'deleted CRS++ other flag (id: %s)' % str(other_flag.pk))
                other_flag.delete()

    else:
        try:
            crs_ins = get_model('rsr', 'crsadd').objects.get(project=project)
            changes.append(u'deleted CRS++ (id: %s)' % str(crs_ins.pk))
            crs_ins.delete()
        except ObjectDoesNotExist:
            pass

    return changes


def fss(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the FSS data.
    The FSS data will be extracted from the 'fss' element.

    :param iati_import: IatiImport instance
    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    changes = []

    fss_element = activity.find('fss')
    if not fss_element is None:
        fss_ins, created = get_model('rsr', 'fss').objects.get_or_create(project=project)

        if created:
            changes.append(u'added FSS (id: %s)' % str(fss_ins.pk))

        extraction_date = None
        priority = None
        phaseout_year = None

        try:
            if 'extraction-date' in fss_element.attrib.keys():
                extraction_date = datetime.strptime(
                    fss_element.attrib['extraction-date'], '%Y-%m-%d'
                ).date()
        except ValueError as e:
            add_log(iati_import, 'fss_extraction_date', str(e), project)
        fss_ins.extraction_date = extraction_date

        if 'priority' in fss_element.attrib.keys():
            priority = fss_element.attrib['priority']
            if priority in TRUE_VALUES:
                priority = True
            elif priority in FALSE_VALUES:
                priority = False
        fss_ins.priority = priority

        try:
            if 'phaseout-year' in fss_element.attrib.keys():
                phaseout_year = int(fss_element.attrib['phaseout-year'])
        except ValueError as e:
            add_log(iati_import, 'fss_phaseout_year', str(e), project)
        fss_ins.phaseout_year = phaseout_year

        fss_ins.save()

        imported_forecasts = []

        for forecast in fss_element.findall('forecast'):
            year = None
            value_date = None
            currency = ''
            value = None

            try:
                if forecast.text is not None:
                    value = Decimal(forecast.text)
            except InvalidOperation as e:
                add_log(iati_import, 'fss_forecast_value', str(e), project)

            try:
                if 'year' in forecast.attrib.keys():
                    year = int(forecast.attrib['year'])
            except ValueError as e:
                add_log(iati_import, 'fss_forecast_year', str(e), project)

            try:
                if 'value-date' in forecast.attrib.keys():
                    value_date = datetime.strptime(forecast.attrib['value-date'], '%Y-%m-%d').date()
            except ValueError as e:
                add_log(iati_import, 'fss_forecast_value_date', str(e), project)

            if 'currency' in forecast.attrib.keys():
                if not len(forecast.attrib['currency']) > 3:
                    currency = forecast.attrib['currency']
                else:
                    add_log(iati_import, 'fss_forecast_currency',
                            'currency is too long (3 characters allowed)', project)

            fore, created = get_model('rsr', 'fssforecast').objects.get_or_create(
                fss=fss_ins,
                value=value,
                year=year,
                value_date=value_date,
                currency=currency
            )

            if created:
                changes.append(u'added FSS forecast (id: %s)' % str(fore.pk))

            imported_forecasts.append(fore)

        for forecast in fss_ins.forecasts.all():
            if not forecast in imported_forecasts:
                changes.append(u'deleted FSS forecast (id: %s)' % str(forecast.pk))
                forecast.delete()

    else:
        try:
            fss_ins = get_model('rsr', 'fss').objects.get(project=project)
            changes.append(u'deleted FSS (id: %s)' % str(fss_ins.pk))
            fss_ins.delete()
        except ObjectDoesNotExist:
            pass

    return changes
