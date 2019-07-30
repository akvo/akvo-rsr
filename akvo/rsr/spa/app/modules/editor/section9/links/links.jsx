import React from 'react'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form

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
            <Item label={<InputLabel tooltip={t('Enter the link to an external website you wish to redirect to from your project page. The URL should start with \'http://\' or \'https://\'.')}>{t('link url')}</InputLabel>}>
              <FinalField
                name={`${name}.url`}
                control="input"
              />
            </Item>
            <Item label={<InputLabel optional tooltip={t('Enter a name for the link.')}>{t('link caption')}</InputLabel>}>
              <FinalField
                name={`${name}.caption`}
                control="input"
              />
            </Item>
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
