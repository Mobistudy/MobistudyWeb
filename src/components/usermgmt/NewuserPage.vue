<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-lg newUserBox">
          <q-card-section>
            <div class="text-h4">User Registration</div>
            <div class="text-subtitle1">Only available to researchers</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-input
              v-model.trim="vuelidate.email.$model"
              label="Email"
              type="email"
              placeholder=" e.g. email@email.com"
              @blur="vuelidate.email.$touch"
              :error="vuelidate.email.$error"
              error-message="A valid email address is required"
            />
            <q-input
              v-model.trim="vuelidate.password.$model"
              label="Password"
              type="password"
              @blur="vuelidate.password.$touch"
              :error="vuelidate.password.$error"
              :error-message="getFirstPwdCheckError(password)"
            />
            <q-input
              v-model.trim="vuelidate.password2.$model"
              label="Repeat Password"
              type="password"
              @blur="vuelidate.password2.$touch"
              :error="vuelidate.password2.$error"
              error-message="Passwords must match"
            />
            <div class="row q-mt-md">
              <div class="col-5">
                <q-btn
                  label="Cancel"
                  color="warning"
                  @click="cancelRegistration"
                />
              </div>
              <div class="col-4">
              </div>
              <div class="col-3">
                <q-btn
                  label="Register"
                  color="primary"
                  @click="registerUser"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
.newUserBox {
  min-width: 500px;
}
</style>

<script>
import owasp from 'owasp-password-strength-test'
import zxcvbn from 'zxcvbn'
import API from '@shared/API.js'
import useVuelidate from '@vuelidate/core'
import { required, email, sameAs } from '@vuelidate/validators'

owasp.config({
  allowPassphrases: true,
  maxLength: 70,
  minLength: 8,
  minPhraseLength: 10,
  minOptionalTestsToPass: 3
})

function checkPwdStrength (pwd) {
  if (this.email) {
    // check if password includes name in email
    const i = this.email.indexOf('@')
    if (i > 0) {
      const userName = this.email.substring(0, i)
      if (pwd.toUpperCase().includes(userName.toUpperCase())) {
        return false
      }
    }
  }
  if (!owasp.test(pwd).strong) return false

  const strengthCheck = zxcvbn(pwd)
  if (strengthCheck.score < 2) return false

  return true
}

export default {
  name: 'NewUserPage',
  setup () {
    return { vuelidate: useVuelidate() }
  },
  data () {
    return {
      email: '',
      password: '',
      password2: ''
    }
  },
  validations: {
    email: { required, email },
    password: { required, checkPwdStrength },
    password2: { required, sameAsPassword: sameAs('password') }
  },
  methods: {
    getFirstPwdCheckError (pwd) {
      if (this.email) {
        // check if password includes name in email
        const i = this.email.indexOf('@')
        if (i > 0) {
          const userName = this.email.substring(0, i)
          if (pwd.toUpperCase().includes(userName.toUpperCase())) {
            return 'Password cannot contain email'
          }
        }
      }
      let result = owasp.test(pwd)
      if (!result.strong) {
        return result.errors[0]
      } else {
        result = zxcvbn(pwd)
        if (result.feedback) {
          let mesg = 'The password is too simple'
          if (result.feedback.warning) mesg = result.feedback.warning
          // uncomment this code to show also suggestions
          // if (result.feedback.suggestions && result.feedback.suggestions.length) {
          //   mesg += '.\nSuggestion: ' + result.feedback.suggestions[0]
          // }
          return mesg
        } else return 'All OK'
      }
    },
    cancelRegistration () {
      this.$router.push('/login')
    },
    async registerUser () {
      try {
        this.vuelidate.email.$touch()
        this.vuelidate.password.$touch()
        this.vuelidate.password2.$touch()
        if (this.vuelidate.email.$error || this.vuelidate.password.$error || this.vuelidate.password2.$error) {
          this.$q.notify('Please correct the indicated fields')
        } else {
          await API.createUser({
            email: this.email.toLowerCase(),
            password: this.password,
            role: 'researcher'
          })
          this.$q.dialog({
            title: 'User created',
            message: 'Your account has been created. You can now login into the system.',
            ok: true,
            cancel: false,
            preventClose: true
          }).onOk(() => {
            this.$router.push('/login')
          })
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.$q.notify({
            color: 'negative',
            message: 'User already exists',
            icon: 'report_problem'
          })
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Registration failed: ' + error.response.data ? error.response.data : error.message,
            icon: 'report_problem'
          })
        }
      }
    }
  }
}
</script>
