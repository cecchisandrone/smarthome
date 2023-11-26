import axios from 'axios'
import * as authService from './authService.js'

function updateCamera (camera) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.put(process.env.VUE_APP_API_ENDPOINT + '/configurations/' + configurationId + '/cameras/' + camera.ID, camera, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function createCamera (camera) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(process.env.VUE_APP_API_ENDPOINT + '/configurations/' + configurationId + '/cameras/', camera, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function deleteCamera (camera) {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.delete(process.env.VUE_APP_API_ENDPOINT + '/configurations/' + configurationId + '/cameras/' + camera.ID, {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function getAllCameras () {
  var user = authService.getCurrentUser()
  var configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.get(process.env.VUE_APP_API_ENDPOINT + '/configurations/' + configurationId + '/cameras/', {headers: { Authorization: `Bearer ${user.token}` }})
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export {createCamera, updateCamera, deleteCamera, getAllCameras}
