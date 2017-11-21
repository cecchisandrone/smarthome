import config from '../../config/config.js'
import axios from 'axios'

function login (username, password) {
  return new Promise(function (resolve, reject) {
    var user = { 'username': username, 'password': password }
    axios.post(config.apiEndpoint + '/auth', user)
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err.response.data)
      })
  })
}

function checkAuth () {
  var token = JSON.parse(window.localStorage.getItem('smarthomeUser'))
  if (token == null) {
    return false
  }
  return true
}

export { login, checkAuth }
