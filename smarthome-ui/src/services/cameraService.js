import axios from 'axios'
import * as authService from './authService.js'

function updateCamera (camera) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/cameras/' + camera.ID, camera, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function createCamera (camera) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/cameras/', camera, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function deleteCamera (camera) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.delete(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/cameras/' + camera.ID, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getAllCameras () {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/cameras/', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export { createCamera, updateCamera, deleteCamera, getAllCameras }
