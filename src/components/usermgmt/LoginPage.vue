<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-sm loginBox">
          <q-card-section>
            <div class="text-h4">Sign In</div>
          </q-card-section>
          <q-card-section>
            <form autocomplete="on">
              <q-input
                v-model.trim="vuelidate.email.$model"
                type="email"
                label="Email"
                placeholder="e.g. email@email.com"
                autocomplete="on"
                @blur="vuelidate.email.$touch"
                :error="vuelidate.email.$error"
                error-message="An email address is required."
              />
              <q-input
                v-model.trim="vuelidate.password.$model"
                type="password"
                label="Password"
                autocomplete="on"
                @blur="vuelidate.password.$touch"
                @keyup.enter="login()"
                :error="vuelidate.password.$error"
                error-message="A password is required."
              />
            </form>
          </q-card-section>
          <q-card-actions>
            <q-btn
              label="login"
              color="primary"
              @click="login()"
            />
            <q-btn
              label="New User"
              color="secondary"
              @click="newUser()"
            />
          </q-card-actions>
          <q-card-actions>
            <q-btn
              label="Reset password"
              flat
              color="primary"
              :disable="vuelidate.email.$error"
              @click="resetPassword()"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
.loginBox {
  min-width: 300px;
}
</style>

<script>
import API from '@shared/API'
import userinfo from '@shared/userinfo.js'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  name: 'LoginPage',
  setup () {
    return { vuelidate: useVuelidate() }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  methods: {
    async login () {
      this.vuelidate.email.$touch()
      this.vuelidate.password.$touch()
      if (this.vuelidate.email.$error || this.vuelidate.password.$error) {
        this.$q.notify('Please correct the indicated fields.')
      } else {
        try {
          const user = await API.login(this.email.toLowerCase(), this.password)
          API.setToken(user.token)
          userinfo.login(user)

          if (user.role === 'researcher') {
            this.$router.push('researcher')
          } else if (user.role === 'participant') {
            this.$q.notify({
              color: 'negative',
              message: 'Cannot login participants via web portal',
              icon: 'report_problem'
            })
          } else this.$router.push('admin')
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.$q.notify({
              color: 'negative',
              message: 'Cannot login, wrong credentials',
              icon: 'report_problem'
            })
          } else {
            this.$q.notify({
              color: 'negative',
              message: 'Login failed: ' + error.message,
              icon: 'report_problem'
            })
          }
        }
      }
    },
    async resetPassword () {
      try {
        if (this.email !== '') {
          await API.askPasswordResetEmail(this.email.toLowerCase())
          this.$q.dialog({
            title: 'Password reset',
            message: 'An email was sent to ' + this.email + ' with instructions about how to reset your password.',
            ok: true,
            cancel: false,
            preventClose: true
          })
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'No email specified',
            icon: 'report_problem'
          })
        }
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          message: 'Password reset failed: ' + error.message,
          icon: 'report_problem'
        })
      }
    },
    newUser () {
      this.$router.push('/newuser')
    }
  }
}
</script>
