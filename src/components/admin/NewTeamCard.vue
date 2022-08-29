<template>
  <!-- Create New Teams -->
  <q-form ref="newTeamForm">
    <div class="q-pa-md q-gutter-sm text-center">
      <q-btn
        label="Create a New Team"
        color="primary"
        @click="promptTeamName = true"
      />

      <q-dialog
        v-model="promptTeamName"
        persistent
      >
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Team Name</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              placeholder="Enter a New Team Name"
              dense
              autofocus
              @keyup.enter="promptTeamName = false"
              v-model="teamName"
              :rules="[val => !!val || 'Field is required']"
            />
          </q-card-section>

          <q-card-actions
            align="right"
            class="text-primary"
          >
            <q-btn
              flat
              label="Cancel"
              v-close-popup
            />
            <q-btn
              flat
              label="Create Team"
              v-close-popup
              @click="createTeam()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-form>
</template>

<script>
import API from '@shared/API'

export default {
  name: 'NewTeamCard',
  data () {
    return {
      teamName: '',
      promptTeamName: false
    }
  },
  methods: {
    async createTeam () {
      const valid = await this.$refs.newTeamForm.validate(true)
      if (!valid) {
        this.$q.notify('Please correct the highlighted fields before submitting')
      } else {
        this.$q.dialog({
          title: 'Create Team',
          color: 'primary',
          message: 'You are creating a new team named "' + this.teamName + '". Would you like to continue?',
          ok: 'Yes, create new team',
          cancel: 'Back'
        }).onOk(async () => {
          try {
            await API.createTeam(this.teamName)
            this.$q.notify({
              color: 'positive',
              message: 'Team ' + this.teamName + ' created!'
            })
            this.teamName = ''
            this.$emit('newTeam', this.teamName)
          } catch (err) {
            if (err.response && err.response.status === 409) {
              this.$q.notify({
                color: 'negative',
                message: 'A team with the same name: ' + this.teamName + ' already exists.',
                icon: 'report_problem'
              })
            } else {
              this.$q.notify({
                color: 'negative',
                message: 'Cannot create team ' + this.teamName,
                icon: 'report_problem'
              })
            }
          }
        }).onCancel(async () => {
          this.promptTeamName = true
        })
      }
    }
  }
}
</script>
