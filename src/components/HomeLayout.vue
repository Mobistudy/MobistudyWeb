<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >

        <q-toolbar-title>
          <img
            square
            src="logos/mobistudy-white.svg"
            style="max-width: 130px"
          >
        </q-toolbar-title>
        <span class="gt-xs q-mr-lg text-blue-grey-2"> {{ loggedInAsUserLabel }}</span>
        <q-btn
          label="LOGOUT"
          flat
          dense
          icon-right="exit_to_app"
          @click="confirm = true"
        />
        <q-dialog
          v-model="confirm"
          persistent
        >
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                icon="warning"
                color="negative"
                text-color="white"
                size="lg"
              />
              <span class="q-ml-sm">Are you sure you want to logout?</span>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancel"
                color="primary"
                v-close-popup
              />
              <q-btn
                flat
                label="Logout"
                color="primary"
                v-close-popup
                @click="logout()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-toolbar>

    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import API from '@shared/API'
import userinfo from '@shared/userinfo'
const appVersion = require('../../package.json').version

export default {
  name: 'HomeLayout',
  data () {
    return {
      version: appVersion,
      confirm: false
    }
  },
  computed: {
    welcomeLabel () {
      return 'Hello ' + userinfo.user.email + '. You are logged in as ' + userinfo.user.role + '.'
    },
    loggedInAsUserLabel () {
      return userinfo.user.email
    }
  },
  methods: {
    async logout () {
      await userinfo.logout()
      API.setToken('')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.q-avatar {
  margin: 0px 0px 5px 0px;
}
</style>
