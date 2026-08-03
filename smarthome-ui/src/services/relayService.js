import axios from 'axios'
import * as authService from './authService.js'

function updateRelay (relay) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/relays/' + relay.ID, relay, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function createRelay (relay) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/relays/', relay, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function deleteRelay (relay) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.delete(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/relays/' + relay.ID, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getAllRelays () {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/relays/', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getRelay (relayId) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/relays/' + relayId + '/relay', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function toggleRelay (relayId, status, manuallyActivated) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/relays/' + relayId + '/relay', status, { params: { manuallyActivated }, headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export { createRelay, updateRelay, deleteRelay, getAllRelays, toggleRelay, getRelay }
