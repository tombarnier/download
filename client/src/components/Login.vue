
<template>
<div id="form" class="ui form" v-bind:class="{ error: error }">
  <div class="ui error message" v-if="error">
    <div class="header">Error</div>
    <p>{{ error.message }}</p>
  </div>
  <div class="field ui icon">
    <label>Email</label>
    <div class="ui left icon input">
      <i class="icon user"></i>
      <input id="email" type="text" placeholder="Email" v-on:keypress.enter="login">
    </div>
  </div>
  <div class="field ui icon">
    <label>Password</label>
    <div class="ui left icon input">
      <i class="icon lock"></i>
      <input id="password" type="password" placeholder="Password" v-on:keypress.enter="login">
    </div>
  </div>
  <div class="ui submit button" v-on:click="login">Submit</div>
</div>
</template>

<script>
import router from '@/router'
import {
  client
} from '@/services'

export default {
  name: 'login',
  data() {
    return {
      email: null,
      password: null,
      error: null
    }
  },
  mounted() {
    this.email = document.getElementById('email')
    this.password = document.getElementById('password')
  },
  methods: {
    login() {
      client.authenticate({
          strategy: 'local',
          email: this.email.value,
          password: this.password.value
        })
        .then(response => {
          this.error = null
          return client.passport.verifyJWT(response.accessToken)
        })
        .then(payload => {
          return client.service('users').get(payload.userId)
        })
        .then(user => {
          client.set('user', user)
          router.push({
            name: 'home'
          })
        })
        .catch((e) => {
          console.log(e)
          this.error = e
          this.email.value = this.password.value = ''
          this.email.focus()
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (client.get('user')) {
      next({
        name: 'home'
      })
    }
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
  width: 100%;
  max-width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
