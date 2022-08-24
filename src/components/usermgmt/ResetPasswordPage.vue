<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-sm loginBox">
          <q-card-section>
            <div
              class="text-h6"
              v-show="!email"
            >Reset your password</div>
            <div
              class="text-h6"
              v-show="email"
            >Reset password for {{ email }}</div>
            <form autocomplete="off">
              <q-input
                label="Token"
                :error="vuelidate.token.$error"
                error-message="A token is required."
                v-model.trim="vuelidate.token.$model"
                @blur="vuelidate.token.$touch"
                type="textarea"
              />
              <q-input
                class="q-mt-md"
                v-model.trim="vuelidate.newPassword.$model"
                type="password"
                @blur="vuelidate.newPassword.$touch"
                label="New password"
                :error="vuelidate.newPassword.$error"
                :error-message="getFirstPwdCheckError(newPassword)"
              />
              <q-input
                v-model.trim="vuelidate.newPassword2.$model"
                type="password"
                @blur="vuelidate.newPassword2.$touch"
                class="q-mt-md"
                label="Repeat new password"
                :error="vuelidate.newPassword2.$error"
                error-message="Passwords must match"
              />
            </form>
          </q-card-section>
          <q-card-actions>
            <q-btn
              label="Cancel"
              color="secondary"
              @click="$router.push('login')"
            />
            <q-btn
              label="Reset"
              color="primary"
              @click="resetUserPassword"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import PWDchecker from 'zxcvbn'
import owasp from 'owasp-password-strength-test'
import API from '@shared/API.js'
import useVuelidate from '@vuelidate/core'
import { required, sameAs } from '@vuelidate/validators'

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
  if (owasp.test(pwd).strong) {
    const strength = PWDchecker(pwd)
    return strength.score >= 2
  } else return false
}

export default {
  name: 'ResetPasswordPage',
  setup () {
    return { vuelidate: useVuelidate() }
  },
  data () {
    return {
      token: '',
      newPassword: '',
      newPassword2: ''
    }
  },
  validations: {
    token: { required },
    newPassword: { required, checkPwdStrength },
    newPassword2: { sameAsPassword: sameAs('newPassword') }
  },
  created () {
    if (this.$route.query.email) this.email = this.$route.query.email
    if (this.$route.query.token) this.token = this.$route.query.token
    console.log(this.token)
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
        result = PWDchecker(pwd)
        if (result.feedback) {
          let mesg = 'The password is too simple'
          if (result.feedback.warning) mesg = result.feedback.warning
          // if (result.feedback.suggestions && result.feedback.suggestions.length) {
          //   mesg += '.\nSuggestion: ' + result.feedback.suggestions[0]
          // }
          return mesg
        } else return 'All OK'
      }
    },
    async resetUserPassword () {
      this.vuelidate.newPassword.$touch()
      this.vuelidate.newPassword2.$touch()
      if (this.vuelidate.newPassword.$error || this.vuelidate.newPassword2.$error) {
        this.$q.notify('Please correct the indicated fields.')
      } else {
        try {
          await API.resetPassword(this.token, this.newPassword)

          this.$q.dialog({
            title: 'New password set',
            message: 'You can now login with your new password.',
            ok: true,
            cancel: false,
            preventClose: true
          })
        } catch (error) {
          const errmsg = error.response && error.response.data ? error.response.data : error.message
          this.$q.notify({
            color: 'negative',
            message: 'Cannot change password: ' + errmsg,
            icon: 'report_problem'
          })
        }
      }
    }
  }
}
</script>
