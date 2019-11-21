import React from 'react'
import { Button, Form, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { Aux } from '../../../../utils/misc'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import SearchItem from './search-item'
import Administratives from './administratives'
import FEATURE_OPTIONS from './feature-options.json'
import validationDefs from './validations'
import '../styles.scss'
import MinRequired from '../../../../utils/min-required'

const { Item } = Form

const LocationItems = ({ validations, formPush, primaryOrganisation }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <div className="min-required-wrapper">
        <h3>{t('Locations')}</h3>
        <MinRequired section="section7" setName="locationItems" />
      </div>
      <ItemArray
        setName="locationItems"
        sectionIndex={7}
        header={(index, location) => {
          let text
          if(location){
            if (location.description.split(',')[0] !== '(Unspecified city)') text = location.description.split(',')[0]
            else text = location.description.split(',')[1]
          }
          return (
            <span>{t('Location')} {index + 1}: {text}</span>
          )
        }}
        headerField="location"
        formPush={formPush}
        newItem={{ administratives: []}}
        panel={name => (
          <Aux>
            <FinalField
              name={`${name}.location`}
              render={({ input }) => (
                <SearchItem
                  {...input}
                />
              )}
            />
            <Item label={<InputLabel optional>{t('address 1')}</InputLabel>}>
            <FinalField
              name={`${name}.address1`}
              control="input"
            />
            </Item>
            <Item label={<InputLabel optional>{t('address 2')}</InputLabel>}>
            <FinalField
              name={`${name}.address2`}
              control="input"
            />
            </Item>
            <Item label={<InputLabel optional>{t('postal code')}</InputLabel>}>
            <FinalField
              name={`${name}.postcode`}
              control="input"
            />
            </Item>
            <Row gutter={16}>
              {fieldExists('name') &&
              <Col span={8}>
                <FinalField
                  name={`${name}.name`}
                  control="input"
                  withLabel
                  dict={{
                    label: t('name'),
                    tooltip: t('The human-readable name for the location.')
                  }}
                  optional
                />
              </Col>
              }
              {fieldExists('reference') &&
              <Col span={8}>
                <FinalField
                  name={`${name}.reference`}
                  control="input"
                  optional
                  withLabel
                  dict={{
                    label: t('reference'),
                    tooltip: t('An internal reference that describes the location in the reporting organisation\'s own system.For reference see: <a href="http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes" target="_blank">http://iatistandard.org/202/activity-standard/iati-activities/iati-activity/location/#attributes</a>.')
              }}
            />
              </Col>
              }
              {fieldExists('locationCode') &&
              <Col span={8}>
                <FinalField
                  name={`${name}.locationCode`}
                  control="input"
                  withLabel
                  optional
                  dict={{
                    label: t('code'),
                    tooltip: t('Enter a code to identify the region. Codes are based on DAC region codes. Where an activity is considered global, the code 998 can be used. For reference: <a href="http://www.oecd.org/dac/stats/dacandcrscodelists.htm" target="_blank">http://www.oecd.org/dac/stats/dacandcrscodelists.htm</a>.')
                  }}
                />
              </Col>
              }
            </Row>
            <Row gutter={16}>
              {fieldExists('locationDescription') &&
              <Col span={12}>
                <FinalField
                  name={`${name}.locationDescription`}
                  control="textarea"
                  rows={3}
                  withLabel
                  optional
                  dict={{
                    label: t('location description'),
                    tooltip: t('This provides free text space for providing an additional description, if needed, of the actual target of the activity. A description that qualifies the location, not the activity.')
                  }}
                />
              </Col>
              }
              {fieldExists('activityDescription') &&
              <Col span={12}>
                <FinalField
                  name={`${name}.activityDescription`}
                  control="textarea"
                  rows={3}
                  withLabel
                  optional
                  dict={{
                    label: t('location description'),
                    tooltip: t('A description that qualifies the activity taking place at the location. This should not duplicate information provided in the main activity description, and should typically be used to distinguish between activities at multiple locations within a single iati-activity record.')
                  }}
                />
              </Col>
              }
            </Row>
            <Row gutter={16}>
              {fieldExists('locationPrecision') &&
              <Col span={12}>
                <FinalField
                  name={`${name}.locationPrecision`}
                  control="select"
                  options={[
                    {value: '1', label: 'Exact'},
                    {value: '2', label: 'Approximate'}
                  ]}
                  withEmptyOption
                  withLabel
                  optional
                  dict={{
                    label: t('location precision'),
                    tooltip: t('Defines whether the location represents the most distinct point reasonably possible for this type of activity or is an approximation due to lack of more detailed information.')
                  }}
                />
              </Col>
              }
              {fieldExists('locationReach') &&
              <Col span={12}>
                <FinalField
                  name={`${name}.locationReach`}
                  control="select"
                  options={[
                    {value: '1', label: t('Activity')},
                    {value: '2', label: t('Intended beneficiaries')}
                  ]}
                  withEmptyOption
                  withLabel
                  optional
                  dict={{
                    label: t('reach'),
                    tooltip: t('Does this location describe where the activity takes place or where the intended beneficiaries reside?')
                  }}
                />
              </Col>
              }
            </Row>
            <Row gutter={16}>
              {fieldExists('locationClass') &&
              <Col span={12}>
                <FinalField
                  name={`${name}.locationClass`}
                  control="select"
                  options={[
                    {value: '1', label: t('Administrative Region')},
                    {value: '2', label: t('Populated Place')},
                    {value: '3', label: t('Structure')},
                    {value: '4', label: t('Other Topographical Feature')}
                  ]}
                  withEmptyOption
                  withLabel
                  optional
                  dict={{
                    label: t('class'),
                    tooltip: t('Does the location refer to a physical structure such as a building, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve)? For reference: <a href="http://iatistandard.org/202/codelists/GeographicLocationClass/" target="_blank">http://iatistandard.org/202/codelists/GeographicLocationClass/</a>.')
                  }}
                />
              </Col>
              }
              {fieldExists('featureDesignation') &&
              <Col span={12}>
                <FinalField
                  name={`${name}.featureDesignation`}
                  control="select"
                  options={FEATURE_OPTIONS}
                  showSearch
                  optionFilterProp="children"
                  withEmptyOption
                  withLabel
                  optional
                  dict={{
                    label: t('feature desgination'),
                    tooltip: t('Does the location refer to a physical structure such as a building, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve)? For reference: <a href="http://iatistandard.org/202/codelists/GeographicLocationClass/" target="_blank">http://iatistandard.org/202/codelists/GeographicLocationClass/</a>.')
                  }}
                />
              </Col>
              }
            </Row>
            {fieldExists('administratives') &&
            <div>
            <h5>{t('Administratives')}</h5>
            <FinalField name={`${name}.id`} render={({input}) => <Administratives push={formPush} parentName={name} locationId={input.value} primaryOrganisation={primaryOrganisation} />} />
            </div>
            }
          </Aux>
        )}
        addButton={({ onClick }) => (
          <Button onClick={onClick} icon="plus" type="dashed" block>
            {t('Add location')}
          </Button>
        )}
      />
    </div>
  )
}

export default LocationItems
