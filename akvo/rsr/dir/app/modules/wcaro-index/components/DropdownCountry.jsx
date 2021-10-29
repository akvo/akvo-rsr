import React from 'react'
import { Dropdown, Menu, Checkbox, Button, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import ac from '../../../utils/countries.json'

export const DropdownCountry = ({
  onCountry,
  countries,
  selected,
  country = null,
  disabled = false,
  ...props
}) => {
  const { t } = useTranslation()
  let items = ac
    .map((i) => ({ ...i, code: i.code.toLowerCase() }))
    .filter((i) => countries.map((c) => c.toLowerCase()).includes(i.code))
  if (!selected && countries.length > 1) items = [{ name: t('All Countries'), code: 'all' }, ...items]
  const mprops = ((selected) || (!selected && items.length === 1)) ? { id: 'menu-country' } : { id: 'menu-country', onClick: ({ key }) => onCountry(key) }
  let label = country ? country.name : t('All Countries')
  label = items.length === 1 ? items[0].name : (selected && selected.length) ? `${selected.length} Countries` : label
  return (
    <Dropdown
      disabled={disabled}
      trigger={['click']}
      overlay={(
        <Menu {...mprops}>
          {items && items.map(item => (
            <Menu.Item value={item.code} key={item.code}>
              {selected && (
                <Checkbox
                  {...{
                    checked: (Object.keys(selected.find((s) => s === item.code) || {}).length),
                    onChange: (e) => onCountry(item.code, e.target.checked)
                  }}
                />
              )}
              &nbsp;{item.name}
            </Menu.Item>
          ))}
        </Menu>
      )}
    >
      <Button className="ant-dropdown-link" {...props}>
        <Icon type="down" />&nbsp;{label}
      </Button>
    </Dropdown>
  )
}
