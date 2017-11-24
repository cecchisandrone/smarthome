import config from '../config/config.js'
import axios from 'axios'

function getConfiguration (configurationId) {
    return new Promise(function (resolve, reject) {
      axios.get(config.apiEndpoint + '/auth', {headers: { Authorization: `Bearer ${token}` }})
        .then(function (res) {
          window.localStorage.setItem('smarthomeUser', JSON.stringify(res))
          resolve(res.data)
        })
        .catch(function (err) {
          reject(err.response.data)
        })
    })
  }