<template>
  <q-layout>
    <q-page-container>
      <q-form ref="resetPwdForm">
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
                  v-model.trim="token"
                  type="textarea"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  class="q-mt-md"
                  v-model.trim="newPassword"
                  type="password"
                  label="New password"
                  :rules="passwordRules"
                />
                <q-input
                  v-model.trim="newPassword2"
                  type="password"
                  class="q-mt-md"
                  label="Repeat new password"
                  :rules="password2Rules"
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
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<script>
import zxcvbn from 'zxcvbn'
import owasp from 'owasp-password-strength-test'
import API from '@shared/API.js'

owasp.config({
  allowPassphrases: true,
  maxLength: 70,
  minLength: 8,
  minPhraseLength: 10,
  minOptionalTestsToPass: 3
})

export default {
  name: 'ResetPasswordPage',
  data () {
    return {
      email: '',
      token: '',
      newPassword: '',
      newPassword2: '',
      passwordRules: [
        val => !!val || 'Filed is required',
        this.validatePasswordStrength
      ],
      password2Rules: [
        val => !!val || 'Filed is required',
        val => val === this.newPassword || 'Passwords do not match'
      ]
    }
  },
  created () {
    if (this.$route.query.email) this.email = this.$route.query.email
    if (this.$route.query.token) this.token = this.$route.query.token
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
    async resetUserPassword () {
      const valid = await this.$refs.resetPwdForm.validate(true)
      if (!valid) {
        this.$q.notify('Please correct the highlighted fields')
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
