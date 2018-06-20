import axios from 'axios'
import * as authService from './authService.js'

function updateWellPump (wellPump) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPump.ID, wellPump, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function createWellPump (wellPump) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/', wellPump, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function deleteWellPump (wellPump) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.delete(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPump.ID, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getAllWellPumps () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getWellPumpRelay (wellPumpId) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPumpId + '/relay', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function toggleWellPumpRelay (wellPumpId, status) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(process.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPumpId + '/relay', null, {params: {status: status}, headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {createWellPump, updateWellPump, deleteWellPump, getAllWellPumps, toggleWellPumpRelay, getWellPumpRelay}
