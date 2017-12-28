import axios from 'axios'
import * as authService from './authService.js'

function getLastMeasurement () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/raspsonar/', {headers: { Authorization: `Bearer ${user.token}` }})
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
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/raspsonar/?scheduled=true', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function toggleRelay (status) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/raspsonar/relay', null, {params: {relayStatus: status ? 1 : 0}, headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getRelayStatus () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/raspsonar/relay', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {getLastMeasurement, getScheduledMeasurements, toggleRelay, getRelayStatus}
