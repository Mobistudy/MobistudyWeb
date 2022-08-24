<template>
  <router-view />
</template>

<script>
import user from './shared/userinfo.js'
import API from './shared/API.js'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MobistudyWeb',
  created () {
    // check if already logged in, otherwise go to login
    const resettingpwd = window.location.href.includes('resetPassword')
    if (!user.user.loggedin && !resettingpwd) {
      this.$router.push('login')
      return
    } else {
      if (!resettingpwd) API.setToken(user.user.token)
    }
    // Add a 401 response interceptor
    this.$axios.interceptors.response.use((response) => {
      return response
    }, (error) => {
      if (error.response.status === 401 && !error.config.url.includes('login')) {
        user.logout()
        this.$router.push('login')
      }
      return Promise.reject(error)
    })
  }
})
</script>
