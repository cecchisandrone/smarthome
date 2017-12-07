import axios from 'axios'
import * as authService from './authService.js'

function open () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/gate/open', null, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {open}
