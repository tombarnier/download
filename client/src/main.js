// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import child_process from 'child_process'
import { client } from '@/services'

window.cc = client

Vue.config.productionTip = false
client.authenticate().then(response => {
	this.error = null
	return client.passport.verifyJWT(response.accessToken)
})
.then(payload => {
	return client.service('users').get(payload.userId)
})
.then(user => {
	client.set('user',user)
/* eslint-disable no-new */
	new Vue({
		el: '#app',
		router,
		components: { App },
		template: '<App/>'
	})
})
.catch(() => {

	new Vue({
		el: '#app',
		router,
		components: { App },
		template: '<App/>'
	})
	router.push({ name: 'login'})
})
