<template>
  <!-- <q-page class="q-pa-lg"> -->
  <q-card>
    <q-form ref="emailTesterForm">
      <q-card-section>
        <div class="text-h5">Send an email</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Email address: </div>
          <div class="col">
            <q-input type="email" v-model="emailAddress" :rules="emailRules" />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Subject: </div>
          <div class="col">
            <q-input type="text" v-model="emailSubject" :rules="[val => !!val || 'Field is required']" />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold"> Content: </div>
          <div class="col">
            <q-input type="textarea" rows="3" v-model="emailContent" :rules="[val => !!val || 'Field is required']" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn label="Send" color="primary" :loading="sending" @click="sendEmail" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import API from '@shared/API'
import { patterns } from 'quasar'
const { testPattern } = patterns

export default {
  name: 'EmailTesterCard',
  data () {
    return {
      emailAddress: '',
      emailSubject: '',
      emailContent: '',
      sending: false,
      emailRules: [
        val => !!val || 'Filed is required',
        val => testPattern.email(val) || 'Must be an email address'
      ]
    }
  },
  methods: {
    async sendEmail () {
      const valid = await this.$refs.emailTesterForm.validate(true)
      if (!valid) {
        this.$q.notify('Please correct the highlighted fields before submitting')
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
