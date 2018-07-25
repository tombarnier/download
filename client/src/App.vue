<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
import { client } from '@/services'
export default {
	name: 'App',
	data () {
		return {
			user: null
		}
	},
	created () {
		client.on('authenticated', () => {
			this.user = client.get('user')
		})
		client.on('logout', () => {
			this.user = null
		})
		client.authenticate()
		.then(response => {
			console.log("authentication in progress")
			return client.passport.verifyJWT(response.accessToken)
		})
		.then(payload => {
			console.log("authentication in progress")
			return client.service('users').get(payload.userID)
		})
		.then(user => {
			console.log("authentication in progress")
			client.set('user', user)
		})
		.catch((e) => {
			console.log(e)
		})
	}
}
</script>

<style>
	.ui.breadcrumb {
    margin-bottom: 70px !important;
  }
  .ui.grid>.ui.breadcrumb {
    padding-top: 1rem;
  }
  button.ui.button.hidden {
    display: none;
  }
  .scan .ui.button {
    margin-bottom: 10px;
  }
</style>
