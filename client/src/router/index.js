import Vue from 'vue'
import Router from 'vue-router'
import { client } from '@/services'

import Home from '@/components/Home'
import Series from '@/components/Series'
import Serie from '@/components/Serie'
import Login from '@/components/Login'
import Logout from '@/components/Logout'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/series',
			name: 'series',
			component: Series
		},
		{
			path: '/series/:id',
			name: 'serie',
			component: Serie
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/logout',
			name: 'logout',
			component: Logout
		},
		{
			path: '/*',
			redirect: '/'
		}
	]
})

router.beforeEach((to, from, next) => {
	if (to.name !== 'login') {
		client.authenticate().then(() => {
			next()
		}).catch(() => {
			router.push({ name: 'login' })
		})
	} else {
		next()
	}
})

export default router

