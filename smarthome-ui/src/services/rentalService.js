import axios from 'axios'
import * as authService from './authService.js'

function generateAccessLink (booking) {
  const user = authService.getCurrentUser()
  const configurationId = user.configurationId
  return new Promise(function (resolve, reject) {
    axios.post(import.meta.env.API_ENDPOINT + '/configurations/' + configurationId + '/rental/generate-access-link', booking, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(function (res) {
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export { generateAccessLink }
