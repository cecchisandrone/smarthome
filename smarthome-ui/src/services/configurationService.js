import axios from 'axios'
import * as authService from './authService.js'

function getConfiguration () {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function saveConfiguration (configuration) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId, configuration, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export { getConfiguration, saveConfiguration }
