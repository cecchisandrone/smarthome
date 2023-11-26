import axios from 'axios'
import * as authService from './authService.js'

function getLastMeasurement () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.VUE_APP_API_ENDPOINT + '/configurations/' + configurationId + '/heater/', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getScheduledMeasurements () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.VUE_APP_API_ENDPOINT + '/configurations/' + configurationId + '/heater/?scheduled=true', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {getLastMeasurement, getScheduledMeasurements}
