import React from 'react'
import { connect } from 'react-redux'
import { Form, Select, Row, Col, Divider } from 'antd'
import { Field, Form as FinalForm } from 'react-final-form'
import currencies from 'currency-codes/data'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'
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
          <Item label={<InputLabel optional tooltip={t('The CRS++ reported commitment date.')}>{t('Commitment date')}</InputLabel>}>
            <FinalField
              control="datepicker"
              name="crs[0].commitmentDate"
            />
          </Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('The CRS++ reported first repayment date.')}>{t('First repayment date')}</InputLabel>}>
            <FinalField
              name="crs[0].repaymentFirstDate"
              control="datepicker"
            />
          </Item>
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('The CRS++ reported final repayment date.')}>{t('Final repayment date')}</InputLabel>}>
            <FinalField
              name="crs[0].repaymentFinalDate"
              control="datepicker"
            />
          </Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('Interest Rate. If an ODA loan with variable interest rate, report the variable rate here and the reference fixed rate as rate 2.')}>{t('Rate')} 1</InputLabel>}>
            <FinalField
              name="crs[0].loanTermsRate1"
              suffix={<span>%</span>}
            />
          </Item>
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('Second Interest Rate. If an ODA loan with variable interest rate, report the variable rate as rate 1 and the reference fixed rate here.')}>{t('Rate')} 2</InputLabel>}>
            <FinalField
              name="crs[0].loanTermsRate2"
              suffix={<span>%</span>}
            />
          </Item>
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
          <Item label={<InputLabel optional tooltip={t('CRS reporting year (CRS++ Column 1).')}>{t('Year')}</InputLabel>}>
          <FinalField
            name="crs[0].loanStatusYear"
          />
          </Item>
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
          <Item label={<InputLabel optional tooltip={t('Enter the specific date (DD/MM/YYYY) for the loan status values.')}>{t('value date')}</InputLabel>}>
          <FinalField
            name="crs[0].loanStatusValueDate"
            control="datepicker"
          />
          </Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('Interest received during the reporting year.')}>{t('Interest received')}</InputLabel>}>
          <FinalField
            name="crs[0].interestReceived"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('The amount of principal owed on the loan at the end of the reporting year.')}>{t('Principal outstanding')}</InputLabel>}>
          <FinalField
            name="crs[0].principalOutstanding"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('Arrears of principal at the end of the year. Included in principal outstanding.')}>{t('Principal arrears')}</InputLabel>}>
          <FinalField
            name="crs[0].principalArrears"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip={t('Arrears of interest at the end of the year.')}>{t('Interest arrears')}</InputLabel>}>
          <FinalField
            name="crs[0].interestArrears"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
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
                <Item label={<InputLabel optional tooltip={t('If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements.')}>{t('phaseout year')}</InputLabel>}>
                  <FinalField
                    name="fss[0].phaseoutYear"
                    control="input-number"
                    className="phaseout-year-input"
                  />
                </Item>
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
    </div>
  )
}


export default connect(
  ({ editorRdr: { projectId, section11: { fields }, validations } }) => ({ fields, validations, projectId }),
)(React.memo(Reporting, (prevProps, nextProps) => {
  return isEqual(prevProps.fields, nextProps.fields)
}))
