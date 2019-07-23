const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const exec = require('child_process').exec

exec('i18next-scanner', (err) => {
  if (err) {
    console.log(err)
  }
  // console.log('read')
  const content = fs.readFileSync('scanned-locales.json')
  const jsonContent = JSON.parse(content)
  // console.log(jsonContent)

  const newContent = []

  axios.get('http://localhost/en/translations.json')
    .then((resp) => {
      // console.log(resp)
      Object.keys(jsonContent).forEach(key => {
        if (resp.data.hasOwnProperty(key) === false && key.indexOf('section') !== 0) {
          newContent.push(`"${key}": _("${key}")`)
        }
      })
      fs.writeFileSync('strings.py', newContent.join(',\n'))
    })

})
