<template>
  <!-- <q-page class="q-pa-lg"> -->
  <q-card>
    <q-card-section>
      <div class="text-h5">Send email from server</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-ma-sm">
        <div class="col-2 text-bold">Email address: </div>
        <div class="col">
          <q-input
            type="email"
            v-model="emailAddress"
            :error="vuelidate.emailAddress.$error"
            error-message="An valid email address is required"
            @blur="vuelidate.emailAddress.$touch"
          />
        </div>
      </div>
      <div class="row q-ma-sm">
        <div class="col-2 text-bold">Subject: </div>
        <div class="col">
          <q-input
            type="text"
            v-model="emailSubject"
            :error="vuelidate.emailSubject.$error"
            error-message="An subject is required"
            @blur="vuelidate.emailSubject.$touch"
          />
        </div>
      </div>
      <div class="row q-ma-sm">
        <div class="col-2 text-bold"> Content: </div>
        <div class="col">
          <q-input
            type="textarea"
            rows="3"
            v-model="emailContent"
            :error="vuelidate.emailContent.$error"
            error-message="Some content is required"
            @blur="vuelidate.emailContent.$touch"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn
        label="Send"
        color="primary"
        :loading="sending"
        @click="sendEmail"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import API from '@shared/API'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  name: 'EmailTesterCard',
  setup () {
    return { vuelidate: useVuelidate() }
  },
  data () {
    return {
      emailAddress: '',
      emailSubject: '',
      emailContent: '',
      sending: false
    }
  },
  validations: {
    emailAddress: { required, email },
    emailSubject: { required },
    emailContent: { required }
  },
  methods: {
    async sendEmail () {
      this.vuelidate.emailAddress.$touch()
      this.vuelidate.emailContent.$touch()
      this.vuelidate.emailSubject.$touch()
      if (this.vuelidate.emailAddress.$error || this.vuelidate.emailSubject.$error || this.vuelidate.emailContent.$error) {
        this.$q.notify('Please correct the indicated fields.')
      } else {
        this.sending = true

        try {
          await API.sendTestEmail(this.emailAddress, this.emailSubject, this.emailContent)
          this.$q.notify({
            color: 'positive',
            message: 'Email sent'
          })
        } catch (error) {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot send email: ' + error.message,
            icon: 'report_problem'
          })
        }
        this.sending = false
      }
    }
  }
}
</script>
