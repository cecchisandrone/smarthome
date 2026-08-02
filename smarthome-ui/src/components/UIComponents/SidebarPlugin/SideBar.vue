<template>
  <div :class="sidebarClasses" :data-background-color="backgroundColor" :data-active-color="activeColor">
    <!--
            Tip 1: you can change the color of the sidebar's background using: data-background-color="white | black | darkblue"
            Tip 2: you can change the color of the active button using the data-active-color="primary | info | success | warning | danger"
        -->
    <!-- -->
    <div class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <a href="#" class="simple-text">
            <div class="logo-img">
                <img src="static/img/vue-logo.png" alt="">
            </div>
          SmartHome
        </a>
      </div>
      <slot>

      </slot>      
      <ul :class="navClasses">
        <!--vue-router 4 dropped `tag`, so the <li> is rendered here and the
            active class (linkActiveClass: 'active') is applied by hand from the
            slot's isActive flag, matching what vue-router 2 used to do.-->
        <router-link v-for="link in sidebarLinks" :key="link.name" :to="link.path" custom v-slot="{ href, navigate, isActive }">
          <li :class="{ active: isActive }">
            <a :href="href" v-on:click="onLinkClick($event, navigate)">
              <i :class="link.icon"></i>
              <p>{{link.name}}</p>
            </a>
          </li>
        </router-link>
      </ul>
      <moving-arrow :move-y="arrowMovePx">

      </moving-arrow>
    </div>
  </div>
</template>
<script>
  import MovingArrow from './MovingArrow.vue'
  export default {
    props: {
      type: {
        type: String,
        default: 'sidebar',
        validator: (value) => {
          let acceptedValues = ['sidebar', 'navbar']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      backgroundColor: {
        type: String,
        default: 'black',
        validator: (value) => {
          let acceptedValues = ['white', 'black', 'darkblue']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      activeColor: {
        type: String,
        default: 'success',
        validator: (value) => {
          let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      }
    },
    components: {
      MovingArrow
    },
    computed: {
      sidebarClasses () {
        if (this.type === 'sidebar') {
          return 'sidebar'
        } else {
          return 'collapse navbar-collapse off-canvas-sidebar'
        }
      },
      navClasses () {
        if (this.type === 'sidebar') {
          return 'nav'
        } else {
          return 'nav navbar-nav'
        }
      },
      /**
       * Styles to animate the arrow near the current active sidebar link
       * @returns {{transform: string}}
       */
      arrowMovePx () {
        return this.linkHeight * this.activeLinkIndex
      }
    },
    data () {
      return {
        linkHeight: 60,
        activeLinkIndex: 0,

        windowWidth: 0,
        isWindows: false,
        hasAutoHeight: false
      }
    },
    methods: {
      findActiveLink () {
        this.sidebarLinks.find((element, index) => {
          let found = element.path === this.$route.path
          if (found) {
            this.activeLinkIndex = index
          }
          return found
        })
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      /**
       * With `custom`, the slot's <a> carries a real href that the browser
       * would follow, so navigation has to be driven explicitly.
       */
      onLinkClick (event, navigate) {
        this.hideSidebar()
        navigate(event)
      }
    },
    mounted () {
      this.findActiveLink()
    },
    watch: {
      $route: function (newRoute, oldRoute) {
        this.findActiveLink()
      }
    }
  }

</script>
<style>

</style>
