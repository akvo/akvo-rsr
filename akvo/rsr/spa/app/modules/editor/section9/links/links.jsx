import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'


const Links = ({ formPush }) => {
  const { t } = useTranslation()
  return (
    <div>
      <h3>{t('Links')}</h3>
      <ItemArray
        formPush={formPush}
        header={`${t('Link')} $index: $caption`}
        sectionIndex={9}
        setName="links"
        panel={name => (
          <div>
            <FinalField
              name={`${name}.url`}
              control="input"
              withLabel
              dict={{
                label: t('link url'),
                tooltip: t('Enter the link to an external website you wish to redirect to from your project page. The URL should start with \'http://\' or \'https://\'.')
              }}
            />
            <FinalField
              name={`${name}.caption`}
              control="input"
              withLabel
              optional
              dict={{
                label: t('link caption'),
                tooltip: t('Enter a name for the link.')
              }}
            />
          </div>
        )}
        addButton={props => (
          <Button
            className="bottom-btn"
            icon="plus"
            type="dashed"
            block
            {...props}
          >
            {t('Add another link')}
          </Button>
        )}
      />
    </div>
  )
}


export default Links
