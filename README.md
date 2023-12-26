# Smarthome
SmartHome is a web application to manage several IoT devices, sensors and appliances. In particular it includes:
- Gate opener
- Thermometer sensor
- Humidity sensor
- Water pump
- Rain gauge
- PV inverter metrics
- AC Power meter
- IP cameras
- Generic relays

**Build status:** [![CircleCI](https://circleci.com/gh/cecchisandrone/smarthome.svg?style=svg)](https://circleci.com/gh/cecchisandrone/smarthome)

# UI module
The UI module is written in Vue.js and it is based on [Paper-dashboard](https://www.creative-tim.com/product/paper-dashboard). It is exposed using nginx server.

# Server module
The server module is written in golang and it is exposing the REST APIs used by the UI.

# Prometheus
The Prometheus module allows to monitor the entire IoT network appliances, including sensors and network devices. If any device is down, Slack notifications are sent.

# Grafana + InfluxDB
The metrics visualization is implemented using Grafana as UI and InfluxDB as time series storage.

# How to run the project
The project runs entirely on Docker. Use the following command:

```
docker compose -f docker-compose.yml up -d
```

# Screenshots
![smarthome-ui](https://github.com/cecchisandrone/smarthome/blob/master/doc/img/dashboard.png "Dashboard")

![smarthome-ui](https://github.com/cecchisandrone/smarthome/blob/master/doc/img/camera.png "Cameras")

![smarthome-ui](https://github.com/cecchisandrone/smarthome/blob/master/doc/img/metrics.png "Metrics")

# Code Guidelines
Please adhere to the following guidelines while contributing:

- Follow the coding style, conventions, and patterns used in the project.
- Write descriptive commit messages.
- Keep PRs focused and specific to a single issue or feature.

# Issue and Pull Request Labels
I use labels to help categorize and prioritize issues and pull requests. Here are some labels you might encounter:

- Bug: Issues related to bugs.

- Feature Request: Suggestions for new features or enhancements.

- Good First Issue: Issues suitable for newcomers or beginners.

- Help Wanted: Additional assistance is needed in resolving these issues.

# Code of Conduct
Please review and adhere to the [Code of Conduct](https://opensource.com/code-of-conduct) in all interactions and contributions within this project.

# License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/cecchisandrone/smarthome/blob/master/LICENSE.txt) file for details.

