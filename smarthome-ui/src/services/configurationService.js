import axios from 'axios'
import * as authService from './authService.js'

function getConfiguration () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function saveConfiguration (configuration) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(process.env.API_ENDPOINT + '/configurations/' + configurationId, configuration, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {getConfiguration, saveConfiguration}
