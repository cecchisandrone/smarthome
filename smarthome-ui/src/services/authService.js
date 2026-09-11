import axios from 'axios'

function login (username, password) {
  return new Promise(function (resolve, reject) {
    const user = { username, password }
    axios.post(import.meta.env.API_ENDPOINT + '/auth', user)
      .then((response1) => {
        axios.get(import.meta.env.API_ENDPOINT + '/auth/', { headers: { Authorization: `Bearer ${response1.data.token}` } })
          .then((response2) => {
            const userData = Object.assign(response1.data, response2.data.claims)
            window.localStorage.setItem('smarthomeUser', JSON.stringify(userData))
            resolve(userData)
          })
          .catch((err) => {
            reject(err)
          })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// eslint-disable-next-line
function renewToken (token) {
  return new Promise(function (resolve, reject) {
    axios.put(import.meta.env.API_ENDPOINT + '/auth', { headers: { Authorization: `Bearer ${token}` } })
      .then(function (res) {
        window.localStorage.setItem('smarthomeUser', JSON.stringify(res.data))
        resolve(res.data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function checkAuth () {
  const token = getCurrentUser()
  if (token != null) {
    const tokenExpiration = new Date(token.expire)
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

function getCurrentUser () {
  const user = window.localStorage.getItem('smarthomeUser')
  if (user != null) {
    return JSON.parse(user)
  } else {
    return null
  }
}

export { login, checkAuth, getCurrentUser }
