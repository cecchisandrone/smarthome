<template>
  <div>
      <h3>Booking</h3>
      <div class="card">
        <div class="container">
          <div class="row">
            <form class="col-md-4">
              <fg-input type="date"
                          label="Start date"
                          placeholder="dd/mm/yyyy"
                          v-model="booking.StartDate">
                  </fg-input>
                  <fg-input type="date"
                          label="End date"
                          placeholder="dd/mm/yyyy"
                          v-model="booking.EndDate">
                  </fg-input>
                  <fg-input type="text"
                          label="Email"
                          placeholder="email@domain.tld"
                          v-model="booking.Email">
                  </fg-input>
                    <fg-input :read-only="true" type="text" v-model="booking.AccessLink"></fg-input>
                </form>
          </div>
        </div>
        <button style="margin: 10px" class="btn btn-success" v-on:click="generateAccessLink">
          Generate
        </button>
      </div>
  </div>
</template>

<script>
import * as configurationService from 'src/services/configurationService.js'
import * as rentalService from 'src/services/rentalService.js'

export default {
  methods: {
    loadConfiguration: function () {
      var app = this
      configurationService.getConfiguration().then((data) => {
        app.configuration = data
      })
      .catch((err) => {
        app.errors = err.message
      })
    },
    generateAccessLink: function () {
      var app = this
      rentalService.generateAccessLink(this.booking).then((data) => {
        app.booking.AccessLink = data.link
        navigator.clipboard.writeText(this.booking.AccessLink).then(() => {
          this.$notifications.notify({message: 'Link generated and copied to the clipboard', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
        }).catch(err => {
          console.error('Failed to copy access link: ', err)
        })
      })
      .catch((err) => {
        app.errors = err.message
        this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
      })
    }
  },
  data () {
    return {
      booking: {
        StartDate: '',
        EndDate: '',
        Email: '',
        AccessLink: 'Click on generate to get the link'
      }
    }
  },
  created () {
    this.loadConfiguration()
  }
}
</script>
