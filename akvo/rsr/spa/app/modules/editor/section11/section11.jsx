import React from 'react'
import { connect } from 'react-redux'
import { Form, Select, Row, Col, Divider } from 'antd'
import { Field, Form as FinalForm } from 'react-final-form'
import currencies from 'currency-codes/data'
import arrayMutators from 'final-form-arrays'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import InputLabel from '../../../utils/input-label'
import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'
import CHANNEL_CODES from './channel-codes.json'
import FlagsStack from './comp/flags-stack'
import ForecastsStack from './comp/forecasts-stack'
import LegaciesStack from './comp/legacies-stack'
import './styles.scss'
import SectionContext from '../section-context';

const { Item } = Form
const { Option } = Select

const LoanTerms = () => {
  const { t } = useTranslation()
  return (
    <section>
      <div className="h-holder">
        <h4>{t('Loan terms')}</h4>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            name="crs[0].repaymentType"
            render={({ input }) => (
              <Item label={<InputLabel optional tooltip={t('An IATI codelist tabulating CRS-specified values for the type of Repayment. See the <a href="http://iatistandard.org/202/codelists/LoanRepaymentType/" target="_blank">IATI codelist</a>.')}>{t('Repayment type')}</InputLabel>}>
                <Select {...input}>
                  <Option value="">None</Option>
                  <Option value="1">1 - Equal Principal Payments (EPP)</Option>
                  <Option value="2">2 - Annuity</Option>
                  <Option value="3">3 - Lump sum</Option>
                  <Option value="5">5 - Other</Option>
                </Select>
              </Item>
            )}
          />
        </Col>
        <Col span={12}>
          <FinalField
            name="crs[0].repaymentPlan"
            render={({ input }) => (
              <Item label={<InputLabel optional tooltip={t('An IATI codelist tabulating CRS-specified values for the number of repayments per annum. See the <a href="http://iatistandard.org/202/codelists/LoanRepaymentPeriod/" target="_blank">IATI codelist</a>.')}>{t('Repayment plan')}</InputLabel>}>
                <Select {...input}>
                  <Option value="">None</Option>
                  <Option value="1">1 - Annual</Option>
                  <Option value="2">2 - Semi-annual</Option>
                  <Option value="4">4 - Quarterly</Option>
                  <Option value="12">12 - Monthly</Option>
                </Select>
              </Item>
            )}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            control="datepicker"
            name="crs[0].commitmentDate"
            withLabel optional
            dict={{
              label: t('Commitment date'),
              tooltip: t('The CRS++ reported commitment date.')
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            name="crs[0].repaymentFirstDate"
            control="datepicker"
            withLabel optional
            dict={{
              label: t('First repayment date'),
              tooltip: t('The CRS++ reported first repayment date.')
            }}
          />
        </Col>
        <Col span={12}>
          <FinalField
            name="crs[0].repaymentFinalDate"
            control="datepicker"
            withLabel optional
            dict={{
              label: t('Final repayment date'),
              tooltip: t('The CRS++ reported final repayment date.')
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            name="crs[0].loanTermsRate1"
            control="input"
            suffix={<span>%</span>}
            withLabel optional
            dict={{
              label: `${t('Rate')} 1`,
              tooltip: t('Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2.')
            }}
          />
        </Col>
        <Col span={12}>
          <FinalField
            name="crs[0].loanTermsRate2"
            control="input"
            suffix={<span>%</span>}
            withLabel optional
            dict={{
              label: `${t('Rate')} 2`,
              tooltip: t('Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here.')
            }}
          />
        </Col>
      </Row>
    </section>
  )
}

const LoanStatus = ({ currency }) => {
  const { t } = useTranslation()
  const currencySymbol = getSymbolFromCurrency(currency)
  return (
    <section>
      <div className="h-holder">
        <h4>{t('Loan Status')}</h4>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            name="crs[0].loanStatusYear"
            control="input"
            withLabel optional
            dict={{
              label: t('Year'),
              tooltip: t('CRS reporting year (CRS++ Column 1).')
            }}
          />
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional>{t('Currency')}</InputLabel>}>
          <FinalField
            name="crs[0].loanStatusCurrency"
            control="select"
            showSearch
            optionFilterProp="children"
            options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
          />
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FinalField
            name="crs[0].loanStatusValueDate"
            control="datepicker"
            withLabel optional
            dict={{
              label: t('value date'),
              tooltip: t('Enter the specific date (DD/MM/YYYY) for the loan status values.')
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            name="crs[0].interestReceived"
            control="input-number"
            currencySymbol={currencySymbol}
            withLabel optional
            dict={{
              label: t('Interest received'),
              tooltip: t('Interest received during the reporting year.')
            }}
          />
        </Col>
        <Col span={12}>
          <FinalField
            name="crs[0].principalOutstanding"
            control="input-number"
            currencySymbol={currencySymbol}
            withLabel optional
            dict={{
              label: t('Principal outstanding'),
              tooltip: t('The amount of principal owed on the loan at the end of the reporting year.')
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FinalField
            name="crs[0].principalArrears"
            control="input-number"
            currencySymbol={currencySymbol}
            withLabel optional
            dict={{
              label: t('Principal arrears'),
              tooltip: t('Arrears of principal at the end of the year. Included in principal outstanding.')
          }}
        />
        </Col>
        <Col span={12}>
          <FinalField
            name="crs[0].interestArrears"
            control="input-number"
            currencySymbol={currencySymbol}
            withLabel optional
            dict={{
              label: t('Interest arrears'),
              tooltip: t('Arrears of interest at the end of the year.')
            }}
          />
        </Col>
      </Row>
    </section>
  )
}


const Reporting = ({ fields, projectId }) => {
  const { t } = useTranslation()
  const initialValues = { ...fields }
  return (
    <div className="reporting view">
      <SectionContext.Provider value="section11">
      <h3>CRS++</h3>
      <Form layout="vertical">
        <FinalForm
          onSubmit={() => { }}
          initialValues={initialValues}
          subscription={{}}
          mutators={{ ...arrayMutators }}
          render={({
            form: {
              mutators: { push }
            }
          }) => {
            if (!fields.crs || fields.crs.length === 0) {
              push('crs', { project: projectId })
            }
            if (!fields.fss || fields.fss.length === 0) {
              push('fss', { project: projectId })
            }
            return (
              <div>
                <AutoSave sectionIndex={11} setName="crs" itemIndex={0} />
                <AutoSave sectionIndex={11} setName="fss" itemIndex={0} />
                <LoanTerms />
                <Field
                  name="currency"
                  render={({ input }) => <LoanStatus currency={input.value} />}
                />
                <Item className="channel-code-item" label={<InputLabel optional tooltip={t('The CRS channel code for this activity. The codelist contains both organisation types and names of organisations. For non-CRS purposes these should be reported using participating organisations. See the <a href="http://iatistandard.org/202/codelists/CRSChannelCode/" target="_blank">IATI codelist</a>.')}>{t('channel code')}</InputLabel>}>
                  <FinalField
                    name="crs[0].channelCode"
                    showSearch
                    optionFilterProp="children"
                    options={CHANNEL_CODES}
                    control="select"
                  />
                </Item>
                <FlagsStack formPush={push} crsParent={fields.crs[0]} />
                <Divider />
                <h3>FSS</h3>
                <Item label={<InputLabel tooltip={t('The exact date when the information was collected or extracted from donors\' aid management systems.')}>{t('extraction date')}</InputLabel>}>
                  <FinalField
                    name="fss[0].extractionDate"
                    style={{ display: 'block' }}
                    control="datepicker"
                  />
                </Item>
                <FinalField
                  name="fss[0].phaseoutYear"
                  control="input"
                  className="phaseout-year-input"
                  withLabel optional
                  dict={{
                    label: t('phaseout year'),
                    tooltip: t('If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements.')
                  }}
                />
                <Item label={<InputLabel optional tooltip={t('True if the partner country is a priority partner country.')}>{t('priority')}</InputLabel>}>
                  <FinalField
                    name="fss[0].priority"
                    control="select"
                    options={[{ value: true, label: t('Yes') }, { value: false, label: t('No') }]}
                    withEmptyOption
                  />
                </Item>
                <h3>{t('FSS forecasts')}</h3>
                <ForecastsStack formPush={push} fssParent={fields.fss[0]} />
                <h3>{t('Legacy data')}</h3>
                <LegaciesStack formPush={push} />
              </div>
            )
          }}
        />
      </Form>
      </SectionContext.Provider>
    </div>
  )
}


export default connect(
  ({ editorRdr: { projectId, section11: { fields }, validations } }) => ({ fields, validations, projectId }),
)(React.memo(Reporting, (prevProps, nextProps) => {
  // return isEqual(prevProps.fields, nextProps.fields)
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1
  return !shouldUpdate
}))
