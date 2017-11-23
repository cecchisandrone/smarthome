import config from '../../config/config.js'
import axios from 'axios'

function login (username, password) {
  return new Promise(function (resolve, reject) {
    var user = { 'username': username, 'password': password }
    axios.post(config.apiEndpoint + '/auth', user)
      .then(function (res) {
        window.localStorage.setItem('smarthomeUser', JSON.stringify(res))
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err.response.data)
      })
  })
}

// eslint-disable-next-line
function renewToken (token) {
  return new Promise(function (resolve, reject) {
    axios.put(config.apiEndpoint + '/auth', {headers: { Authorization: `Bearer ${token}` }})
      .then(function (res) {
        window.localStorage.setItem('smarthomeUser', JSON.stringify(res))
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err.response.data)
      })
  })
}

function checkAuth () {
  var token = JSON.parse(window.localStorage.getItem('smarthomeUser'))
  if (token != null) {
    var tokenExpiration = new Date(token.expire)
    if (tokenExpiration < Date.now()) {
      // Token is expired
      window.localStorage.removeItem('smarthomeUser')
      return false
    } else {
      return true
    }
  }
  return false
}

export { login, checkAuth }
