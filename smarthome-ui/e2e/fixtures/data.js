/**
 * Fixture payloads for the mocked smarthome-server API.
 *
 * Shapes are taken from the real Go server in ../smarthome-server:
 *   - entities embed gorm.Model, so they serialise with ID/CreatedAt/UpdatedAt/DeletedAt
 *     and PascalCase field names (model/*.go)
 *   - measurement endpoints return {timestamp, value} (controller/temperature.go et al)
 *   - scheduled endpoints return map[time.Time]float64, i.e. an object keyed by RFC3339
 *   - inverter metrics use snake_case json tags (service/inverter.go InverterMetrics)
 *
 * Every factory returns a fresh deep copy so a test can mutate state freely.
 */

const CONFIGURATION_ID = 1

// Fixed so assertions on rendered timestamps stay deterministic.
const NOW = '2026-08-02T10:00:00Z'
const CREATED_AT = '2020-02-28T12:00:00Z'

// checkAuth() in src/services/authService.js compares this against Date.now(),
// so it has to stay comfortably in the future for the whole test run.
const TOKEN_EXPIRY = '2099-01-01T00:00:00Z'

const CREDENTIALS = { username: 'admin', password: 'secret' }

const AUTH_USER = {
  code: 200,
  expire: TOKEN_EXPIRY,
  token: 'mock-jwt-token',
  // merged in from GET /auth/ claims by authService.login()
  configurationId: CONFIGURATION_ID,
  id: CREDENTIALS.username
}

const AUTH_CLAIMS = {
  configurationId: CONFIGURATION_ID,
  id: CREDENTIALS.username,
  exp: 4102444800,
  orig_iat: 1754128800
}

function gormModel (id) {
  return { ID: id, CreatedAt: CREATED_AT, UpdatedAt: CREATED_AT, DeletedAt: null }
}

function makeCameras () {
  return [
    {
      ...gormModel(1),
      Name: 'Front',
      Type: 'foscam',
      Host: '192.168.1.20',
      Port: 88,
      // External by design: the mock aborts non-app hosts, which exercises the
      // onerror fallback in CameraView.vue.
      Url: 'http://camera-front.invalid/snapshot.jpg',
      Username: 'viewer',
      Password: 'viewer',
      Enabled: true,
      AlarmEnabled: true,
      ConfigurationID: CONFIGURATION_ID
    },
    {
      ...gormModel(2),
      // Deliberately not 'Garden': that name belongs to a relay, and the
      // configuration page renders camera and relay tables side by side.
      Name: 'Backyard',
      Type: 'iframe',
      Host: '192.168.1.21',
      Port: 80,
      Url: 'http://camera-garden.invalid/stream',
      Username: '',
      Password: '',
      Enabled: true,
      AlarmEnabled: false,
      ConfigurationID: CONFIGURATION_ID
    },
    {
      ...gormModel(3),
      Name: 'Disabled',
      Type: 'foscam',
      Host: '192.168.1.22',
      Port: 88,
      Url: 'http://camera-disabled.invalid/snapshot.jpg',
      Username: '',
      Password: '',
      Enabled: false,
      AlarmEnabled: false,
      ConfigurationID: CONFIGURATION_ID
    }
  ]
}

function makeRelays () {
  return [
    {
      ...gormModel(1),
      Name: 'Garden',
      Host: '192.168.1.30',
      Port: 8080,
      Channels: 2,
      ActivationIntervals: '08:00-09:00',
      AutomaticActivationEnabled: true,
      ManuallyActivated: false,
      ConfigurationID: CONFIGURATION_ID
    },
    {
      ...gormModel(2),
      Name: 'Lights',
      Host: '192.168.1.31',
      Port: 8080,
      Channels: 1,
      ActivationIntervals: '',
      AutomaticActivationEnabled: false,
      ManuallyActivated: false,
      ConfigurationID: CONFIGURATION_ID
    }
  ]
}

function makeWellPumps () {
  return [
    {
      ...gormModel(1),
      Name: 'Well',
      Host: '192.168.1.40',
      Port: 8080,
      ActivationIntervals: '06:00-07:00',
      AutomaticActivationEnabled: false,
      ManuallyActivated: false,
      RainfallThreshold: 5,
      ConfigurationID: CONFIGURATION_ID
    }
  ]
}

function makeInverters () {
  return [
    {
      ...gormModel(1),
      Name: 'Roof',
      Host: '192.168.1.50',
      Port: 8080,
      ConfigurationID: CONFIGURATION_ID
    }
  ]
}

