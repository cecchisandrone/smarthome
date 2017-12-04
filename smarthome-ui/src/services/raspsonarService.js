import config from '../config/config.js'
import axios from 'axios'
import * as authService from './authService.js'

function getLastMeasurement () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(config.apiEndpoint + '/configurations/' + configurationId + '/raspsonar/', {headers: { Authorization: `Bearer ${user.token}` }})
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
    axios.get(config.apiEndpoint + '/configurations/' + configurationId + '/raspsonar/?scheduled=true', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {getLastMeasurement, getScheduledMeasurements}
