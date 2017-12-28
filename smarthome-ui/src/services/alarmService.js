import axios from 'axios'
import * as authService from './authService.js'

function toggleAlarm (status) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/alarm/', null, {params: {status: status ? 1 : 0}, headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getAlarmStatus () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/alarm/', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {toggleAlarm, getAlarmStatus}
