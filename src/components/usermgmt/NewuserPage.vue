<template>
  <q-layout>
    <q-page-container>
      <q-form ref="newuserForm">
        <q-page class="flex flex-center">
          <q-card class="q-pa-lg newUserBox">
            <q-card-section>
              <div class="text-h4">User Registration</div>
              <div class="text-subtitle1">Only available to researchers</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input v-model.trim="email" label="Email" type="email" placeholder=" e.g. email@email.com"
                :rules="emailRules" />
              <q-input v-model.trim="password" label="Password" type="password" :rules="passwordRules" />
              <q-input v-model.trim="password2" label="Repeat Password" type="password" :rules="password2Rules" />
              <div class="row q-mt-md">
                <div class="col-5">
                  <q-btn label="Cancel" color="warning" @click="cancelRegistration" />
                </div>
                <div class="col-4">
                </div>
                <div class="col-3">
                  <q-btn label="Register" color="primary" :loading="registering" @click="registerUser" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-form>
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
import { patterns } from 'quasar'
const { testPattern } = patterns

owasp.config({
  allowPassphrases: true,
  maxLength: 70,
  minLength: 8,
  minPhraseLength: 10,
  minOptionalTestsToPass: 3
})

export default {
  name: 'NewUserPage',
  data () {
    return {
      email: '',
      password: '',
      password2: '',
      registering: false,
      emailRules: [
        val => !!val || 'Filed is required',
        val => testPattern.email(val) || 'Must be an email address'
      ],
      passwordRules: [
        val => !!val || 'Filed is required',
        this.validatePasswordStrength
      ],
      password2Rules: [
        val => !!val || 'Filed is required',
        val => val === this.password || 'Passwords do not match'
      ]
    }
  },
  methods: {
    validatePasswordStrength (pwd) {
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
        if (result.feedback && result.feedback.warning !== '') {
          let mesg = 'The password is too simple'
          if (result.feedback.warning) mesg = result.feedback.warning
          // uncomment this code to show also suggestions
          // if (result.feedback.suggestions && result.feedback.suggestions.length) {
          //   mesg += '.\nSuggestion: ' + result.feedback.suggestions[0]
          // }
          return mesg
        } else return true
      }
    },
    cancelRegistration () {
      this.$router.push('/login')
    },
    async registerUser () {
      const valid = await this.$refs.newuserForm.validate(true)
      if (!valid) {
        this.$q.notify('Please correct the highlighted fields')
      } else {
        this.registering = true
        try {
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
        this.registering = false
      }
    }
  }
}
</script>
