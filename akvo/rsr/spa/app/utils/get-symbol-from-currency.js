import currencySymbolMap from 'currency-symbol-map/map'

export default function getSymbolFromCurrency(currencyCode) {
  if (typeof currencyCode !== 'string') return ''
  if (!currencySymbolMap.hasOwnProperty(currencyCode)) return currencyCode
  return currencySymbolMap[currencyCode]
}
