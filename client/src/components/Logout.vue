<template></template>

<script>
import router from '@/router'
import { client } from '@/services'
export default {
  name: 'logout',
  beforeRouteEnter (to, from, next) {
    client.logout()
    client.set('user', null)
    router.push({ name: 'login' })
  }
}
</script>

