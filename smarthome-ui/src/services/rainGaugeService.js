import axios from 'axios'
import * as authService from './authService.js'

function getLast24hTotal () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/rain-gauge/', {headers: { Authorization: `Bearer ${user.token}` }})
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
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/rain-gauge/?scheduled=true', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {getLast24hTotal, getScheduledMeasurements}