function makeInverterMetrics () {
  return {
    power_pin_1: 1234.5,
    power_pin_2: 987.25,
    grid_power_reading: 2221.75,
    riso: 12.5,
    inverter_temperature: 42.125,
    booster_temperature: 38.5,
    dc_ac_conversion_efficiency: 96.75,
    daily_energy: 12.5,
    weekly_energy: 88.25,
    monthly_energy: 345.5,
    yearly_energy: 4210.75,
    power_peak: 3200,
    power_peak_today: 2800.5
  }
}

function makeConfiguration () {
  return {
    ...gormModel(CONFIGURATION_ID),
    Name: 'Home',
    Profile: {
      ...gormModel(1),
      FirstName: 'Test',
      LastName: 'User',
      Password: '',
      Username: CREDENTIALS.username,
      ConfigurationID: CONFIGURATION_ID
    },
    Gate: { ...gormModel(1), Host: '192.168.1.10', Port: 8080, Duration: 1.5, ConfigurationID: CONFIGURATION_ID },
    Raspsonar: {
      ...gormModel(1),
      Host: '192.168.1.11',
      Port: 8080,
      SonarName: 'sonar-1',
      RelayName: 'relay-1',
      DistanceThreshold: 30,
      AutoPowerOffDistanceThreshold: 10,
      ConfigurationID: CONFIGURATION_ID
    },
    Temperature: { ...gormModel(1), Host: '192.168.1.12', Port: 8080, ConfigurationID: CONFIGURATION_ID },
    Slack: {
      ...gormModel(1),
      NotificationChannel: '#smarthome',
      LocationChangeChannel: '#location',
      Token: 'xoxb-test-token',
      LocationChangeUsers: 'alice;bob',
      ConfigurationID: CONFIGURATION_ID
    },
    Alarm: { ...gormModel(1), AutomaticAlarmActivation: false, ConfigurationID: CONFIGURATION_ID },
    Cameras: makeCameras(),
    WellPumps: makeWellPumps(),
    RainGauge: { ...gormModel(1), Host: '192.168.1.13', Port: 8080, ConfigurationID: CONFIGURATION_ID },
    Humidity: { ...gormModel(1), Host: '192.168.1.14', Port: 8080, ConfigurationID: CONFIGURATION_ID },
    Heater: { ...gormModel(1), Host: '192.168.1.15', Port: 8080, ConfigurationID: CONFIGURATION_ID },
    Inverters: makeInverters(),
    PowerMeter: {
      ...gormModel(1),
      Host: '192.168.1.16',
      Port: 8080,
      Voltage: 230,
      AdjustmentFactor: 1,
      ConfigurationID: CONFIGURATION_ID
    },
    Relays: makeRelays(),
    Rental: { ...gormModel(1), Url: 'http://rental.invalid/booking', ConfigurationID: CONFIGURATION_ID }
  }
}

/** Six points, two hours apart, ending at NOW - matches the server's map[time]value shape. */
function makeScheduledMeasurements (values) {
  const end = new Date(NOW).getTime()
  const twoHours = 2 * 60 * 60 * 1000
  const out = {}
  values.forEach((value, index) => {
    const at = new Date(end - (values.length - 1 - index) * twoHours)
    out[at.toISOString()] = value
  })
  return out
}

const MEASUREMENTS = {
  temperature: { last: 21.53, scheduled: [18.1, 19.4, 20.2, 21.0, 21.4, 21.53] },
  humidity: { last: 63.25, scheduled: [70.0, 68.5, 66.2, 65.1, 64.0, 63.25] },
  heater: { last: 54.75, scheduled: [50.0, 51.2, 52.4, 53.1, 54.0, 54.75] },
  power: { last: -430.5, scheduled: [-120.0, -300.5, -410.2, -450.0, -440.1, -430.5] },
  'rain-gauge': { last: 3.4, scheduled: [0.0, 0.2, 1.1, 2.0, 2.8, 3.4] },
  raspsonar: { last: 12.75, scheduled: [20.0, 18.5, 16.2, 14.8, 13.5, 12.75] }
}

module.exports = {
  CONFIGURATION_ID,
  NOW,
  TOKEN_EXPIRY,
  CREDENTIALS,
  AUTH_USER,
  AUTH_CLAIMS,
  MEASUREMENTS,
  makeConfiguration,
  makeCameras,
  makeRelays,
  makeWellPumps,
  makeInverters,
  makeInverterMetrics,
  makeScheduledMeasurements
}
