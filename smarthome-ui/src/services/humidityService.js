import axios from 'axios'
import * as authService from './authService.js'

function getLastMeasurement () {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/humidity/', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getScheduledMeasurements () {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/humidity/?scheduled=true', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export { getLastMeasurement, getScheduledMeasurements }
