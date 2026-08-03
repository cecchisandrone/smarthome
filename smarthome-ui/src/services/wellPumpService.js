import axios from 'axios'
import * as authService from './authService.js'

function updateWellPump (wellPump) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPump.ID, wellPump, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function createWellPump (wellPump) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/', wellPump, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function deleteWellPump (wellPump) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.delete(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPump.ID, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getAllWellPumps () {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getWellPumpRelay (wellPumpId) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPumpId + '/relay', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function toggleWellPumpRelay (wellPumpId, status, manuallyActivated) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/well-pumps/' + wellPumpId + '/relay', null, { params: { status, manuallyActivated }, headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export { createWellPump, updateWellPump, deleteWellPump, getAllWellPumps, toggleWellPumpRelay, getWellPumpRelay }
