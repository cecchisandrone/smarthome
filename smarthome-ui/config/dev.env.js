var prodEnv = require('./prod.env')

// plain flat objects of pre-stringified values, so Object.assign is enough
module.exports = Object.assign({}, prodEnv, {
  NODE_ENV: '"development"',
  API_ENDPOINT: '"http://localhost:8080/api/v1"'
})
