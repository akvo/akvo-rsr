const fs = require('fs')

const path = 'extractedTranslations/en/translation.json'
const content = fs.readFileSync(path)

const jsonContent = JSON.parse(content)

const newContent = []

Object.keys(jsonContent).forEach(key => {
  newContent.push(`"${key}": _("${key}")`)
})

fs.writeFileSync('translations-preset.py', newContent.join(',\n'))
