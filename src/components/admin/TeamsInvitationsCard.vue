<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">Teams &amp; Invitation Codes</div>
    </q-card-section>
    <q-card-section>
      <div
        v-for="(team, index) in teams"
        :key="index"
        class="q-mt-sm"
      >
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Team Name: </div>
          <div class="col">{{team.name}}</div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Team Key: </div>
          <div class="col">{{team._key}}</div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Code: </div>
          <div class="col">
            <q-input
              type="textarea"
              autogrow
              :error="codeExpired[index]"
              error-message="This invitation code has EXPIRED"
              :value="team.invitationCode"
              ref="invCode"
              readonly
            />
          </div>
          <div class="q-ml-sm">
            <q-btn
              color="primary"
              round
              sm
              icon="file_copy"
              @click="copyCode(index)"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Expiry date: </div>
          <div class="col">
            {{ niceDate(team.invitationExpiry) }}
          </div>
        </div>
        <div class="row q-mt-sm justify-between">
          <q-btn
            label="Generate new invitation code"
            color="accent"
            icon="add"
            @click="generateCode(team._key)"
          />
          <q-btn
            class="float-right"
            label="Delete team"
            color="negative"
            icon="remove"
            @click="deleteTeam(index)"
          />
        </div>
        <q-separator
          v-if="index != teams.length-1"
          class="q-mt-md"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import API from '@shared/API'
import { date } from 'quasar'

export default {
  name: 'TeamsInvitationsCard',
  data () {
    return {
      teams: []
    }
  },
  computed: {
    codeExpired () {
      const expired = []
      for (let i = 0; i < this.teams.length; i++) {
        const invitationExpiry = this.teams[i].invitationExpiry
        // See if invitation date has expired
        if (Date.now() > new Date(invitationExpiry)) {
          expired.push(true)
        } else {
          expired.push(false)
        }
      }
      return expired
    }
  },
  created () {
    this.getTeams()
  },
  methods: {
    async getTeams () {
      try {
        this.teams = await API.getTeams()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve teams list',
          icon: 'report_problem'
        })
      }
    },
    niceDate (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY/MM/DD')
    },
    async generateCode (key) {
      try {
        await API.generateTeamCode(key)
        this.getTeams()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot generate invitation code',
          icon: 'report_problem'
        })
      }
    },
    copyCode (index) {
      try {
        this.$refs.invCode[index].select()
        document.execCommand('copy')
        window.getSelection().removeAllRanges()
        this.$q.notify({
          color: 'primary',
          position: 'bottom',
          message: 'Invitation code copied to clipboard'
        })
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot copy invitation code',
          icon: 'report_problem'
        })
      }
    },
    // Delete TEAM from Db
    async deleteTeam (index) {
      this.$q.dialog({
        title: 'Delete Team',
        color: 'negative',
        message: 'You are deleting team ' + this.teams[index].name + ' from the system. This will also delete all associated studies and corresponding data. This cannot be undone. Would you like to continue?',
        ok: 'Yes, delete Team: ' + this.teams[index].name,
        cancel: 'Cancel'
      }).onOk(async () => {
        const teamName = this.teams[index].name
        const teamKey = this.teams[index]._key
        try {
          await API.deleteTeam(teamKey)
          this.$q.notify('Team ' + teamName + ' Deleted')
        } catch (err) {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot delete team ' + teamName,
            icon: 'report_problem'
          })
        }
        this.getTeams()
        this.$emit('teamDeleted', teamKey)
      })
    }
  }
}
</script>
